// Setting screen
import React, { Component } from 'react';
//import react in our code.
import { AppState, Modal, Text, View, Image, Button, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import  Packages  from './Packages';
//import all the components we are going to use.
import colorTheme from '../config/theme.style';
import  QrCodeModal  from './QrCodeModal';
import { connect } from 'react-redux';
import  CustomModal  from './CustomModal';
import EmptyState2 from './EmptyState2';
import FastImage, { FastImageProps } from 'react-native-fast-image'

import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';


const { width } = Dimensions.get('window');
class CustomHeader extends React.Component {

  constructor(props) {
        super(props);
        this.state = {
          appState: AppState.currentState,
          scroll: true,
          appHasLoaded: true,
          appReady: false,
          rootKey: Math.random(),
          photos: [],
          showPackageModal: false,
          showQrCode: false,
          gpsState: null,
          hasLocation: false,
          grantedLocation: '',
          userInfo: {
            coverPhoto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS34bSHEn2hxEkG-AtbYUfFlb5kFE3cWWGHcRMVCx8_c23Icx_R',
            userName: 'Tom Cruiser',
            userBirthday: '1983-03-29',
            userAge: '36',
            userCity: 'Rio de Janeiro',
            userState: 'RJ'
          },
          userPackage: {
            id: 1,
            package: 'shipper'
          }
        }
    }

  checkin = () => {
    const { navigation } = this.props;
    navigation.navigate('Checkin', { data: {} })
  }

  coupons = () => {
    const { navigation } = this.props;
    navigation.navigate('Coupons', { data: {} })
  }
  showQrCode = () => {
    this.setState({showQrCode: true})
  }

  hideQrCode = () => {
    this.setState({showQrCode: false})
  }


   showModal(title, description){
     this.refs.modal.open(title, description);
   }

   showPackageModal = () => {
    //  alert('ok')
    this.setState({showPackageModal: true})
   }

   hideModal = () => {
    this.setState({showPackageModal: false})
   }

   /*async verifyLocationPermission(){
      try {
          const granted =
           await check( Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_ALWAYS : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION ).then((result) => {
             switch (result) {
              case RESULTS.UNAVAILABLE:
                 return 'unavaliable';
                break;
              case RESULTS.DENIED:
                return 'permission_denied'
                break;
              case RESULTS.GRANTED:
                return 'permission_granted'
                break;
              case RESULTS.BLOCKED:
                return 'permission_blocked'
                break;
            }
           }).catch((error) => { return error })

       if ( granted ==  'unavaliable' ) {
         this.setState({gpsState: false})

         } else if(granted ==  'permission_denied') {
           this.setState({gpsState: false }, () => this.theUserPosition())
           this.getUserInfo()
       } else if( granted == 'permission_granted') {
           this.setState({gpsState: true }, () => this.theUserPosition())
           this.getUserInfo()
       } else if ( granted ==  'permission_blocked' ) {
         Alert.alert(
           'Compartilhe sua localização',
           'Precisamos da sua localização para mostrar perfis de seu interesse perto de você,',
           [
             {text: 'Compartilhar', onPress: () => Platform.OS === 'ios' ? Linking.openURL('app-settings://') : Linking.openSettings()},
             {text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
           ],
           { cancelable: false }
         )
       } else {
         alert('error')
       }
         this.setState({grantedLocation: granted})
         console.warn(granted)
      } catch(err){
        console.warn(err)
      }
    }*/

    componentDidMount() {
      AppState.addEventListener('change', this._handleAppStateChange);
      //this.verifyLocationPermission();
    }

    componentWillUnmount() {
      AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {

      this.setState({ appState: nextAppState });

      if (nextAppState === 'background') {

        // Do something here on app background.
        console.warn("App is in Background Mode.")
      }

      if (nextAppState === 'active') {

        // Do something here on app active foreground mode.
        console.warn("App is in Active Foreground Mode.")
      }

      if (nextAppState === 'inactive') {

        // Do something here on app inactive mode.
        console.warn("App is in inactive Mode.")
      }
    };







  render() {
    const { user } = this.props;
    const { showPackageModal, hideModal, showQrCode, gpsState, grantedLocation } = this.state
    return (
      <View>
        <StatusBar barStyle="default" />
        <View style={styles.container}>
          {/*<TouchableOpacity onPress={() => {
              this.child.open();
            }}>
            <View style={styles.userPackageLabel}>
              <Image style={styles.coverPhoto} source={{uri: this.state.userInfo.coverPhoto}} />
              {(this.state.userPackage.package == 'shipper') ? (
                <Text style={[styles.userPackage, styles.userPackageShipper]}>Shipper</Text>
              ) : (this.state.userPackage.package == 'vip') ? (
                <Text style={[styles.userPackage, styles.userPackageVip]}>Vip</Text>
              ) :
                <Text style={[styles.userPackage, styles.userPackageStart]}>Start</Text>
             }
            </View>
          </TouchableOpacity>*/}

          <TouchableOpacity onPress={this.coupons}>
            <Image source={require('../assets/images/icons/coupons.png')} style={{ width: 30, height: 30, tintColor: colorTheme.TEXT_MUTED }}/>
          </TouchableOpacity>

          <View style={styles.textCenter}>
              <Text style={styles.label}>PERFIL</Text>
              {(user && user.packages && user.packages.level > 1) ? //CASO SEJA UM USUÁRIO PAGANTE
                  (user.medRating.preRating.medScore > 0) ? //EXIBE NOTA DE PRÉ-MATCH SE > 0
                      <TouchableOpacity style={styles.indicator}
                        onPress={() => this.showModal('Média de pré-match',`A média de nota das pessoas que visitaram o seu perfil foi ${user.medRating.preRating.medScore.toFixed(1)}.`)}>
                        <Text style={styles.text}>{user.medRating.preRating.medScore.toFixed(1)}</Text>
                        <Image style={{ width: 10, height: 10, tintColor: '#E0B645' }} source={require('../assets/images/icons/star.png')} />
                      </TouchableOpacity>
                      : //EXIBE - SE NOTA DE PRÉ-MATCH FOR NULL
                      <TouchableOpacity style={styles.indicator}
                        onPress={() => this.showModal('Média de pré-match','Seu perfil ainda não recebeu uma nota das pessoas que o visitaram.')}>
                        <Text style={styles.text}> - </Text>
                        <Image style={{ width: 10, height: 10, tintColor: '#E0B645' }} source={require('../assets/images/icons/star.png')} />
                      </TouchableOpacity>
                : //EXIBE ? SE NÃO FOR UM USUÁRIO PAGANTE
                <TouchableOpacity style={styles.indicator}
                onPress={this.showPackageModal}>
                  <Text style={styles.text}>?</Text>
                  <Image style={{ width: 10, height: 10, tintColor: '#E0B645' }} source={require('../assets/images/icons/star.png')} />
                </TouchableOpacity>
              }
          </View>
            <FastImage style={{ height: 50, width: 50}} source={require('../assets/images/shipper-logo.png')} tintColor={colorTheme.PRIMARY_COLOR} resizeMode={FastImage.resizeMode.contain}/>
            <View style={styles.textCenter}>
                <Text style={styles.label}>MATCH</Text>
                    {(user && user.packages && user.packages.level > 1) ? //CASO SEJA UM USUÁRIO PAGANTE
                        (user.medRating.posRating.medScore > 0) ? //EXIBE NOTA DE PRÉ-MATCH SE > 0
                            <TouchableOpacity style={styles.indicator}
                              onPress={() => this.showModal('Média de pós-match',`A média de nota das pessoas que interagiram com você foi ${user.medRating.posRating.medScore.toFixed(1)}.`)}>
                              <Text style={styles.text}>{user.medRating.posRating.medScore.toFixed(1)}</Text>
                              <Image style={{ width: 10, height: 10, tintColor: '#E0B645' }} source={require('../assets/images/icons/star.png')} />
                            </TouchableOpacity>
                            : //EXIBE - SE NOTA DE PRÉ-MATCH FOR NULL
                            <TouchableOpacity style={styles.indicator}
                              onPress={() => this.showModal('Média de pós-match','Seu perfil ainda não recebeu uma nota das pessoas que interagiram com você.')}>
                              <Text style={styles.text}> - </Text>
                              <Image style={{ width: 10, height: 10, tintColor: '#E0B645' }} source={require('../assets/images/icons/star.png')} />
                            </TouchableOpacity>
                      : //EXIBE ? SE NÃO FOR UM USUÁRIO PAGANTE
                      <TouchableOpacity style={styles.indicator}
                      onPress={this.showPackageModal}>
                        <Text style={styles.text}>?</Text>
                        <Image style={{ width: 10, height: 10, tintColor: '#E0B645' }} source={require('../assets/images/icons/star.png')} />
                      </TouchableOpacity>
                    }

            </View>
            <TouchableOpacity onPress={() => this.showQrCode()}>
              <Image source={require('../assets/images/icons/qr_code.png')} style={{ width: 25, height: 25, tintColor: colorTheme.TEXT_MUTED }}/>
            </TouchableOpacity>
            {/*<Packages ref={(ref) => { this.child = ref; }} />*/}


        </View>
        <Packages modalVisible ={showPackageModal} onPressClose={(v)=> this.hideModal(v)} />
        <CustomModal ref="modal" />
        <QrCodeModal modalQrCodeVisible={showQrCode} onPressClose={(v)=> this.hideQrCode(v)} />
        <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={gpsState == false ? true : false}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <EmptyState2 title={'Ative o GPS'} label={'Ativar localização'}
            description={'Para utilizar o app, você precisa habilitar sua localização.  Se você clicou para não mostrar a caixa, você deverá abrir settings e ativar manualmente.'}
            width={width - 90}
            height={300}
            illustration={require('./../assets/images/empty_box.png')}
            onPress={grantedLocation === 'permission_denied' ? this.verifyLocationPermission : this.requestSettings}
            />


          </View>
        </View>
      </Modal>

    </View>
      </View>
    );
  }
}


const styles = {
  centeredView: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 0,
  backgroundColor: "#FFF"
},
modalView: {
  margin: 20,
  backgroundColor: "white",
  borderRadius: 20,
  padding: 35,
  alignItems: "center",
  shadowColor: "#000",
},

    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      height: 65,
    },
    cards: {
      height: 200,
      flexDirection: 'row'
    },
    transactions: {
      width: '100%',
    },
    transaction: {
      margin: 5,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 3,
      height: 30,
      width: 310
    },
    label: {
        color: colorTheme.TEXT_MUTED,
        fontSize: 10,
        textAlign: 'center',
    },
    text: {
        color: colorTheme.DARK_COLOR,
        fontSize: 15,
        marginRight: 4,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    indicator: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        height: 25,
    },
    indicators: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    userPackageLabel: {
      position: 'relative'
    },
    coverPhoto: {
      width: 42,
      height: 42,
      borderRadius: 100/ 2,
      marginRight: 10
    },
    userPackage: {
      position: 'absolute',
      bottom: -5,
      right: 0,
      paddingTop: 2,
      paddingRight: 5,
      paddingBottom: 2,
      paddingLeft: 5,
      color: '#FFF',
      borderRadius: 9,
      fontSize: 10,
      fontWeight: 700
    },
    userPackageStart: {
      backgroundColor: colorTheme.TEXT_MUTED
    },
    userPackageShipper: {
      backgroundColor: colorTheme.PRIMARY_COLOR
    },
    userPackageVip: {
      backgroundColor: '#DAA520'
    }


  };

  /** Redux */
  const mapStateToProps = state => {
    return {
      user: state.userData.user
    };
  };

  export default (connect(
    mapStateToProps,
  )(CustomHeader))
