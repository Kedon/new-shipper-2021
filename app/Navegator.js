 import React, { Component } from 'react';
 import {AppState, LogBox, View, Text, StyleSheet, Button } from 'react-native';
 import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
//import RegisterRouter from './screens/register/RegisterRouter';
//import LoggedRouter from './screens/logged/LoggedRouter';
import AuthLoadingScreen from './screens/AuthLoadingScreen';
import PageOne from './screens/register/PageOne';
import PageTwo from './screens/register/PageTwo';
import LoggedTwo from './screens/logged/LoggedTwo';
import LoggedOne from './screens/logged/LoggedOne';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BottomTabNavigator from './BottomTabNavigator';
import { RegisterStack } from './screens/register/RegisterStack';

import { connect } from 'react-redux';

const navTheme = DefaultTheme;
navTheme.colors.background = '#FFFFFF'; //cor de fundo padrão da aplicação


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}


 class Navegator extends React.Component {
 
   render() {
     const { user, loadingAuth } = this.props.user
    return (
      <NavigationContainer theme={navTheme}>
        {loadingAuth === null ?
            <Stack.Navigator>
              <Stack.Screen name="Auth" options={{headerShown: false }} component={AuthLoadingScreen} />
            </Stack.Navigator>
          :
          loadingAuth === false && user.length !== 0 ?
            <BottomTabNavigator />: 
            <RegisterStack />
          }
      </NavigationContainer>
    );
   }
 }

 const mapStateToProps = state => {
  return {
    user: state.userData,
  };
};

export default (connect(
  mapStateToProps
)(Navegator));
