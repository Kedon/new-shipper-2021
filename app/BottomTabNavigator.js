import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FastImage, { FastImageProps } from 'react-native-fast-image';
import AuthLoadingScreen from './screens/AuthLoadingScreen';
import colorTheme from './config/theme.style';
import ChatBadgeIcon from './components/ChatBadgeIcon'



import { connect } from 'react-redux';

import { RegisterStack} from "./screens/register/RegisterStack";
import { HomeStack } from "./screens/home/HomeStack";
import { LikesStack } from "./screens//likes/LikesStack";
import { CheckinStack } from "./screens/checkin/CheckinStack";
import { ProfileStack } from "./screens/profile/ProfileStack";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


class BottomTabNavigator extends React.Component {


  render(){
    const { user, loadingAuth } = this.props.user
    const { chatCont } = this.props
        const chatCount = chatCont && chatCont.filter( f => {
            if(this.props.user.userId === f.owner.userId){
              return !f.owner.blocked
            } else {
              return !f.guest.blocked
            }
          }).map((m, i, a) => {
            if(this.props.user.userId === m.owner.userId){
                return m.owner.unread ? m.owner.unread : 0
            } else {
                return  m.guest.unread ? m.guest.unread : 0
            }
        }).reduce((sum, x) => sum + x, 0)

    return (
      <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let tabIcon;
          if (route.name === 'Timeline') {
            tabIcon = <FastImage tintColor={focused ? colorTheme.PRIMARY_COLOR : colorTheme.TEXT_MUTED} style={{ height: 25, width: 21}} source={require('./assets/images/timeline-tab.png')} resizeMode={FastImage.resizeMode.contain}/>;
          } else if (route.name === 'Like') {
            tabIcon = <FastImage tintColor={focused ? colorTheme.PRIMARY_COLOR : colorTheme.TEXT_MUTED} style={{ height: 25, width: 21}} source={require('./assets/images/like-tab.png')} resizeMode={FastImage.resizeMode.contain}/>;
          } else if (route.name === 'Checkin') {
            tabIcon = <FastImage tintColor={focused ? colorTheme.PRIMARY_COLOR : colorTheme.TEXT_MUTED} style={{ height: 25, width: 21}} source={require('./assets/images/checkin.png')} resizeMode={FastImage.resizeMode.contain}/>;
          } else if(route.name === 'Chats'){
            tabIcon = <FastImage tintColor={focused ? colorTheme.PRIMARY_COLOR : colorTheme.TEXT_MUTED} style={{ height: 25, width: 21}} source={require('./assets/images/matches-tab.png')} resizeMode={FastImage.resizeMode.contain}/>;
          } else if(route.name === 'Profile'){
            tabIcon = <FastImage tintColor={focused ? colorTheme.PRIMARY_COLOR : colorTheme.TEXT_MUTED} style={{ height: 25, width: 21}} source={require('./assets/images/profile.png')} resizeMode={FastImage.resizeMode.contain}/>;
          }
          return tabIcon;
        },
        tabBarActiveTintColor: colorTheme.PRIMARY_COLOR,
        tabBarInactiveTintColor: colorTheme.TEXT_MUTED,
        })}
        >
        <Tab.Screen name="Timeline" options={{ tabBarLabel: 'Timeline'}} options={{headerShown: false}} component={HomeStack} />
        <Tab.Screen name="Like" options={{ tabBarLabel: 'Me curtiu'}} component={LikesStack} />
        <Tab.Screen name="Checkin" options={{ tabBarLabel: 'Check-ins'}} options={{headerShown: false}} component={CheckinStack} />
        <Tab.Screen name="Chats" component={HomeStack} options={{ tabBarLabel: 'Chats', tabBarBadge: chatCount > 100 ? '+99' : chatCount === 100 ? '100' : chatCount > 0 ? chatCount : null }} />
        <Tab.Screen name="Profile" options={{ tabBarLabel: 'Perfil'}} component={ProfileStack} />
      </Tab.Navigator>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.userData,
    chatCont: state.chats.chatCont,

  }
};

export default (connect(
  mapStateToProps
)(BottomTabNavigator));
