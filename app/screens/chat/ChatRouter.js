import React, { Component } from 'react';
import { View, Dimensions, TouchableOpacity, Text } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import colorTheme from '../../config/theme.style';


import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import Chats from './Chats';
import ChatRoom from './ChatRoom';

export const ChatStack = createStackNavigator({
  Chats: {
    screen: Chats,
    navigationOptions: ({ navigation }) => ({
      title: 'Conversas',
      header: null,
      headerTitleStyle: {
        fontWeight: "bold",
        color: "#fff",
        zIndex: 1,
        fontSize: 18,
        lineHeight: 23,
      },
      headerTintColor: "#fff"
    }),
  },
  ChatRoom: {
    screen: ChatRoom,
    navigationOptions: ({ navigation }) => ({
      //title: navigation.getParam('title', ''),
      tabBarVisible: false,
      header: null,
      headerStyle: {
        backgroundColor: "#fff",
        borderBottomWidth: 0
      },
      headerTitleStyle: {
        fontWeight: "bold",
        color: "#000",
        zIndex: 1,
        fontSize: 16,
        lineHeight: 23
      },
      headerTintColor: colorTheme.PRIMARY_COLOR,
      headerBackTitleStyle: {
        fontWeight: "400",
        fontSize: 16,
        lineHeight: 23
      }
    }),
  }

}, {
    navigationOptions: ({ navigation }) => ({
      tabBarVisible: navigation.state.index < 1,
      header: {
          style: {
              elevation: 0,       //remove shadow on Android
              shadowOpacity: 0,   //remove shadow on iOS
              borderBottomWidth: 0
          }
      }
    })
  })
