import AsyncStorage from '@react-native-community/async-storage';
import { loggedUser, user } from './constants'
//export const USER_KEY = "@";
import React, { Component } from 'react';



export const onSignIn = async(data) => {
  await AsyncStorage.setItem(loggedUser, JSON.stringify(data))
};
export const onSignOut = () => AsyncStorage.removeItem(loggedUser);


export const userDataSave = (data) => AsyncStorage.setItem(user, JSON.stringify(data));

export const redirect =(props) => {
  const { navigation } = props;
    navigation.navigate('EmailPage', { data: {} })
    AsyncStorage.removeItem(loggedUser);
}

export const isSignedIn = () => {

  return new Promise(async (resolve, reject) => {

    try {
      const value = await AsyncStorage.getItem(loggedUser)
      if(value !== null) {
       resolve(value)
      }
      reject('')
    } catch(e) {
      reject(e)
    }
  });
};
