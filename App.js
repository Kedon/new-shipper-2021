/*import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});*/

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
 import { StatusBar } from 'expo-status-bar';
 import React, { Component } from 'react';
 import {AppState, LogBox, View, Text, StyleSheet, Button, Alert } from 'react-native';
 import { connect } from 'react-redux';
 import { appState } from './redux/actions/appActions';
 import { userData, userToken } from './redux/actions/userActions';
 import { preferencesData } from './redux/actions/preferencesActions'
 import { chatContacts } from './redux/actions/chatsActions';
 import { onSignIn, isSignedIn } from './app/config/auth';
 import firestore from '@react-native-firebase/firestore';
import OneSignal from 'react-native-onesignal';


 import api from './app/screens/home/services'
 import Navegator from './app/Navegator'

 LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
 LogBox.ignoreAllLogs();//Ignore all log notifications


 OneSignal.setLogLevel(6, 0);
 OneSignal.setAppId("81930a18-33f2-4367-9e57-cfb6280a7ffd");
 OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
   console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
   let notification = notificationReceivedEvent.getNotification();
   console.log("notification: ", notification);
   const data = notification.additionalData
   console.log("additionalData: ", data);
   // Complete with null means don't show a notification.
   notificationReceivedEvent.complete(notification);
 });
 
 //Method for handling notifications opened
 OneSignal.setNotificationOpenedHandler(notification => {
   console.log("OneSignal: notification opened:", notification);
 });


 //one signal 81930a18-33f2-4367-9e57-cfb6280a7ffd
 
 class App extends React.Component {
  constructor(props) {
    super()
    //here add your credentials 
    //Remove this method to stop OneSignal Debugging 
  }
  state = {
    appState: AppState.currentState,
  }

  componentDidMount = () => {
    AppState.addEventListener('change', this._handleAppStateChange);

    
    this.getUserInfo()
  }

  componentDidUpdate = (prevProps) => {
    if(prevProps.token !==this.props.token  && this.props.token){
      const userId = this.props.user && this.props.user.userId
      //let externalUserId = '123456789'; // You will supply the external user id to the OneSignal SDK
      OneSignal.setExternalUserId(userId);
      OneSignal.sendTag("USER", userId);
    }
    if(prevProps.user !==this.props.user  && this.props.user){
      const userId = this.props.user && this.props.user.userId
      const { chatContacts } = this.props;
      //OBTEM A LISTA DE CHATS DO USUÁRIO
      firestore()
      .collection("Contacts")
      .where("users", "array-contains", this.props.user.userId)
      .onSnapshot((querySnapshot) => {
        const contacts = querySnapshot.docs.map((m) => {
          return m._data
        });
        this.props.chatContacts(contacts)
      })


    }
  }

  async getUserInfo(){
    const { userData, preferencesData, userToken } = this.props;
    const token = isSignedIn()
    //alert(JSON.stringify(token))

    if(token){

      userToken(JSON.parse(token))
        //OBTEM OS DADOS DO USUÁRIO 
        api.getUserInfo(JSON.parse(token))
  
        .then(res => {
          userData(res.data[0].data)
        })
        .catch(function (error) {
          console.warn('There has been a problem with your fetch operation: ' + error.message);
          // ADD THIS THROW error
          throw error;
        });
        //OBTEM AS PREFERENCIAS DO USUARIO 
        api.userPreferences(JSON.parse(token))
        .then(res => {
          const { minAge, maxAge, looking, distance } = res.data[0]
          const params = {
            ageRange: minAge+","+maxAge,
            looking: looking,
            distance: distance
          }
          preferencesData(params)
        })
        .catch(function (error) {
          console.warn('There has been a problem with your fetch operation: ' + error.message);
          // ADD THIS THROW error
          throw error;
        });

    }
    /*isSignedIn().then(async (token) => {
      //userToken(token)
      alert(token)

      
    }).catch(error => noAthorized(error));*/
    
    
  }

  _handleAppStateChange = (nextAppState) => {
    const { appState } = this.props;
    appState(nextAppState)
    this.setState({ appState: nextAppState });

    if (nextAppState === 'background') {

      // Do something here on app background.
      //console.warn("App is in Background Mode.")
    }

    if (nextAppState === 'active') {

      // Do something here on app active foreground mode.
      //console.warn("App is in Active Foreground Mode.")
    }

    if (nextAppState === 'inactive') {

      // Do something here on app inactive mode.
      //console.warn("App is in inactive Mode.")
    }
  };


   render() {
    return <Navegator />
   }
 }


 
 

 const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


 /** Redux */
 const mapStateToProps = state => {
   return {
     chatContacts: state.chats.chatContacts,
     user: state.userData.user,
     token: state.userData.userToken
   };
 };
 
 const mapDispatchToProps = dispatch => {
   return {
     appState: app => {
       dispatch(appState(app))
     },
     userData: user => {
       dispatch(userData(user))
     },
     preferencesData: user => {
       dispatch(preferencesData(user))
     },
     chatContacts: contacts => {
       dispatch(chatContacts(contacts))
     },
     userToken: token => {
       dispatch(userToken(token))
     }
   };
 };
 
 
 
 
 export default (connect(
   mapStateToProps,
   mapDispatchToProps
 )(App))
