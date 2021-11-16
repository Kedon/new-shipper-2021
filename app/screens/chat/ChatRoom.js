// Home screen
import React, { Component } from 'react';
//import react in our code.
import { RefreshControl, Keyboard, ActivityIndicator, KeyboardAvoidingView, TextInput, Button, Text, View, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Modal, Image, ImageBackground, TouchableWithoutFeedback, Platform, AppState, Alert, SafeAreaView } from 'react-native';
import colorTheme from '../../config/theme.style'
import { Rating, AirbnbRating } from 'react-native-elements';
import CustomButton from '../../components/CustomButton';
import UserDetailsModal from '../../components/UserDetailsModal';
import { onSignIn, isSignedIn } from '../../config/auth'
import moment from "moment";
import { apiUrl, domain } from './../../config/constants'
import AsyncStorage from '@react-native-community/async-storage';

import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAccessoryView, KeyboardAccessoryNavigation } from 'react-native-keyboard-accessory';
import CustomModal from '../../components/CustomModal';
import api from './services'
import firestore from '@react-native-firebase/firestore';
import CryptoJS from "react-native-crypto-js";
import { timelineRemove } from '../../../redux/actions/timelineActions';



//import all the components we are going to use.
const { width } = Dimensions.get('window');
const height = width * 1;
const screenHeight = Dimensions.get('window').height;

import FastImage, { FastImageProps } from 'react-native-fast-image'

/***
 * Redux
 */
import { connect } from "react-redux";
import { messageData } from '../../../redux/actions/messages'

class ChatRoom extends Component {
  /**
   * @param {*} props 
   */
  constructor(props) {
    super()
    this.state = {
      modalVisible: false,
      ratingSent: 0,
      addNoteText: '',
      testSender: 1,
      typingText: '',
      typing: false,
      getting: '',
      matchInfo: null,
      loading: true,
      id: props.route.params.id,
      chatName: '',
      messages: [],
      user: [],
      keyboardOffset: 0,
      increase: null,
      appState: AppState.currentState,
      refreshing: false,
      blocking: false,
      sending: false
    }
  }


  rating = (rating) => {
    isSignedIn().then((token) => {
    const { cover }  = this.props.route.params
      this.setState({ procesing: true })
      api.posRating(JSON.parse(token), { score: rating, type: 'POS', posMatchUserId: cover[0].receiverUserId })
        .then(res => {
          this.setState({ procesing: false })
          this.setState(prevState => ({
            matchInfo: {
              ...prevState.matchInfo,
              posRating: {
                ...prevState.posRating,
                sent: {
                  score: rating
                }
              }
            }
          }))
        })
        .catch(err => alert(err.response.data.message))
    })
  }

  ratingCompleted = (rating) => {
    this.setState({ ratingSent: rating })
  }

  showUserDetails(userId) {
    this.refs.details.open(userId);
  }
  showModal(title, description) {
    this.refs.modal.open(title, description);
  }

  open() {
    this.setState({ modalVisible: true })
  };

  close() {
    this.setState({ modalVisible: false })
  };
  buttonClickListener = async () => {
    const newMessage = {
      message: this.state.addNoteText.trim(),
      datetime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss.SSS"),
    };
    this.sendMessage({ ...newMessage })
    this.setState({ addNoteText: '' })
  }


  componentDidMount() {
    this.chatInfo()
    //console.warn(this.props.navigation.state.params.user)
    const md5 = this.userMd5()
    this.setState({ user: this.props.route.params.user, loading: false })
    //RECEBENDO AS MENSAGENS EM TEMPO REAL
    firestore()
      .collection('Chats')
      .doc(md5)
      .collection('messages')
      .orderBy("datetime", "desc")
      .limit(10)
      .onSnapshot((querySnapshot) => {
        //console.warn(JSON.stringify(querySnapshot.docs[0]._data, getCircularReplacer()))
        const messages = querySnapshot.docs.map((m) => {
          return m._data
        });
        this.setState({ messages })
      })


    //VERIFICA SE O OUTRO USUÁRIO ESTÁ COM O MEU CHAT ABERTO
    firestore()
      .collection("ActiveUsers")
      .doc(this.props.activeChat.userId)
      .get().then((doc) => {
        if (doc.exists && doc.data().activeChat) {
          this.setState({ increase: false }, () => {
            //console.warn("O outro usuário está com o meu chat aberto:", doc.data());
          })
        } else {
          // doc.data() will be undefined in this case
          this.setState({ increase: true }, () => {
            //console.warn("O outro usuário NÃO está com o meu chat aberto:");

          })
        }
      }).catch(function (error) {

      })

    this.makeMessagesRead(md5)

    //SALVA AS INFORMAÇOES DO USUÁRIO ATIVO
    firestore()
      .collection("ActiveUsers")
      .doc(this.props.user.userId)
      .set({ user: this.props.user.userId, activeChat: this.props.activeChat.userId }, { merge: true })
      .then(function () {
        //console.warn("Usuário ativo salvo com sucesso: ");
      })
      .catch(function (error) {
        console.error("Erro no usuário ativo: ", error);
      })

    AppState.addEventListener('change', this._handleAppStateChange);

    /**
     * Key board mount
     */
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );

  }

  makeMessagesRead = (md5) => {
    //MARCA AS MENSAGENS COMO LIDAS
    const colRef = firestore()
    let notes = [];
    const that = this;

    // Realtime updates listener
    this.unsubscribe = colRef.collection("Contacts")
      .where("contactId", "==", md5)
      .onSnapshot((querySnapshot) => {
        const notes = [];
        const contactData = querySnapshot.docs.map((m) => {
          return m._data
        });
        const property = contactData && contactData.length > 0 ? this.props.user.userId === contactData[0].owner.userId ? 'owner' : 'guest' : null
        if (property && property === 'owner') {
          firestore().collection("Contacts").doc(md5).update({ "owner.unread": 0 })
        } else if (property && property === 'guest') {
          firestore().collection("Contacts").doc(md5).update({ "guest.unread": 0 })
        }
        //console.warn(property)
        this.setState({ contactData, notes })
      });
  }

  HandleSendPush = async (tagValue, msg) => {
    try {
      let data = {
        title: tagValue.firstName,
        tagValue: tagValue.userId,
        icon: this.props.activeChat && this.props.activeChat.photos && this.props.activeChat.photos.length > 0 ? this.props.activeChat.photos[0].photoUrl : null,
        message: msg
      }

      let message = await api.sendPushNotification(data)
      //alert("OPA" + JSON.stringify(message))
    } catch (error) {
      alert(JSON.stringify(error))

    }
  }

  increaseCount = async () => {
    this.setState({ increase })
  }

  componentDidUpdate(prevState) {
    if (prevState.typing !== this.state.typing && this.state.typing) {
      this.typing()
    }
  }

  componentWillUnmount = () => {
    this.unsubscribe();
    firestore()
      .collection("ActiveUsers")
      .doc(this.props.user.userId)
      .set({ user: this.props.user.userId, activeChat: null }, { merge: true })
      .then(function () {
        //console.warn("Usuário ativo salvo com sucesso: ");
      })
      .catch(function (error) {
        console.error("Erro no usuário ativo: ", error);
      })
    //this.props.activeChat(null)

    AppState.removeEventListener('change', this._handleAppStateChange);

    /**
     * Remove Key board
     */
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = (event) => {
    this.scroll.scrollToEnd({ animated: true });
  }

  _keyboardDidHide() {
    // this.setState({
    //     keyboardOffset: 0,
    // })
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      //SALVA AS INFORMAÇOES DO USUÁRIO ATIVO AO COLOCAR EM FOREGROUND
      firestore()
        .collection("ActiveUsers")
        .doc(this.props.user.userId)
        .set({ user: this.props.user.userId, activeChat: this.props.activeChat.userId }, { merge: true })
        .then(function () {
          //console.warn("Usuário ativo salvo com sucesso: ");
        })
        .catch(function (error) {
          //  console.error("Erro no usuário ativo: ", error);
        })

    }

    if (nextAppState === 'background') {
      //SALVA O USUÁRIO COM NENHUM CHAT ABERTO AO COLOCAR EM BACKGROUND
      firestore()
        .collection("ActiveUsers")
        .doc(this.props.user.userId)
        .set({ user: this.props.user.userId, activeChat: null }, { merge: true })
        .then(function () {
          //console.warn("Usuário ativo salvo com sucesso: ");
        })
        .catch(function (error) {
          //  console.error("Erro no usuário ativo: ", error);
        })

    }
    this.setState({ appState: nextAppState });
  }



  chatInfo = async () => {
    //const { navigation } = this.props;
    //const { navigation } = this.props;
    const md5 = this.userMd5()
    const { navigation } = this.props;
    const { cover }  = this.props.route.params
    
    isSignedIn().then((token) => {
      this.setState({ hasMore: false, loadingMore: true })
      api.ratingScore(JSON.parse(token), cover[0].receiverUserId)
        .then(res => {
          if(res.data && res.data.length > 0){
            this.setState(prevState => ({
              matchInfo: {
                ...prevState.matchInfo,
                posRating: {
                  ...prevState.posRating,
                  sent: {
                    score:  res.data[0].score
                  }
                }
              }
            }))
          } else {
            this.setState({
              loading: false,
              matchInfo: res.data,
            })
          }
        })
        .catch(err => alert(err))
    }
    );
  }

  /**
   * Client enter to the chat by chatId (String)
   * Example: "59e1d4a0-6576-11ea-953b-c7c9ce40c9d9"
   */

  /**
   * Logical when user is typing
   * Use on keypress to send emit
   * chatId:  "59e1d4a0-6576-11ea-953b-c7c9ce40c9d9"
   * Username: Jhon Dear
   */


  /** 
   * SEND NEW Message
   * { chatId: '59e1d4a0-6576-11ea-953b-c7c9ce40c9d9',
        username: 'Aldenir Flauzino',
        message: 'Oi' }
   */

  typing = () => {
    const md5 = this.userMd5()
    const property = this.state.contactData && this.state.contactData.length > 0 ? this.props.user.userId === this.state.contactData[0].owner.userId ? 'owner' : 'guest' : null

    if (!this.state.typing) {
      this.setState({ typing: true }, () => {
        if (property && property === 'owner') {
          firestore().collection("Contacts").doc(md5).update({ "owner.typing": true })
        } else if (property && property === 'guest') {
          firestore().collection("Contacts").doc(md5).update({ "guest.typing": true })
        }
      })
    } else {
      if (this.state.addNoteText.length === 0) {
        this.setState({ typing: false }, () => {
          if (property && property === 'owner') {
            firestore().collection("Contacts").doc(md5).update({ "owner.typing": false })
          } else if (property && property === 'guest') {
            firestore().collection("Contacts").doc(md5).update({ "guest.typing": false })
          }
        })
      }
    }

  }

  userMd5() {
    let chatId = this.props.route.params.chatName
    return chatId
  }


  sendMessage = (data) => {
    const md5 = this.userMd5()
    
    this.setState({ typing: false }, () => {
      if (data && data.message && data.message.length > 0) {
        this.setState({ sending: true })
        firestore()
          .collection("Chats")
          .doc(md5)
          .collection("messages")
          .add({
            message: data.message,
            datetime: data.datetime,
            from: this.props.user.userId,
            to: this.props.activeChat.userId
          }
            , { merge: true })
          .then(function () {
            //console.warn("Document written with ID: ");
          })
          .catch(function (error) {
            //  console.error("Error writing document: ", error);
          });
        //INSERE OU ATUALIZA UM CONTATO
        const docRef = firestore().collection("Contacts").doc(md5);
        const { contactData } = this.state
        let owner = ''
        let guest = ''
        if (contactData && contactData.length === 0 || (contactData && contactData.length > 0 && contactData[0].owner.userId === this.props.user.userId)) {
          //usuário da lista (contato)
          guest = {
            userId: this.props.activeChat.userId,
            birthDate: this.props.activeChat.birthDate,
            blocked: false,
            firstName: this.props.activeChat.firstName,
            hobbies: this.props && this.props.activeChat && this.props.activeChat.hobbies ? this.props.activeChat : [],
            isMatche: this.props.activeChat.isMatche,
            location: this.props.activeChat.location,
            visibility: this.props.activeChat.visibility && typeof this.props.activeChat.visibility !== 'undefined' ? this.props.activeChat.visibility : null,
            photos: this.props.activeChat && this.props.activeChat.photos ? this.props.activeChat.photos : null,
            typing: false,
            unread: this.state.increase && parseFloat(contactData && contactData[0] && contactData[0].guest && contactData[0].guest.unread ? contactData[0].guest.unread : 0) + 1
          }
          //usuário logado(eu)
          owner = {
            userId: this.props.user.userId,
            birthDate: this.props.user.birthDate,
            blocked: false,
            firstName: this.props.user.firstName,
            hobbies: this.props && this.props.user && this.props.user.hobbies ? this.props.user.hobbies : [],
            isMatche: null,
            location: this.props.user.location,
            visibility: this.props.user.visibility && typeof this.props.user.visibility !== 'undefined' ? this.props.user.visibility : null,
            photos: this.props.user && this.props.user.photos ? this.props.user.photos : null,
            typing: false,
            unread: 0
          }


        } else {
          //usuário logado (eu)
          guest = {
            userId: this.props.user.userId,
            birthDate: this.props.user.birthDate,
            blocked: false,
            firstName: this.props.user.firstName,
            hobbies: this.props.user.hobbies,
            isMatche: null,
            location: this.props.user.location,
            visibility: this.props.user.visibility && typeof this.props.user.visibility !== 'undefined' ? this.props.user.visibility : null,
            photos: this.props.user && this.props.user.photos ? this.props.user.photos : null,
            typing: false,
            unread: 0
          }
          //usuário da lista (contato)
          owner = {
            userId: this.props.activeChat.userId,
            birthDate: this.props.activeChat.birthDate,
            blocked: false,
            firstName: this.props.activeChat.firstName,
            hobbies: this.props.activeChat.hobbies,
            isMatche: this.props.activeChat.isMatche,
            location: this.props.activeChat.location,
            visibility: this.props.activeChat.visibility && typeof this.props.activeChat.visibility !== 'undefined' ? this.props.activeChat.visibility : null,
            photos: this.props.activeChat && this.props.activeChat.photos ? this.props.activeChat.photos : null,
            typing: false,
            unread: this.state.increase && parseFloat(!contactData[0].owner.unread ? 0 : contactData[0].owner.unread) + 1
          }

        }

        /*if(contactData && contactData.length === 0){
          //INSERE USUÁRIO NA LISTA DE CONTATOS
          const { timelineRemove } = this.props
          isSignedIn().then((token) => {
            api.contacts(JSON.parse(token), { contactId: md5, senderUserId: owner.userId, receiverUserId: guest.userId })
            .then(res => {
              //remover usuário adicionado da timeline
              timelineRemove(guest.userId)
            })
            .catch(err => alert(err))
  
          })
  
  
          //REMOVE O USUÁRIO DA TIMELINE
        }*/

        docRef.set({
          lastMessage: data.message,
          datetime: data.datetime,
          //uread: data.total,
          users: [this.props.user.userId, this.props.activeChat.userId],
          contactId: md5,
          guest: guest,
          owner: owner
        }
          , { merge: true })
          .then( res => {
            console.log(res)
            this.setState({ sending: false })
          })
          .catch(error =>  {
            console.log("Error writing document: ", error);
          });
      }
    })
    if (this.state.increase) {
      this.HandleSendPush(this.props.activeChat, data.message)
      //alert(this.props.activeChat)
    } else {
      //this.HandleSendPush(this.props.activeChat, data.message)

    }
  }

  _onRefresh = () => {
    const last = this.state.messages && this.state.messages[0]
    const md5 = this.userMd5()
    firestore().collection("Chats")
      .doc(md5)
      .collection('messages')
      .orderBy("datetime", "desc")
      .where("datetime", "<", last.datetime)
      .limit(10)
      .onSnapshot((querySnapshot) => {
        const messages = querySnapshot.docs.map((m) => {
          return m._data
        });
        this.setState({ messages: [...this.state.messages, ...messages] })
      })


  }
  handleBlockContact = () => {
    const contact = this.state.contactData && this.state.contactData[0] ? this.state.contactData[0] : {}
    Alert.alert(
      `${contact.owner.blocked || contact.guest.blocked ? 'Desbloquear' : 'Bloquear'} contato`,
      `Tem certeza de que deseja ${contact.owner.blocked || contact.guest.blocked ? 'desbloquear' : 'bloquear'} ${this.props.route.params.cover[0].firstName}?`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "Cancelar"
        },
        { text: `Sim, ${contact.owner.blocked || contact.guest.blocked ? 'desbloquear' : 'bloquear'}!`, onPress: () => this.handleBlockUnmatch() }
      ]
    )
  }

  handleBlockUnmatch = () => {
    //alert(JSON.stringify(this.state.contactData[0], false, 3))
    
    const contact = this.state.contactData[0]
    const property = this.props.user.userId === contact.owner.userId ? 'owner' : 'guest'
    this.setState({ blocking: true })
    if(property && property === 'owner'){
        firestore().collection("Contacts").doc(contact.contactId).update({ "guest.blocked": !contact.guest.blocked }).then( res => {
          console.log('bclock')
          this.setState({ blocking: false })
        })
      } else if (property && property === 'guest'){
        firestore().collection("Contacts").doc(contact.contactId).update({ "owner.blocked": !contact.owner.blocked }).then( res => {
          console.log('bclock')
          this.setState({ blocking: false })
        })
      }
  }


  render() {
    const { matchInfo, loading, typingText, getting, user, contactData, increase, messages, ratingSent, blocking } = this.state;
    const { activeChat } = this.props
    const property = contactData && contactData.length > 0 ? this.props.user.userId === contactData[0].owner.userId ? 'owner' : 'guest' : null
    const { cover }  = this.props.route.params

    if (!loading) {
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={{ flex: 1, flexGrow: 1, height: '100%' }}
        >
          <SafeAreaView style={styles.container} forceInset={{ bottom: this.state.disableBottomSafeArea ? 'never' : 'always' }}>
            {blocking &&
            <View style={styles.overlay}>
              <ActivityIndicator color={colorTheme.PRIMARY_COLOR} />
            </View>
            }
            
            <View style={styles.inner}>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.backButton}>
                  <Image style={{ height: 18, width: 10 }} source={require('../../assets/images/icons/backIcon.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.userInfo} onPress={() => this.showUserDetails(user && user.userId)}>
                  <View>
                    <FastImage 
                      style={styles.coverPhoto} 
                      source={cover && cover[0] && cover[0].photoURL ? {uri: cover[0].photoURL} : require('../../assets/images/no-image.png')} />
                  </View>
                  <View>
                    <Text style={styles.userDesc}>{(user && user.birthDate) ? cover && cover[0].firstName + ', ' + moment().diff(user.birthDate, 'years') : cover && cover[0].firstName}</Text>
                    {cover && cover[0] && cover[0].city ?
                    <View style={styles.location}>
                      <Image 
                      source={require('../../assets/images/icons/pin.png')} style={styles.searchPic, { width: 10, height: 12, tintColor: colorTheme.TEXT_MUTED, marginRight: 3 }} />
                      {property === 'guest' && contactData && contactData.length > 0 && contactData[0].owner.typing || 
                      property === 'owner' && contactData && contactData.length > 0 && contactData[0].guest.typing
                      ? <Text style={styles.city}>Está digitando uma mensagem</Text> :
                        <Text style={styles.city} numberOfLines={1}><Text style={styles.distance}>{cover && cover[0].city}, {cover && cover[0].state}</Text></Text>
                      }
                    </View> :
                    <View style={styles.location}>
                    {property === 'guest' && contactData && contactData.length > 0 && contactData[0].owner.typing || 
                    property === 'owner' && contactData && contactData.length > 0 && contactData[0].guest.typing
                    ? <Text style={styles.city}>Está digitando uma mensagem</Text> :
                      <Text style={styles.city} numberOfLines={1}><Text style={styles.distance}></Text></Text>
                    }
                    </View>

                    }
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.posMatch}
                  onPress={() => { this.open() }}>
                  <Text style={styles.label}>Match</Text>
                  <View style={styles.indicator}>
                    
                    {matchInfo ? (matchInfo && matchInfo.posRating && matchInfo.posRating.sent && matchInfo.posRating.sent.score > 0 && matchInfo.posRating.sent.score > 0) ? (
                      <Text style={styles.text}>{matchInfo.posRating.sent.score.toFixed(1)}</Text>
                    ) : (matchInfo && matchInfo.posRating && matchInfo.posRating.sent && matchInfo.posRating.sent.score == 0 && matchInfo.posRating.sent.score > 0) ? (
                      <Text style={styles.text}>-</Text>
                    ) : (
                          <Text style={styles.text}>?</Text>
                        ) : <Text style={styles.text}>?</Text>}
                    <Image style={{ width: 15, height: 15, tintColor: '#E0B645' }} source={require('../../assets/images/icons/star.png')} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.blocked} onPress={this.handleBlockContact}>
                  <FastImage style={{ height: 20, width: 20}} source={require('./../../assets/images/icons/cancel.png')} resizeMode={FastImage.resizeMode.contain} />
                </TouchableOpacity>
              </View>
              <ScrollView
                style={styles.messages}
                scrollsToTop={true}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                  />
                }
                ref={(scroll) => { this.scroll = scroll; }}
                onContentSizeChange={(contentWidth, contentHeight) => {
                  this.scroll.scrollToEnd({ animated: true });
                }}
              >
                <View style={styles.messagesContainer}>
                  {messages ? messages.sort((a, b) => moment(a.datetime) - moment(b.datetime)).map((message, index) =>
                    <View key={index} style={[(message.to == user.userId) ? [styles.message, styles.owner] : [styles.message, styles.guest]]}>
                    <Text style={[(message.to == user.userId) ? [styles.messageText, styles.ownerText] : [styles.messageText, styles.guestText]]}>{message.message}</Text>
                    <Text opacity={0.5} style={[(message.to == user.userId) ? [styles.messageTime, styles.ownerText] : [styles.messageTime, styles.guestText]]}>
                      {moment(message.datetime).format("DD/MM HH:mm")}
                    </Text>
                  </View>
                ) :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 25 }}>
                      <ActivityIndicator />
                    </View>
                  }
                </View>
              </ScrollView>
              {contactData && contactData.length > 0 && (contactData[0].guest.blocked || contactData[0].owner.blocked) ?
                <View style={styles.notAllowed}>
                  <Text style={styles.notAllowedText}>Você não pode enviar mensagem para este contato</Text>
                </View>
                : contactData && contactData.length > 0 &&
                <View style={styles.textInputView}>
                  <TextInput
                    underlineColorAndroid="transparent"
                    style={styles.textInput}
                    onFocus={() => this.setState({ disableBottomSafeArea: true })}
                    onBlur={() => this.setState({ disableBottomSafeArea: false })}
                    multiline={true}
                    textAlignVertical={'top'}
                    onChangeText={(text) => {
                      this.typing()
                      this.setState({ addNoteText: text })
                    }
                    }

                    value={this.state.addNoteText}
                    autoCorrect={true}
                  />
                  <TouchableOpacity style={styles.sendButtom} onPress={this.state.sending ? null : this.buttonClickListener}>
                    {this.state.sending ?
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  :
                    <Image source={require('../../assets/images/icons/send.png')} style={{ width: 17, height: 12 }} />
                  }
                  </TouchableOpacity>
                </View>
              }
              <Modal
                style={{ marginTop: 22 }}
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
              //transparent="true"
              >
                <View style={styles.modalContainer}>
                  <Text>{JSON.stringify(matchInfo ? true : false)}</Text>
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.modalComponent}>
                      <View style={styles.modalItem}>
                        {
                          (!matchInfo) ? (
                            <View style={{ marginBottom: 15 }}>
                              <Text style={styles.modalTitle}>Quantas estrelas você da para o match com {cover[0].firstName.split(' ').slice(0, 1)}?</Text>
                              <Text style={styles.modalParagraph}>Avalie como foi a sua experiência com este match.</Text>
                              <View style={styles.stars}>
                              {[6,7,8,9,10].map((m) =>
                              <TouchableOpacity key={`stars_${m}`} onPress={() => this.ratingCompleted(m)}>
                                <Image style={{ width: 45, height: 45, marginLeft: 5, marginRight: 5, tintColor: m <= ratingSent ? '#E0B645' : '#EDEDED' }} source={require('../../assets/images/icons/star.png')} />
                              </TouchableOpacity>
                              )}
                              </View>
                              {/*<Text style={styles.notes}>Você não poderá alterar a quantidade de estrelas.</Text>*/}
                              <View style={{ marginTop: 15 }}>
                                <TouchableOpacity onPress={() => { this.rating(this.state.ratingSent); this.close() }}>
                                  <CustomButton text={'Enviar'} ></CustomButton>
                                </TouchableOpacity>
                              </View>
                            </View>

                          ) : (
                            <Text style={styles.modalTitle}>Você deu {matchInfo && matchInfo.posRating && matchInfo.posRating.sent && matchInfo.posRating.sent.score.toFixed(1)} estrelas para o seu match com {cover[0].firstName.split(' ').slice(0, 1)}.</Text>
                          )

                        }

                      </View>
                      <TouchableOpacity onPress={() => {
                        this.close();
                      }}>
                        <Text style={styles.closeButton}>Fechar</Text>
                      </TouchableOpacity>

                    </View>
                  </View>
                </View>
              </Modal>
              <UserDetailsModal ref="details" />
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      );
    } else {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 25, paddingRight: 25 }}>
          <ActivityIndicator />
        </View>

      )
    }
  }
}
/** Redux */
const mapStateToProps = state => {
  return {
    message: state.messageData.message,
    activeChat: state.chats.activeChat,
    user: state.userData.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    messageData: message => {
      dispatch(messageData(message))
    },
    timelineRemove: data => {
      dispatch(timelineRemove(data))
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatRoom);


const styles = StyleSheet.create({
  overlay: {
    backgroundColor: Platform.OS === 'ios' ? '#ffffff' : 'rgba(255,255,255,0.9)',
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999
  },
  blocked: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  stars: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    borderColor: '#000',
  },
  inner: {
    flex: 1,
    justifyContent: "flex-end",
  },
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    //width: width - 130,
    borderBottomWidth: 1,
    borderBottomColor: '#e9e9e9',
    padding: 10,
  },
  backButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10
  },
  userInfo: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    width: width - 130,
  },
  profileInfo: {
    justifyContent: 'center',
    alignItems: 'center',

  },
  coverPhoto: {
    width: 42,
    height: 42,
    borderRadius: 100 / 2,
    marginRight: 10
  },
  userDesc: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 2,
    flexShrink: 1,
    maxWidth: width - 185
  },
  city: {
    fontWeight: '400',
    fontSize: 13,
    color: colorTheme.TEXT_MUTED,
  },
  codeArea: {
    marginTop: 20,
    marginRight: 20,
    marginLeft: 20,
  },
  topDescription: {
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    padding: 20,
    display: 'flex',
    //alignItems: 'center',
    justifyContent: 'center',

  },
  topDescriptionText: {
    fontSize: 18,
    color: '#FFF'
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center'
  },
  expiration: {
    color: colorTheme.TEXT_MUTED,
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center'
  },

  learnMore: {
    fontSize: 16,
    marginBottom: 10,
    color: colorTheme.PRIMARY_COLOR,
    fontWeight: '600',
    textAlign: 'center'
  },
  code: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: '#F1F1F1',
    borderColor: '#d9d9d9',
    borderWidth: 1,
    padding: 10
  },

  footer: {
    flexDirection: "row",
  },
  textInputView: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: -3,
    maxHeight: 100,
    width: width,
    borderTopWidth: 1,
    borderTopColor: '#e9e9e9',
    backgroundColor: '#FFF'
  },
  textInput: {
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#CCC',
    backgroundColor: '#F1F1F1',
    padding: 10,
    fontSize: 16,
    marginRight: 10,
    textAlignVertical: 'top',
    width: width - 80
  },
  searchIcon: {
    paddingLeft: 10,
  },
  search: {
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    //borderColor: '#d9d9d9',
    //borderWidth: 1,
    paddingLeft: 13,
    borderRadius: 20
  },
  searchbox: {
    flexGrow: 1,
    width: width - 80,
    paddingRight: 10
  },
  notAllowed: {
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notAllowedText: {
    color: colorTheme.GREY_COLOR
  },
  sendButtom: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3,
    marginRight: 3,
    marginBottom: 3,
    borderRadius: 25,
    backgroundColor: colorTheme.PRIMARY_COLOR
  },
  messages: {
    backgroundColor: '#F1F1F1',
    display: 'flex',
  },
  messagesContainer: {
    paddingRight: 5,
    paddingLeft: 5,
    paddingTop: 5,
    paddingBottom: 5,

  },
  message: {
    maxWidth: '80%',
    padding: 8,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1
  },
  guest: {
    backgroundColor: '#FFF',
    marginRight: 'auto',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 2,

  },
  owner: {
    backgroundColor: colorTheme.PRIMARY_COLOR,
    marginLeft: 'auto',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 2,
    borderBottomLeftRadius: 10,
  },
  ownerText: {
    color: '#FFF',
    textAlign: 'right',
  },
  guestText: {
    color: colorTheme.DARK_COLOR,
    textAlign: 'right',
  },
  messageText: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '400'
  },
  messageTime: {
    fontSize: 12,
    opacity: 0.70,
  },
  label: {
    color: '#A6AEBC',
    fontSize: 10,
    textAlign: 'center',
  },
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 25,
  },
  text: {
    color: '#555',
    fontSize: 16,
    marginRight: 4,
    fontWeight: '600',
    textAlign: 'center',
  },
  posMatch: {
    marginLeft: 10,
    textAlign: 'center',
  },
  modalContainer: {
    backgroundColor: Platform.OS === 'ios' ? '#00000066' : 'rgba(0,0,0,0.5)',
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalComponent: {
    height: 'auto',
    flex: 1,
    flexDirection: 'column',
    width: width - 50,
    marginRight: 10,
    marginLeft: 10,
    justifyContent: 'center',
  },
  modalItem: {
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    padding: 15
  },
  modalTitle: {
    fontSize: 25,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontWeight: '600',
  },
  modalParagraph: {
    fontSize: 20,
    lineHeight: 23,
    marginBottom: 10,
    textAlign: 'center',
  },
  closeButton: {
    color: '#FFF',
    marginTop: 20,
    textAlign: 'center'
  },
  notes: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5,
  }
});