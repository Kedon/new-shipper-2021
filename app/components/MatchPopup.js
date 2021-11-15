// Home screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, ScrollView, Modal, StyleSheet, StatusBar, Image, Dimensions, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import  CustomButton  from './CustomButton';
import colorTheme from '../config/theme.style'
import { Avatar } from 'react-native-elements';
import FastImage, { FastImageProps } from 'react-native-fast-image'
import api from '../screens/home/services'
import { onSignIn, isSignedIn } from '../config/auth'

//import all the components we are going to use.
const { width } = Dimensions.get('window');
const height = width * 1;
const screenHeight = Dimensions.get('window').height;
class MatchPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      matchInfo: {},
      loading: true,
      coupon: [],
      withAds: false
    }
  }

  componentDidUpdate() {

  }



  open(user, data) {
    this.setState({ coupon: this.props.coupon[0], modalVisible: true }, () => {
      this.setState({ 
        matchInfo: data, 
        modalVisible: true, 
        user: user,
        loading: false , 
        withAds: (this.props.coupon.length > 0) ? true : false}, () =>  {
        this.state.coupon && this.state.coupon.couponId && this.updateAdsView(this.state.coupon.couponId)
      })

    })

  };

  updateAdsView = async (couponId) => {
    console.warn('CoupomId: ' + couponId)
    if(this.props.userToken){
       api.couponsCount(this.props.userToken, {couponId: couponId, page: "match", metrics: "views"})
           .then(res => {
             this.updating = false;
           })
           .catch(err => console.warn(err))
       }
  }

  close() {
    this.setState({ modalVisible: false })
  };

  goToChat = (user, matchInfo) => {
    /*const cover = [{
      photoURL: user.matchInfo.receiverInfo.cover,
      firstName: user.matchInfo.receiverInfo.firstName,
      city: matchInfo && matchInfo.location && matchInfo.location[0].city,
      state: matchInfo && matchInfo.location && matchInfo.location[0].state,
      visibility: matchInfo && matchInfo.visibility
    }]*/
    const chatName = user.chatName
    const cover = [{
      receiverUserId: user.receiverUserId,
      userId: user.senderUserId,
      photoURL: user.matchInfo.receiverInfo.cover,
      firstName: user.matchInfo.receiverInfo.firstName,
      city: matchInfo && matchInfo.location && matchInfo.location[0].city,
      state: matchInfo && matchInfo.location && matchInfo.location[0].state,
      visibility: matchInfo && matchInfo.visibility
    }]

    const displayUser = {
      "photos": matchInfo.photos,
      "birthDate": matchInfo.birthDate,
      "location": matchInfo.location,
      "unread": 0,
      "hobbies": null,
      "firstName": user.matchInfo.receiverInfo.firstName,
      "userId": user.receiverUserId,
      "blocked": false,
      "typing": false,
      "isMatche": null
    }
    console.log(JSON.stringify("chatName: " + chatName))
    console.log(JSON.stringify("cover: " + JSON.stringify(cover)))
    console.log(JSON.stringify("displayUser: " + JSON.stringify(displayUser)))

    this.props.goToChat(displayUser, chatName, cover);
    //this.props.activeChat(user)
  }

  render() {
    const {loading, coupon, user, matchInfo} = this.state
    const {onPress = () => {}, partners, userInfo} = this.props
    if (!loading){
      return (
        (this.state.modalVisible) &&
        <View>
          <Modal
            style={{marginTop: 22}}
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            >
            <View style={styles.modalContainer}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={styles.modalComponent}>
                <ImageBackground source={{uri: (this.state.coupon && this.state.coupon.length > 0) ? this.state.coupon.banner : null}} style={styles.modalItem}>
                  <View style={styles.backdrop}>
                    <Text style={[styles.modalTopTitle, {marginBottom: 20}]}>Deu Match!</Text>
                    <View style={styles.covers}>
                      <FastImage style={[styles.coverPhoto, styles.coverPhotoLeft]} source={{uri: this.state.user && this.state.user.matchInfo && this.state.user.matchInfo.senderInfo && this.state.user.matchInfo.senderInfo.cover }} />
                      {(this.state.withAds) &&
                      <View style={styles.topLogo}>
                        <View style={styles.logoContainer}>
                          <FastImage style={{ height: 50, width: 50}} source={require('../assets/images/shipper-logo.png')} tintColor={colorTheme.PRIMARY_COLOR} resizeMode={FastImage.resizeMode.contain}/>
                        </View>
                      </View>
                      }
                      <FastImage style={[styles.coverPhoto, styles.coverPhotoRight]} source={{uri: this.state.user && this.state.user.matchInfo && this.state.user.matchInfo.receiverInfo && this.state.user.matchInfo.receiverInfo.cover }} />
                    </View>
                    {(this.state.withAds) ?
                      <View>
                        <Text style={styles.modalTitle}>{this.state.coupon.companyName}.</Text>
                        <Text style={styles.modalParagraph}>Shippa vocês com:</Text>
                        <Text style={styles.modalTitle}>{this.state.coupon.name}.</Text>
                        <Text style={[styles.modalSmall, {marginTop: 10}]}>Acesse em sua área de cupons.</Text>
                      </View>
                      :
                      <Text style={styles.modalParagraph}>{this.state.user.matchInfo.receiverInfo.firstName.split(' ')[0].replace(' ', '')} também gostou de você.</Text>
                    }
                    <TouchableOpacity style={styles.cta} onPress={() => { this.goToChat(user, matchInfo) }}>
                      <CustomButton  text={'Chame '+this.state.user.matchInfo.receiverInfo.firstName.split(' ')[0].replace(' ', '')+' para um chat'}></CustomButton>
                    </TouchableOpacity>
                  </View>
                </ImageBackground>
                <TouchableOpacity onPress={() => {
                    this.close();
                  }}>
                  <Text style={styles.closeButton}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      );
    } else {
      return (<View>
        <Modal
          style={{marginTop: 22}}
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          >
          <View style={styles.modalContainer}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator />
            </View>
          </View>
        </Modal>
      </View>);
    }
  }
}


const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: Platform.OS === 'ios' ? '#00000066' : 'rgba(0,0,0,0.45)',
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
    overflow: 'hidden'
  },
  backdrop: {
    //backgroundColor: 'rgba(0, 0, 0, 0.45)',
    padding: 15,
    display: 'flex',
    //alignItems: 'center',
    justifyContent: 'center',

  },
  modalTopTitle: {
    fontSize: 32,
    color: colorTheme.PRIMARY_COLOR,
    textAlign: 'center',
    fontWeight: '700',
  },
  modalTitle: {
    fontSize: 25,
    color: colorTheme.DARK_COLOR,
    textAlign: 'center',
    fontWeight: '600',
  },
  modalParagraph: {
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
    color: colorTheme.DARK_COLOR
  },
  modalSmall: {
    fontSize: 12,
    lineHeight: 15,
    textAlign: 'center',
    color: colorTheme.TEXT_MUTED
  },
  modalSpaceBottom: {
    marginBottom: 10,
  },
  modalSpaceTop: {
    marginTop: 10,
  },
  title: {
    fontWeight: '400',
    fontSize: 17,
    marginBottom: 5,

  },
  avatarContainer: {
    backgroundColor: 'rgb(252,252,252)',
  },
  avatarStyle: {
    backgroundColor: 'rgb(252,252,252)',
  },
  subtitle: {
    fontWeight: '400',
    fontSize: 13,
    color: colorTheme.TEXT_MUTED
  },
  closeButton: {
    color: '#FFF',
    marginTop: 20,
    textAlign: 'center'
  },
  cta: {
    marginTop: 15
  },
  covers: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 15
  },
  coverPhoto: {
    width: 100,
    height: 100,
    borderRadius: 100/ 2,
    backgroundColor: '#F1F1F1',
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 70,
    backgroundColor: '#FFF',
    shadowOpacity: 0.75,
    shadowRadius: 5,
    shadowColor: '#ccc',
    shadowOffset: { height: 0, width: 0 },
    elevation: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

  },
  bgDark: {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  bgLight: {
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    padding: 20,
    borderRadius: 50
  },
  topLogo: {
    width: 100,
    height: 100,
    borderRadius: 100/ 2,
    marginRight: -10,
    marginLeft: -10,
    position: 'absolute',
    zIndex: 2
  },
  coverPhotoLeft: {
    marginRight: 25
  },
  coverPhotoRight: {
    marginLeft: 25
  }

});

//export default withNavigation(MatchPopup);
export default MatchPopup;
