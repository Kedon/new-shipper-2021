// Home screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, ScrollView, SafeAreaView, StyleSheet, Dimensions, TouchableOpacity, Share, Image, ImageBackground, ActivityIndicator } from 'react-native';
import colorTheme from '../../config/theme.style'
import  CustomButton  from '../../components/CustomButton';
import  CustomModal  from '../../components/CustomModal';
import FastImage, { FastImageProps } from 'react-native-fast-image'
import { onSignIn, isSignedIn } from '../../config/auth'
import api from './services'
import { noAthorized } from '../../components/Utils'

import moment from "moment";


//import all the components we are going to use.
const { width } = Dimensions.get('window');
const height = width * 1;
const screenHeight = Dimensions.get('window').height;

export default class Invite extends Component {
  constructor(props) {
       super(props)
       noAthorized(props)
       this.state = {
         backScreen: props.route.params.backScreen,
         couponId: props.route.params.couponId,
         details: [],
         icon: 'https://media-cdn.tripadvisor.com/media/photo-s/0e/c5/b5/dc/restaurante-los-galenos.jpg',
         title: '15% off em Mr Lenha Pizzaria',
         expiration: '2020-02-20 20:00',
         activated_at: '',
         used_at: '',
         loading: true,
         code: '7BJ5702',
         description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
         partnerInfo: {
           id: 1,
           cover: 'https://media-cdn.tripadvisor.com/media/photo-s/0e/c5/b5/dc/restaurante-los-galenos.jpg',
           partner: 'Mr Lenha Restaurante e Pizzaria',
           address: 'Av Érico Veríssimo, 970 - Barra da Tijuca, Rio de Janeiro/ RJ',
           checkins: '48',
           distance: '0.5',
           activePromotions: '2'
         },
       }
    }
    showModal(title, description){
       this.refs.modal.open(title, description);
   }

   componentDidMount() {
     this.getCouponDetails()
   }


   getCouponDetails = async () => {
       //const { navigation } = this.props;
       isSignedIn().then((token) => {
         api.details(JSON.parse(token), this.state.couponId)
             .then(res => {
               this.setState({
                 loading: false,
                 details: res.data[0]
               })
               console.warn(this.state.details)
             })
             .catch(err => alert(err.response.data.message))
         }
       );
   }


   activate_coupon = async () => {
     isSignedIn().then((token) => {
       api.activate(JSON.parse(token), this.state.couponId)
           .then(res => {
             /*this.setState({
               loading: false,
               details: res.data[0]
             })*/
             if(res.data.status == 'ACTIVATED'){
               this.setState(prevState => ({
                 details: {
                   ...prevState.details,
                   coupon_state: {
                     ...prevState.details.coupon_state,
                     activated: {
                       ...prevState.details.coupon_state.activated,
                       activated: res.data.activated
                     },
                     status: {
                       ...prevState.details.coupon_state.status,
                       status: res.data.status
                     }
                   },
                 }
               })
              )
              this.showModal('Tudo certo!', 'Seu cupom foi ativado com sucesso e pode ser acessado através da área de cupons do seu perfil.')
              console.warn(res)
             }
           })
           .catch(err => console.warn(err))
       }
     );
     //this.setState({activated_at: moment(new Date()).format("YYYY-MM-DD HH:mm")});
     //
   }


  render() {
    const { details, loading } = this.state;
    if(!loading){
      return (
        <SafeAreaView>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.backButton}>
                <Image style={{ height: 18, width: 10}} source={require('../../assets/images/icons/backIcon.png')}/>
              </TouchableOpacity>
              <View style={styles.partnerInfo}>
                <View>
                  <FastImage style={styles.coverPhoto} source={{uri: details.logo }} />
                </View>
                <View>
                  <Text style={styles.userDesc}>{details.companyName}</Text>
                  <View style={styles.location}>
                    <Image source={require('../../assets/images/icons/pin.png')} style={styles.searchPic, { width: 10, height: 12, tintColor: colorTheme.TEXT_MUTED, marginRight: 3 }}/>
                    <Text style={styles.city} numberOfLines={1}>{details.distance.toFixed(2)+' km - '+details.address}</Text>
                  </View>
                </View>
              </View>
            </View>

            <ImageBackground source={{uri: details.banner}} style={{ width: width, height: 200 }}>
            </ImageBackground>
            <ScrollView contentContainerStyle={styles.codeArea}>
              <Text style={styles.description}>Apresente o seguinte código no estabelecimento:</Text>
              {details.coupon_state.activated ? 
                <Text style={styles.code}>{details.code}</Text>
                :
                <Text style={styles.code}>********</Text>
              }
              {
                (details.coupon_state.activated) ? (
                  <Text style={styles.expiration}>Ativado em {moment(details.coupon_state.activated).format("DD/MM/YYYY")}</Text>
                ) : (details.coupon_state.used) ? (
                  <Text style={styles.expiration}>Utilizado em {moment(details.coupon_state.used).format("DD/MM/YYYY")}</Text>
                ) : (
                  <View>
                    <View  style={{display: 'flex', flexDirection: 'row', width: width}}>
                      <TouchableOpacity style={[styles.button, {width: (width) - 23, marginRight: 3}]} onPress={() => this.activate_coupon()}>
                        <CustomButton  text={'Ativar promoção'}></CustomButton>
                      </TouchableOpacity>
                    </View>
                    <View>
                    <Text style={styles.expiration}>Expira em {moment(details.validity).format("DD/MM/YYYY HH:mm")}</Text>
                    </View>
                  </View>
                )

              }
              <Text style={styles.topDescriptionTitle}>
                {details.name}
              </Text>
              <Text style={styles.topDescriptionText}>
                {details.description}
              </Text>
            </ScrollView>
            

            <CustomModal ref="modal" />
          </View>
        </SafeAreaView>
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


const styles = StyleSheet.create({
  container: {
    display: 'flex',
    //alignItems: 'center',
    justifyContent: 'center',
    //marginRight: 20,
    //marginLeft: 20,
    //height: screenHeight - 80,
  },
  header: {
    display: 'flex',
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    //width: width - 130,
    borderBottomWidth: 1,
    borderBottomColor: '#e9e9e9',
    padding: 10,
    minHeight:60
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
  partnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: width - 60
  },
  profileInfo: {
    justifyContent: 'center',
    alignItems: 'center',

  },
  coverPhoto: {
    width: 42,
    height: 42,
    borderRadius: 100/ 2,
    marginRight: 10,
    borderColor: '#F1F1F1',
    borderWidth: 1
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
    width: width - 130
  },

  codeArea: {
    margin: 20,
    height: height + 150,
  },
  topDescription: {
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    padding: 20,
    display: 'flex',
    //alignItems: 'center',
    justifyContent: 'center',

  },
  topDescriptionTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 30,
    color: colorTheme.GREY_COLOR,
  },
  topDescriptionText: {
    fontSize: 17,
    paddingBottom: 15,
    textAlign: 'center',
    color: colorTheme.TEXT_MUTED,
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
  }
});
