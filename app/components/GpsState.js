// Setting screen
import React, { Component } from 'react';
//import react in our code.
import { Alert, Modal,Platform, Linking, Text, View, Image, Button, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import  Packages  from './Packages';
//import all the components we are going to use.
import colorTheme from '../config/theme.style';
import  QrCodeModal  from './QrCodeModal';
import { connect } from 'react-redux';
import { appState } from './../../redux/actions/appActions';
import { userData } from './../../redux/actions/userActions';
import { preferencesData } from './../../redux/actions/preferencesActions'

import { noAthorized } from './../components/Utils'

import  CustomModal  from './CustomModal';
import EmptyState2 from './EmptyState2';
import FastImage, { FastImageProps } from 'react-native-fast-image'
import { PERMISSIONS, check, request, Permissions, RESULTS } from 'react-native-permissions'
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import LocationEnabler from "react-native-location-enabler"
const {
  PRIORITIES: { HIGH_ACCURACY },
  addListener,
  checkSettings,
  requestResolutionSettings
} = LocationEnabler


import api from '../screens/home/services'


const { width } = Dimensions.get('window');
class GpsState extends React.Component {

  constructor(props) {
        super(props);
        this.verifyLocationPermission = this.verifyLocationPermission.bind(this);
        this.state = {
          initialLong: false,
          initialLat: false,
          lastLong: false,
          lastLat: false,
          gpsMessage: false,
          hasLocation: false,
          grantedLocation: '',
          firstLoad: false,
          app: null,
          userHasLocation: false,
          gpsPermission: null,
          latitude: null
        }
    }
   async verifyLocationPermission(checkSettings){
      try {
          const granted =
           await check( Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_ALWAYS : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION ).then((result) => {
             let access_state
             switch (result) {
              case RESULTS.UNAVAILABLE:
                console.log('RESULTS.UNAVAILABLE')
                access_state =  'unavaliable';
                break;
              case RESULTS.DENIED:
                console.log('RESULTS.DENIED')
                access_state = 'permission_denied'
                break;
              case RESULTS.GRANTED:
                console.log('RESULTS.GRANTED')
                access_state = 'permission_granted'
                break;
              case RESULTS.BLOCKED:
                console.log('RESULTS.BLOCKED')
                access_state = 'permission_blocked'
                break;
            }
            console.log(access_state)
            return access_state
           }).catch((error) => { return error })
       console.log(`granted: ${granted}`)
       if( granted == 'permission_granted') {
        this.setState({gpsPermission: 'granted'}, () => {
          setTimeout( () => { this.theUserPosition() }, 500);
         })
      } else if ( granted ==  'unavaliable' ) {
         this.setState({gpsPermission: 'unavaliable'})
       } else if(granted == 'permission_granted' && !checkSettings){ 
        const config = {
          priority: HIGH_ACCURACY, // default BALANCED_POWER_ACCURACY
          alwaysShow: false, // default false
          needBle: false, // default false
        };
        requestResolutionSettings(config)
       } else if(granted ==  'permission_denied') {
         this.setState({gpsPermission: 'danied'})
         //this.verifyLocationPermission()
       } else  if ( granted ==  'permission_blocked' ) {
         this.setState({gpsPermission: 'blocked'}, () => {
           Alert.alert(
             'Compartilhe sua localização',
             'Precisamos da sua localização para mostrar perfis de seu interesse perto de você,',
             [
               {text: 'Compartilhar', onPress: () => Platform.OS === 'ios' ? Linking.openURL('app-settings://') : Linking.openSettings()},
               {text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
             ],
             { cancelable: false }
           )

         })
         console.log(`granted: ${granted}`)
       } else {
         //alert('error')
       }
         this.setState({grantedLocation: granted})
      } catch(err){
        console.log(`ERROR: ${err}`)
      }
    }

    theUserPosition = async () => {
      await Geolocation.getCurrentPosition(
        async position => {
          const {initialLong, initialLat, lastLong, lastLat, gpsState} = this.state
         
          if(!initialLong && !initialLat){
            await this.setState({ initialLong: position.coords.longitude, initialLat: position.coords.latitude }, () => {
              this.setState({ lastLong: position.coords.longitude, lastLat: position.coords.latitude });
              this.getUserLocation(position.coords.latitude, position.coords.longitude);
            });
          }
        },
        error => {
          console.log(`theUserPosition: `, error.code, error.message);
          setTimeout(() => {
            this.theUserPosition()
          }, 1000)
        }
      );
    }

    getUserLocation = async (lat, lon) => {
      //if(!this.state.lastLong && !this.state.lastLat){

        await Geocoder.init("AIzaSyChvbAoy_fAMeQct_NRRO9RPMDakABn3CE"); // use a valid API key
        await Geocoder.from(lat, lon)
          .then( async json => {
            // alert(`lat ${lat} - long ${lon}`)
            // return

            
            var addressComponent = json.results[0].address_components;

            let param ={
              latitude: lat, longitude: lon, reverse: addressComponent
              //latitude: -22.7966055, longitude: -43.3529473, reverse: addressComponent
            }
            //alert(JSON.stringify(param)) //ALERT DESATIVADO
            if(addressComponent && addressComponent.length > 0){ //SE FICAR LENTO, REMOVER ISSO
              if(this.props.userToken){
              
                await api.location(this.props.userToken, { ...param })
                  .then(res => {
                    //if(this.state.userHasLocation){
                      //this.props.loadTimeline()
                      this.getUserInfo()
                    //}
                    
                  })
                  .catch(err => {
                    alert(JSON.stringify(err)) //ALERT DESATIVADO
                  })
              }
  
            }//SE FICAR LENTO, REMOVER ISSO

          })
          .catch(error =>
            console.log(error)
          );
      //}
    }


    requestSettings = async () => {
      try {
        await Linking.openSettings('app-settings:');
      } catch (err) {
        //alert(err) //ALERT DESATIVADO
      }
    }

    async getUserInfo(){
      if(this.props.userToken){

        const { userData } = this.props;
        await api.getUserInfo(this.props.userToken)
        .then(res => {
          this.setState({userHasLocation: true}, () => {
            userData(res.data[0].data)
            this.getUserPreferences()
  
          })
        })
        .catch(function (error) {
          console.log('There has been a problem with your fetch operation: ' + error.message);
          // ADD THIS THROW error
          throw error;
        });
      }
    }

    async getUserPreferences(){
        if(this.props.userToken){

        const { preferencesData } = this.props;
        await api.userPreferences(this.props.userToken)
        .then(res => {
          
          const { minAge, maxAge, looking, distance } = res.data[0]
          const params = {
            ageRange: minAge+","+maxAge,
            looking: looking,
            distance: distance
          }
          //alert(JSON.stringify(params))
          //alert(JSON.stringify(params))
          preferencesData(params)
          this.props.loadTimeline();

        })
        .catch(function (error) {
          console.log('There has been a problem with your fetch operation: ' + error.message);
          // ADD THIS THROW error
          throw error;
        });
      }
    }


  componentDidMount() {
      /*if(!this.state.firstLoad){
        this.setState({ app: 'active', firstLoad: true })
      }*/

      //OBTEM OS DADOS DO USUÁRIO 
      //this.getUserInfo()
      const config = {
        priority: HIGH_ACCURACY, // default BALANCED_POWER_ACCURACY
        alwaysShow: false, // default false
        needBle: false, // default false
      };

      addListener(({ locationEnabled }) => {
        console.log(`Location are ${ locationEnabled ? 'enabled' : 'disabled' }`);
        this.setState({ checkSettings: locationEnabled })
        if(!locationEnabled){
          requestResolutionSettings(config)
        }
      })
       
          
        // Check if location is enabled or not
        checkSettings(config);


    }

    requestResolution = () => {
      /*const config = {
          priority: HIGH_ACCURACY, // default BALANCED_POWER_ACCURACY
          alwaysShow: true, // default false
          needBle: false, // default false
        };*/

        const config = {
          priority: HIGH_ACCURACY, // default BALANCED_POWER_ACCURACY
          alwaysShow: false, // default false
          needBle: false, // default false
        };
        
        // Check if location is enabled or not
        checkSettings(config);
        /*this.setState({
          checkSettings: checkSettings(config)
      })*/
      //requestResolutionSettings(config)
      
  }

  
    componentDidUpdate(prevProps, prevState) {
      const oldProps = JSON.stringify(prevProps.app);
      const newProps = JSON.stringify(this.props.app);
      if((oldProps !== newProps) && this.props.app == 'active') {
        this.verifyLocationPermission(this.state.checkSettings)
      }

      const oldFirstLoad = JSON.stringify(prevState.firstLoad)
      const newFirstLoad = JSON.stringify(this.state.firstLoad)
      if(this.state.gpsPermission === 'granted' && this.state.checkSettings && !this.state.firstLoad ){
        this.setState({ firstLoad: true }, () => this.props.loadTimeline())
      }

      const oldcheckSettings = prevState.checkSettings
      const checkSettings = this.state.checkSettings
      if(oldcheckSettings !== this.state.checkSettings && this.state.checkSettings == true){
        this.verifyLocationPermission(this.state.checkSettings)
      }
      
      /*const oldPermission = JSON.stringify(prevState.gpsPermission)
      const newPermission = JSON.stringify(this.state.gpsPermission)
      if((oldPermission !== newPermission) && this.state.gpsPermission === 'granted' ){
        this.theUserPosition()
      }*/
    }







  render() {
    const { app } = this.props;
    const { gpsMessage, grantedLocation, gpsPermission, checkSettings, lastLong } = this.state
    return (
      !checkSettings || gpsPermission !== 'granted' || !lastLong ?
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {this.state.gpsPermission === 'danied' ?
                  <EmptyState2 title={'Permissão de localização'} label={'Habilitar'}
                  description={'Para utilizar este aplicativo, você precisa conceder permissão de acesso a sua localização'}
                  width={width - 90}
                  height={300}
                  illustration={require('./../assets/images/empty_box.png')}
                  onPress={grantedLocation === 'permission_denied' ? this.theUserPosition : this.requestSettings}
                /> : (!this.state.checkSettings) ? 
                <EmptyState2 title={'Ative a localização'} label={'Habilitar'}
                  description={'Ative a localização do seu dispositivo para ter acesso ao aplicativo.'}
                  width={width - 90}
                  height={300}
                  illustration={require('./../assets/images/empty_box.png')}
                  onPress={grantedLocation === 'permission_denied' ? this.theUserPosition : this.requestSettings}
                  /> 
                : null
              
              }
                


              </View>
            </View>
          </Modal>
        </View>
      : null
    );
  }
}


const styles = {
  centeredView: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 22,
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

  };

  /** Redux */
  const mapStateToProps = state => {
    return {
      app: state.appState.app,
    };
  };

  const mapDispatchToProps = dispatch => {
    return {
      userData: user => {
        dispatch(userData(user))
      },
      preferencesData: preferences => {
        dispatch(preferencesData(preferences))
      }  
    };
  };


  export default (connect(
    mapStateToProps,
    mapDispatchToProps
  )(GpsState))
