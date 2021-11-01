// Home screen
import React, { Component } from 'react';
//import react in our code.
import { Keyboard, ActivityIndicator, KeyboardAvoidingView, TextInput, Button, Text, View, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Modal, Image, ImageBackground, TouchableWithoutFeedback, Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import colorTheme from '../../config/theme.style'
import { withNavigation } from 'react-navigation';
import { Rating, AirbnbRating } from 'react-native-elements';
import CustomButton from '../../components/CustomButton';
import UserDetailsModal from '../../components/UserDetailsModal';
import { onSignIn, isSignedIn } from '../../config/auth'
import moment from "moment";
import SocketIOClient from 'socket.io-client'
import { apiUrl, domain } from './../../config/constants'
import AsyncStorage from '@react-native-community/async-storage';
import getRealm from '../../schemas/realm'

import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAccessoryView, KeyboardAccessoryNavigation } from 'react-native-keyboard-accessory';
import CustomModal from '../../components/CustomModal';
import api from './services'
import { noAthorized } from '../../components/Utils'
//import all the components we are going to use.
const { width } = Dimensions.get('window');
const height = width * 1;
const screenHeight = Dimensions.get('window').height;

import FastImage, { FastImageProps } from 'react-native-fast-image'
import { RESULTS } from 'react-native-permissions';

/***
 * Redux
 */
import { connect } from "react-redux";
import { messageData } from '../../../redux/actions/messages'

class ChatRoom extends Component {
  /**
   * 
   * 
   * 
   * 
   *   this.state.matchInfo.receiverUserId Deve ser o id do usuário logado, vai precisar do nome também
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * @param {*} props 
   */
  constructor(props) {
    super(props)
    noAthorized(props)
    this.scroll = null;
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));

    
    /**
     * Connecting socket to backend
     */
    this.socket = SocketIOClient(domain);


    /**
     * Socket listen
     * All linsten will be in controller
     */

    //Listen on new_message
    this.socket.on("new_message", async (newMessage) => {
      /**
       * Clean typing state when any user send message
       */

      let localData = await AsyncStorage.getItem('messages')
      let chatData = JSON.parse(localData)

      /**
       * Logical to append messages and clean input only after message has been received by backend (socket.io)
       */
      newMessage.myTotal = chatData && chatData.messages && chatData.messages.length > 0 ? chatData.messages.length : 0
      this.props.messageData({ ...newMessage })
      const oldMessages = this.state.messages;
      this.setState({
        messages: [...oldMessages, newMessage],
        typingText: '',
      }, () => {
        /**
         * Updating chat info when user sand message
         */
        this.updateChatInfo(this.state.messages)
      })
    })



    //Listen on changLog
    this.socket.on("chat_log", (data) => {
      console.warn(data)
    })


    //Listen on chat update message
    this.socket.on("update_chat_info", (data) => {
      this.saveLocalMessageData(data)
    })


    //Listen on typing
    this.socket.on('typing', (data) => {

      this.setState({ typingText: data.username + " is typing a message...", room: this.state.chatName })
      // console.log( data.username + " is typing a message...")
    })

    // Get local storage data from another user
    // this.socket.on('other_user_data', (data) => { alert('other_user_data', data)})
    this.socket.on('get_other_user_chat_data', (data) => {
      setTimeout(() => {
        this.socket.emit('set_other_user_chat_data', data)

      }, 1000)
      // this.socket.emit('set_other_user_chat_data', data)
    })

    this.socket.on('set_other_user_chat_data', (data) => {
      let d = JSON.parse(data.userLocalDataMessages)
      this.setState({ messages: d && d.messages ? d.messages : [] })
    })


    this.state = {
      modalVisible: false,
      ratingSent: 0,
      addNoteText: '',
      testSender: 1,
      typingText: '',
      getting: '',
      matchInfo: [],
      loading: true,
      id: props.navigation.state.params.id,
      chatName: '',
      messages: []

    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.pokemons !== this.state.pokemons) {
      alert('pokemons state has changed.')
    }
  }
  async saveRepository (data) {
    const realm = await getRealm()
    console.warn(data)
    realm.write(() => {
      realm.create('Repository', data)
    })
  }

  handleSaveMessage = async () => {
    try {
      await this.saveRepository({
        id: 144657615,
        name: "unform",
        fullName: "Rocketseat/unform",
        description: "Easy peasy highly scalable ReactJS & React Native forms! 🚀",
        stars: 5,
        forks: 100
      })
    } catch (error) {
      alert('Erro try: '+ error)
    }
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

  rating(rating) {
    isSignedIn().then((token) => {
      this.setState({ processing: true })
      api.posRating(JSON.parse(token), { score: rating, type: 'POS', posMatchUserId: this.state.matchInfo.senderUserId })
        .then(res => {
          this.setState({ processing: false })
          this.setState(prevState => ({
            matchInfo: {
              ...prevState.matchInfo,
              posRating: {
                ...prevState.posRating,           // copy all other key-value pairs of food object
                sent: {                        // specific object of food object
                  ...prevState.posRating.sent,    // copy all pizza key-value pairs
                  score: this.state.ratingSent // update value of specific key
                }
              }
            }
          }))
          console.warn(res)
        })
        .catch(err => alert(err.response.data.message))
    })
  }

  ratingCompleted = (rating) => {
    this.setState({ ratingSent: rating })
  }
  buttonClickListener = async () => {
    //const { TextInputValue }  = this.state ;
    //Alert.alert(TextInputValue);
    let localData = await AsyncStorage.getItem('messages')
    let chatData = JSON.parse(localData)
    const newMessage = {
      id: 20,
      sender: this.state.matchInfo.receiverUserId,
      message: this.state.addNoteText.trim(),
      datetime: moment(new Date()).format("YYYY-MM-DD HH:mm"),
      time: moment().unix(),
      total: chatData && chatData.messages && chatData.messages.length > 0 ? chatData.messages.length : 0
    };
    /**
     * SEND Message to chat
     */
    this.sendMessage({ ...newMessage, room: this.state.chatName, username: 'Nome do usuário logado no app' })
    /**
     * Clean local user input
     */
    this.setState({ addNoteText: '' })
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  componentWillMount() {
    // AsyncStorage.removeItem('messages')
    this.getUserOtherStorate()
    this.setState({pokemons: 1})
  }

  getUserOtherStorate = async (room) => {
    let userLocalDataMessages = await AsyncStorage.getItem('messages')
    this.socket.emit('get_other_user_chat_data', { room: this.props.navigation.getParam('chatName'), userLocalDataMessages })


  }
  _keyboardDidShow() {
    this.scroll.scrollToEnd({ animated: true });
  }

  _keyboardDidHide() {
    this.scroll.scrollToEnd({ animated: true });
  }

  componentDidMount() {
    this.chatInfo()

  }



  chatInfo = async () => {
    //const { navigation } = this.props;
    //const { navigation } = this.props;
    isSignedIn().then((token) => {
      this.setState({ hasMore: false, loadingMore: true })
      api.chatRoom(JSON.parse(token), this.props.navigation.getParam('chatName'))
        .then(res => {

          /**
           * USER ENTER TO CHAT BY CHATNAME
           */

          this.chatJoin(res.data[0].chatName)
          // this.getUserOtherStorate(res.data[0].chatName);

          /**
           * Set state
           */
          this.setState({
            loading: false,
            matchInfo: res.data[0],
            chatName: res.data[0].chatName
            //cards: [Number(this.state.cards) + Number(res.data.userInfo.length)]
          })
          console.warn(this.state.matchInfo)
        })
        .catch(err => alert(err.response.data.message))
    }
    );
  }

  /**
   * Client enter to the chat by chatId (String)
   * Example: "59e1d4a0-6576-11ea-953b-c7c9ce40c9d9"
   */
  chatJoin = (chatid) => {
    this.socket.emit('room', chatid);
    this.setState({
      chatName: chatid
    })
  }

  /**
   * Logical when user is typing
   * Use on keypress to send emit
   * chatId:  "59e1d4a0-6576-11ea-953b-c7c9ce40c9d9"
   * Username: Jhon Dear
   */
  typing = () => {
    this.socket.emit('typing', { room: this.state.chatName, username: 'Alguém ', ...this.state.matchInfo })
  }


  /** 
   * SEND NEW Message
   * { chatId: '59e1d4a0-6576-11ea-953b-c7c9ce40c9d9',
        username: 'Aldenir Flauzino',
        message: 'Oi' }
   */

  sendMessage = (data) => {
    this.socket.emit('new_message', { ...data, room: this.state.chatName })
  }


  changeUsername = (username) => {
    this.socket.emit('change_username', { username: username })
  }



  /**
   * Emit event every send message to backend, to make socket to save it to local user data (storage)
   */
  updateChatInfo = (messages) => {
    this.socket.emit('update_chat_info', { room: this.state.chatName, messages: messages, lastUpdate: moment().unix() })
  }

  saveLocalMessageData = async (messagesData) => {
    let userLocalDataMessages = await AsyncStorage.getItem('messages')

    // If user have no messagem in local yet get data from another user by socket
    if (!userLocalDataMessages) {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesData))
      return
    }

    /**
     * Convert local data to Json
     */
    let userLocalDataMessagesJson = JSON.parse(userLocalDataMessages)

    /**
     * If local data, lastUpdate greater than socket, new local data is local than is from last user message
     */

    let newLocalData = userLocalDataMessagesJson.lastUpdate > messagesData.lastUpdate ? userLocalDataMessagesJson : messagesData


    console.log('The older message is: ', newLocalData)
    AsyncStorage.setItem('messages', JSON.stringify(newLocalData))

  }


  render() {
    const { matchInfo, loading, typingText, getting } = this.state;

    if (!loading) {
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={{ flex: 1 }}
        >
          <SafeAreaView style={styles.container} forceInset={{ bottom: this.state.disableBottomSafeArea ? 'never' : 'always' }}>
            <View style={styles.inner}>
              <TouchableOpacity onPress={() => this.handleSaveMessage()}><Text>SALVAR</Text></TouchableOpacity>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.backButton}>
                  <Image style={{ height: 18, width: 10 }} source={require('../../assets/images/icons/backIcon.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.userInfo} onPress={() => this.showUserDetails(matchInfo.receiverUserId)}>
                  <View>
                    <FastImage style={styles.coverPhoto} source={{ uri: matchInfo.receiver.cover }} />
                  </View>
                  <View>
                    <Text style={styles.userDesc}>{(matchInfo.receiver.birthDate) ? matchInfo.receiver.firstName + ', ' + moment().diff(matchInfo.receiver.birthDate, 'years') : matchInfo.receiver.firstName}</Text>
                    <View style={styles.location}>
                      <Image source={require('../../assets/images/icons/pin.png')} style={styles.searchPic, { width: 10, height: 12, tintColor: colorTheme.TEXT_MUTED, marginRight: 3 }} />
                      {typingText ? <Text style={styles.city}>{typingText}</Text> :
                        <Text style={styles.city} numberOfLines={1}>{matchInfo.location.distance.toFixed(2) + ' km - ' + matchInfo.location.city}</Text>}
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.posMatch}
                  onPress={() => { this.open() }}>
                  <Text style={styles.label}>Pós-Match</Text>
                  <View style={styles.indicator}>

                    {(matchInfo.posRating.sent.score > 0 && matchInfo.posRating.sent.score > 0) ? (
                      <Text style={styles.text}>{matchInfo.posRating.sent.score.toFixed(1)}</Text>
                    ) : (matchInfo.posRating.sent.score == 0 && matchInfo.posRating.sent.score > 0) ? (
                      <Text style={styles.text}>-</Text>
                    ) : (
                          <Text style={styles.text}>?</Text>
                        )}
                    <Image style={{ width: 15, height: 15, tintColor: '#E0B645' }} source={require('../../assets/images/icons/star.png')} />
                  </View>
                </TouchableOpacity>
              </View>
              <ScrollView
                style={styles.messages}
                scrollsToTop={true}
                ref={(scroll) => { this.scroll = scroll; }}
                onContentSizeChange={(contentWidth, contentHeight) => {
                  this.scroll.scrollToEnd({ animated: true });
                }}>
                <View style={styles.messagesContainer}>
                  {this.state.messages.map((message, index) =>
                    <View key={index} style={[(message.sender == matchInfo.receiverUserId) ? [styles.message, styles.owner] : [styles.message, styles.guest]]}>
                      <Text style={[(message.sender == matchInfo.receiverUserId) ? [styles.messageText, styles.ownerText] : [styles.messageText, styles.guestText]]}>{message.message}</Text>
                      <Text opacity={0.5} style={[(message.sender == matchInfo.receiverUserId) ? [styles.messageTime, styles.ownerText] : [styles.messageTime, styles.guestText]]}>
                        {moment(message.datetime).format("DD/MM HH:mm")}
                      </Text>
                    </View>
                  )}
                </View>
              </ScrollView>
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
                <TouchableOpacity style={styles.sendButtom} onPress={this.buttonClickListener}>
                  <Image source={require('../../assets/images/icons/send.png')} tintColor='red' style={{ width: 17, height: 12 }} />
                </TouchableOpacity>
              </View>
              <Modal
                style={{ marginTop: 22 }}
                animationType="slide"
                transparent={false}
                visible={this.state.modalVisible}
                transparent="true">
                <View style={styles.modalContainer}>
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.modalComponent}>
                      <View style={styles.modalItem}>
                        {
                          (matchInfo.posRating.sent.score < 1) ? (
                            <View style={{ marginBottom: 15 }}>
                              <Text style={styles.modalTitle}>Dê uma nota de pós-match para {matchInfo.receiver.firstName}</Text>
                              <Text style={styles.modalParagraph}>Com base em seus contatos com {matchInfo.receiver.firstName}, qual é a sua nota?</Text>
                              <AirbnbRating
                                type='heart'
                                ratingCount={5}
                                defaultRating={matchInfo.posRating.sent.score}
                                imageSize={20}
                                showRating={false}
                                reviews={[]}
                                onFinishRating={this.ratingCompleted}
                              />
                              <Text style={styles.notes}>Sua nota não poderá ser alterada</Text>
                              <View style={{ marginTop: 15 }}>
                                <TouchableOpacity onPress={() => { this.rating(this.state.ratingSent); this.close() }}>
                                  <CustomButton text={'Enviar'} ></CustomButton>
                                </TouchableOpacity>
                              </View>
                            </View>

                          ) : (
                              <Text style={styles.modalTitle}>Você deu uma nota de pós-match {matchInfo.posRating.sent.score.toFixed(1)} para {matchInfo.receiver.firstName}.</Text>
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
    message: state.messageData.message
  };
};

const mapDispatchToProps = dispatch => {
  return {
    messageData: message => {
      dispatch(messageData(message))
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(ChatRoom));


const styles = StyleSheet.create({
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
    width: width - 120,
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
    flexShrink: 1
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

  sendButtom: {
    paddingTop: 10,
    paddingRight: 7,
    paddingBottom: 10,
    paddingLeft: 7,
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
  messageText: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '400'
  },
  messageTime: {
    fontSize: 12,
    opacity: 0.70
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
    backgroundColor: Platform.OS === 'ios' ? '#00000066' : 'transparent',
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
