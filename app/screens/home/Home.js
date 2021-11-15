// Home screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, ScrollView, SafeAreaView, StyleSheet, StatusBar, FlatList, Dimensions, ActivityIndicator, TouchableOpacity, PermissionsAndroid, Linking ,Button} from 'react-native';

import NetInfo from "@react-native-community/netinfo";
import CustomHeader from '../../components/Header'
import CustomCard from '../../components/CustomCard'
import BlankCard from '../../components/BlankCard'
import TimelineAds from '../../components/TimelineAds'
import { onSignIn, onSignOut, isSignedIn } from '../../config/auth'
import AsyncStorage from '@react-native-community/async-storage';
import MatchPopup from '../../components/MatchPopup';
import EmptyState from '../../components/EmptyState';
import EmptyState2 from '../../components/EmptyState2';
import { connect } from 'react-redux';
import { userData } from '../../../redux/actions/userActions';
import { checkinData } from '../../../redux/actions/checkinActions';
import { noAthorized } from '../../components/Utils'
import CustomModalComponent from '../../components/CustomModalComponent'
import CustomButton from '../../components/CustomButton';
import GpsState from '../../components/GpsState';
import api from './services'
import couponsApi from '../../screens/profile/services'
import CustomDropdownAlert from '../../components/CustomDropdownAlert'
import colorTheme from '../../config/theme.style'
import { activeChat } from '../../../redux/actions/chatsActions'


import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import firestore from '@react-native-firebase/firestore';


//import all the components we are going to use.
const { width } = Dimensions.get('window');
const height = width * 1;
const screenHeight = Dimensions.get('window').height;


/**
 * Checar localização quando entra pela primeira vez
 */

class HomePage extends Component {
  constructor(props) {
  super(props);
    //this.verifyLocationPermission = this.verifyLocationPermission.bind(this);
  }

  state = {
    timeline: [],
    //user: [],
    loading: true,
    openModal: false,
    loadingMore: false,
    current_page: 1,
    hasMore: true,
    cards: 0,
    offset: 0,
    adsOffset: 0,
    coupom: [],
    coupomMatch: [],
    matchOffset: 0,
    cardsViewed: 1,
    headerToken: null,
    processing: null,
    //user: this.props.user,
    partners:
    {
      logoBackground: 'dark',
    },
    connection: {
      type: null,
      isConnected: false
    },
    matchInfo: {}
  };


componentDidMount() {
  console.warn(JSON.stringify(this.props))

  // onSignOut().then(data => {
  //   const { navigation } = this.props;
  //   navigation.navigate('Auth', { data: {} })
  // })
  

    if(!this.state.connection.isConnected){
        //await this.CheckConnectivity() //Não está usando
        
        this.checkInternetConnection()
    }

 }

 checkInternetConnection = () => {
   console.warn(this.props.user.userToken)
  if(this.props.user.userToken){
    this.setState({headerToken: this.props.user.userToken}, () =>
    this.unsubscribe = NetInfo.addEventListener(state => {
     this.setState({ connection: { type: state.type, isConnected: state.isConnected } }, () => {
       if(this.state.connection.isConnected){
          //VERIFICAR SE OS DADOS DO USUÁRIO POSSUI A GEOLOCALIZAÇÃO
          if(this.props.user && this.props.user.user && this.props.user.user.location){
            console.warn('mostrar a timeline')
            //this.getTimeline()
            //this.setState({gpsState: true}, () => this.getTimeline())
          } else {
            //this.setState({gpsState: false})
          }
       }  
     }
   )
 }))

}
    //VERIFICA SE O USUÁRIO ESTÁ CONECTADO
}

  getTimeline = async () => {
    //alert(JSON.stringify(this.state.loadingMore))
    //alert(JSON.stringify(this.props.preferences))
    const ageRange = this.props.preferences && this.props.preferences.ageRange.split(',')
    
    const params = {
      ageFrom: ageRange && ageRange[0],
      ageTo: ageRange && ageRange[1],
      looking: this.props.preferences && this.props.preferences.looking,
      distance: this.props.preferences && this.props.preferences.distance
    }

    console.warn(params)
  

    if (!this.state.loadingMore) {
      
      const { timelineData } = this.props;
      this.setState({loadingMore: true});
      await api.timeline(this.state.headerToken, { current_page: this.state.current_page, offset: this.state.offset, adsOffset: this.state.adsOffset }, params)
          .then((res) => {
            if (res.data.userInfo.length > 0) {
              this.setState({

                hasMore: res.data.userInfo.length > 0 ? true : false,
                timeline: [...this.state.timeline, ...res.data.userInfo],
                current_page: res.pagination.next_page !== null ? res.pagination.current_page + 1 : res.pagination.current_page + 1,
                offset: this.state.offset + res.data.userInfo.filter( f => f.contentType == 'user').length,
                adsOffset: res.pagination.adsOffset,
                cards: [Number(this.state.cards) + Number(res.data.userInfo.length)]
              }, () => {
                //preferencesData(res.data.userInfo)
                this.setState({ loadingMore: false, timeline: this.state.timeline}, () => this.setState({loading: false}))
              })
            } else {
              this.setState({
                loading: false,
                hasMore: false,
              }, () => this.setState({ loadingMore: false }))
            }
          })
          .catch(err => {
            this.setState({
              loading: false,
              hasMore: false
            })
            //alert(err)
          })

    }
  }

  tryToloadMoreCards = (length) => {
    if(length === 0){
      //this.getTimeline()
    }
  }

  cardActions = async (action, card, resource, data) => {
    //console.warn()
    //alert(JSON.stringify(data))
    if (action == 'like') {
      const timelineAtualizada = this.state.timeline.filter((user) => user.userId !== resource.userId)
      this.setState({ timeline: timelineAtualizada,  offset: this.state.offset - 1})
      
      if (data.isMatche == true) {
        //console.warn(data)
        if(this.props.user.userToken){
          api.coupons(this.props.user.userToken, { offset: this.state.offset, page: "match", metrics: "prints" })
            .then(res => {
              this.setState({ coupomMatch: res.data, offset: res.pagination.offset, loading: false }, () => { this.MatchPopup(resource, data); this.tryToloadMoreCards(timelineAtualizada.length) })
              //ADICIONA O CUPOM PARA AMBOS OS USUARIOS
              //alert(JSON.stringify(res))
              const couponInfo = {
                couponId: res.data[0].couponId,
                validity: res.data[0].validity,
                code: res.data[0].code 
              }

              this.autoActivateCoupon(couponInfo, resource.userId)
            })
            .catch(err => { this.MatchPopup(resource, data) })
          }

        
        //CRIA CHAT NO FIREBASE
        this.createOrUpdateContact(resource, data.chatName)

      } else {
        //console.warn('no isMatche')
      }

      

    } else if (action == 'remove') {
      this.setState({ processing: resource })
      if(this.props.user.userToken){
        api.remove(this.props.user.userToken, resource)
          .then(res => {
            if(res.data){
              const timelineAtualizada = this.state.timeline.filter((user) => user.userId !== resource)
              this.setState({ timeline: timelineAtualizada,  offset: this.state.offset - 1, processing: null }, () => this.tryToloadMoreCards(timelineAtualizada.length))
            }
          })
          .catch(err => { this.MatchPopup(data); console.warn(err); })
      };
      
    }
  }


  autoActivateCoupon = async (couponInfo, receiverUserId) => {
    if(this.props.user.userToken){
      couponsApi.autoActivate(this.props.user.userToken, {couponInfo, receiverUserId})
          .then(res => {

          })
          .catch(err => console.warn(err))
      }
    //this.setState({activated_at: moment(new Date()).format("YYYY-MM-DD HH:mm")});
    //
  }

  createOrUpdateContact = (user, chatName) => {
    console.log(`createOrUpdateContact`)
    console.log(`chatName: ${chatName}`)
    console.log(chatName)
    console.log(`this.state.user: ${JSON.stringify(user)}`)
    console.log(`user.hobbies: ${JSON.stringify(user && user.hobbies && user.hobbies.length > 0 ? user.hobbies : [])}`)
      //INSERE OU ATUALIZA UM CONTATO
      //firestore().collection("Contacts").doc(chatName).set({lastMessage: card});
        //usuário da lista (contato)
        const guest = {
          userId: user.userId,
          birthDate: user.birthDate,
          blocked: false,
          firstName: user.firstName,
          hobbies: user && user.hobbies && user.hobbies.length > 0 ? user.hobbies : [],
          isMatche: null,
          location: user.location,
          //visibility: this.props.user.visibility,
          photos: user && user.photos.length > 0 ? user.photos :  null,
          typing: false,
          unread: 0
        }
        //usuário logado(eu)
        const owner = {
          userId: this.props.user.user.userId,
          birthDate: this.props.user.user.birthDate,
          blocked: false,
          firstName: this.props.user.user.firstName,
          hobbies: this.props.user.user.hobbies,
          isMatche: null,
          location: this.props.user.user.location,
          //visibility: this.props.user.visibility,
          photos: this.props.user && this.props.user.user && this.props.user.user.cover ? [this.props.user.user.cover] :  
                  this.props.user && this.props.user.user && this.props.user.user.photos && this.props.user.user.photos.length > 0 ? this.props.user.user.photos.length : 
                  null,
          typing: false,
          unread: 0
        } 

        console.log(`const owner: ${JSON.stringify(guest)}`)
        console.log(`const owner: ${JSON.stringify(owner)}`)
        console.log(`const botha: ${JSON.stringify({
          lastMessage: null,
          datetime: new Date(),
          uread: 0,
          users: [ this.props.user.user.userId, user.userId ],
          contactId: chatName,
          guest: guest,
          owner: owner
        })}`)

        firestore()
        .collection("Contacts")
        .doc(chatName)
        .set({
          lastMessage: null,
          datetime: new Date(),
          uread: 0,
          users: [ this.props.user.user.userId, user.userId ],
          contactId: chatName,
          guest: guest,
          owner: owner
        }, { merge: true })
        .then(function () {
          console.warn("Usuário ativo salvo com sucesso: ");
        })
        .catch(function (error) {
          console.error("Erro no usuário ativo: ", error);
        })


      /*const { contactData } = this.state
      let owner = ''
      let guest = ''
      if(contactData && contactData.length === 0 || (contactData && contactData.length > 0 && contactData[0].owner.userId === this.props.user.userId)){
        //usuário da lista (contato)
        guest = {
          userId: this.props.activeChat.userId,
          birthDate: this.props.activeChat.birthDate,
          blocked: false,
          firstName: this.props.activeChat.firstName,
          hobbies: this.props.activeChat.hobbies,
          isMatche: this.props.activeChat.isMatche,
          location: this.props.activeChat.location,
          visibility: this.props.activeChat.visibility,
          photos: this.props.activeChat && this.props.activeChat.photos ? this.props.activeChat.photos : null,
          typing: false,
          unread: this.state.increase && parseFloat(contactData[0] && contactData[0].guest && contactData[0].guest.unread ? contactData[0].guest.unread : 0) + 1
        }
        //usuário logado(eu)
        owner = {
          userId: this.props.user.userId,
          birthDate: this.props.user.birthDate,
          blocked: false,
          firstName: this.props.user.firstName,
          hobbies: this.props.user.hobbies,
          isMatche: null,
          location: this.props.user.location,
          visibility: this.props.user.visibility,
          photos: this.props.user && this.props.user.photos ? this.props.user.photos :  null,
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
          visibility: this.props.user.visibility,
          photos: this.props.user && this.props.user.photos ? this.props.user.photos :  null,
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
          visibility: this.props.activeChat.visibility,
          photos: this.props.activeChat && this.props.activeChat.photos ? this.props.activeChat.photos : null,
          typing: false,
          unread: this.state.increase && parseFloat(!contactData[0].owner.unread ? 0 : contactData[0].owner.unread) + 1
        }

      }*/

    
  }

  getCoupons = async () => {
    //const { navigation } = this.props;
    //console.warn('get: ' + this.state.offset)
  }

  coupomActions = (params) => {
    //this.setState({offset: params})
    //console.warn('coupomActions')
    this.getCoupons()
  }

  searchUpdate = () => {
    this.setState({ loadingMore: true })
    this.getTimeline();
  }

  MatchPopup(match, user) {
    console.log("USER: " + JSON.stringify(user))
    console.log("MATCH: " + JSON.stringify(match))
    this.refs.match.open(user, match);
  }

  goToChat = (user, chatName, cover) => {
    const { navigation } = this.props;
    navigation.navigate('ChatRoom', {user, chatName, cover})
    this.props.activeChat(user)
    this.refs.match.close();
  }

  isCloseToRight({ layoutMeasurement, contentOffset, contentSize }) {
    return layoutMeasurement.width + contentOffset.x
      >= contentSize.width - layoutMeasurement.width;
  }

  componentDidUpdate(prevProps, prevState) {
    //VERIFICA SE HOUVE MUDANÇA NAS PREFERÊNCIAS DO USUÁRIO
    const oldProps = JSON.stringify(prevProps.preferences);
    const newProps = JSON.stringify(this.props.preferences);
    console.warn(this.props.preferences)
    if (oldProps != newProps) {
      this.setState({
        timeline: [],
        loading: true,
        loadingMore: false,
        current_page: 1,
        hasMore: true,
        cards: 0,
        offset: 0,
        coupom: [],
        coupomMatch: [],
        matchOffset: 0,
        cardsViewed: 1,
      }, () => {
        /**
         * ver isso
         */
        this.getTimeline()
      })
    }

    //VERIFICA SE O USUÁFIO FEZ CHECKIN EM ALGUM PARCEIRO
    const oldCheckin = JSON.stringify(prevProps.checkin);
    const newCheckin = JSON.stringify(this.props.checkin);
    if (oldCheckin != newCheckin) {
      this.setState({
        timeline: [],
        loading: true,
        loadingMore: false,
        current_page: 1,
        hasMore: true,
        cards: 0,
        offset: 0,
        coupom: [],
        coupomMatch: [],
        matchOffset: 0,
        cardsViewed: 1,
      }, () => {
        /**
         * Ver isso
         */
        this.getTimeline()
      })
    }

    const oldUser = JSON.stringify(prevProps.user.user);
    const newUser = JSON.stringify(this.props.user.user);
    console.warn("USSEROLD: " + oldUser)
    console.warn("USSENEW: " + newUser)
    console.warn(JSON.stringify(this.props.user.userToken))
    if (oldUser != newUser) {
      //VERIFICAR SE OS DADOS DO USUÁRIO POSSUI A GEOLOCALIZAÇÃO
      if(this.props.user && this.props.user.user && (this.props.user.user.latitude && this.props.user.user.longitude )){
        //this.getTimeline()
        this.getTimeline()
      } else {

        this.getTimeline()
      }

      //SE POSSUIR, MOSTRAR A TIMELINE

      //SE NÃO POSSUIR, MOSTRAR MENSAGEM DE GPS
      console.warn("USSERSSS: " + JSON.stringify(this.props.user.user))
    }

    //VERIFICA SE O TOKEN DO USUário foi setado
    const oldUserToken = JSON.stringify(prevProps.user.userToken);
    const newUserToken = JSON.stringify(this.props.user.userToken);
    if(oldUserToken != newUserToken) {
      
      this.checkInternetConnection()
    }

  }

  removeAd = async (coupom) => {
    //const timelineAtualizada = this.state.timeline.filter((user) => user.userId !== resource)
    //this.setState({ timeline: timelineAtualizada,  offset: this.state.offset - 1 }, () => this.tryToloadMoreCards(timelineAtualizada.length))
    let timeline = [...this.state.timeline];
    let ad = {...timeline[coupom-1]};

    if(this.props.user.userToken){
      api.removeAd(this.props.user.userToken, ad.ads[0].couponId)
        .then(res => {
          if(res.data){
            timeline[coupom-1] = ad;
            ad.visible = false;
            this.setState({ timeline })
          }
        })
        .catch(err => { this.MatchPopup(data); console.warn(err); })
    };


    
  }

 
  requestSettings = async () => {
    //alert('reques')
    try {
      await Linking.openSettings('app-settings:');
      let intervalId = setInterval(this.watchSettings, 1000)
      this.setState({ intervalId: intervalId })
    } catch (err) {
      //alert(err) //ALERT DESATIVADO
    }
  }

  HandleSendPush = async (tagValue, msg) => {
    console.warn(JSON.stringify(this.props.user.user.userId))
    try {
      let data = {
        title: `Valdenir`,
        tagValue: this.props.user.user.userId,
        icon: null,
        message: 'Teste de push notification'
      }

      let message = await api.sendPushNotification(data).then( res => {
        console.warn(res)
      }).catch( err => console.warn(err))
      //alert("OPA" + JSON.stringify(message))
    } catch (error) {
      alert(JSON.stringify(error))

    }
  }

  render() {
    const { grantedLocation, timeline, loading, hasMore, loadingMore, coupom, offset, adsOffset, coupomMatch, gpsState, openModal, connection } = this.state;
    const { preferences, checkin, user } = this.props;
    return(
      <SafeAreaView style={[styles.container]}>
      <GpsState loadTimeline={ () => this.getTimeline()} userToken={user.userToken} />
      {!connection.isConnected ?
        <SafeAreaView style={[styles.container]}>
          <EmptyState title={'Buscando rede...'} description={'Parece que o seu dispositivo não está conectado à internet.'} width={width - 90} height={300} illustration={require('../../assets/images/empty_box.png')} goTo={'Preferences'} />
        </SafeAreaView>
      : !loading && timeline && timeline.length > 0 ?
      <View style={styles.container}>
          <CustomHeader navigation={this.props.navigation} />
          <StatusBar
            barStyle="default" />

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ScrollView
                onScroll={({ nativeEvent }) => {
                  if (this.isCloseToRight(nativeEvent) && this.state.hasMore) {
                    this.getTimeline()
                  }
                }}
                onContentSizeChange={(contentWidth, contentHeight) => {
                  if((contentWidth === 0 && hasMore) && !loading){
                    this.searchUpdate()
                  }
                }}
                onScrollEndDrag={({ nativeEvent }) => {
                }}
                onMomentumScrollEnd={({ nativeEvent }) => {
                  const viewed = (nativeEvent.contentOffset.x + 10) / (nativeEvent.layoutMeasurement.width - 20)
                  this.setState({ cardsViewed: viewed < 1 ? 1 : ((viewed + 1) >= this.state.cards) ? Math.ceil(this.state.cards) : Math.ceil(viewed + 1) })
                }}
                horizontal={true}
                snapToInterval={width - 20}
                snapToAlignment={"center"}
                decelerationRate="fast"
                pagingEnabled
                showsHorizontalScrollIndicator={false}>
                {user && user.user && user.user.packages && !user.user.packages.end && user.user.visibility === 1 ?
                
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <EmptyState title={'Você está oculto'} description={'Para conhecer pessoas, você precisa reativar o seu perfil'} width={200} height={200} illustration={require('../../assets/images/invisible_mode.png')}/>
                </View>
                :
                
                timeline && timeline.length > 0 && timeline.map((user, index) =>
                  user.contentType == 'user' ?
                  <View>
                    <CustomCard key={user.userId} type={user.contentType} card={Number(index + 1)} cardViwed={this.state.cardsViewed} processing={this.state.processing} userInfo={user} cardActions={this.cardActions} />
                  </View>
                    :
                    user.ads.length > 0 ?
                    <View>
                      <Text>{JSON.stringify()}</Text>
                      {user && user.visible !== false &&
                      
                      <TimelineAds 
                      key={user.ads[0].couponId} 
                      type={user.contentType} 
                      card={Number(index + 1)} 
                      cardViwed={this.state.cardsViewed} 
                      coupomActions={this.coupomActions} 
                      removeAd={this.removeAd}
                      visible={user && user.visible}
                      coupom={user.ads.length > 0 ? user.ads[0] : {}}
                      offset={adsOffset} />
                      }
                     

                    </View>
                      :
                      null
                )}
                {(loadingMore) &&
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 25, paddingRight: 25 }}>
                    
                    <ActivityIndicator size="large" color={colorTheme.PRIMARY_COLOR} />
                  </View>
                }
                {!loadingMore && !this.state.hasMore &&
                  <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={() => this.searchUpdate()}>
                    <EmptyState title={'Mais ninguem por aqui'}  description={'Não há mais pessoas para exibir. Clique aqui para tentar encontrar mais alguém ou volte mais tarde.'} width={width - 90} height={300} illustration={require('../../assets/images/empty_box.png')} />
                  </TouchableOpacity>
                }
              </ScrollView>
            </View>
          <MatchPopup ref="match" partners={this.state.partners} userToken={user.userToken} goToChat={this.goToChat} onPress={() => this.handleChat()} matchActions={this.matchActions} coupon={coupomMatch} offset={this.state.matchOffset} />
        </View>
      : !loadingMore && timeline && timeline.length === 0 ? 
        <EmptyState title={'Nada aqui, por enquanto'} description={'Altere suas configurações para encontrar pessoas.'} width={width - 90} height={300} illustration={require('../../assets/images/empty_box.png')} goTo={'Preferences'} />
      :
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 25, paddingRight: 25 }}>
        {/*<Text>loading more: {JSON.stringify(loadingMore)}</Text>
        <Text>timeline: {JSON.stringify(timeline && timeline.length)}</Text>
        <Text>gps state: {JSON.stringify(gpsState)}</Text>
              <Text>{JSON.stringify(this.props.user)}</Text>*/}
              
        <ActivityIndicator size="large" color={colorTheme.PRIMARY_COLOR} />
      </View>
      }
      </SafeAreaView>
    )




    }
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#F5FCFF',
    //borderColor: '#000',
  },
  scrollContainer: {
    height: '100%',
    position: 'absolute',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'red',
    borderColor: '#000',
    borderWidth: 3
  },
});

/** Redux */
const mapStateToProps = state => {
  return {
    preferences: state.preferencesData.preferences,
    user: state.userData,
    checkin: state.checkinData.checkin,

  };
};

const mapDispatchToProps = dispatch => {
  return {
    activeChat: user => {
      dispatch(activeChat(user))
    }
  };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
