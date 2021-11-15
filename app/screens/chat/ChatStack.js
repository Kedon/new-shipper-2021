import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import colorTheme from '../../config/theme.style'

/* CHATS ROUTER */
import Chats from './Chats';
import ChatRoom from './ChatRoom';
/* CHATS ROUTER */


const Stack = createNativeStackNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: "#FFFFFF",
  },
  headerTintColor: colorTheme.PRIMARY_COLOR,
  headerBackTitle: "white",
  headerShown: false
};

const ChatStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
        <Stack.Screen name="Chats" options={{headerShown: false, title: 'Conversas' }} component={Chats} />
        <Stack.Screen name="ChatRoom" options={{headerShown: false, title: null }} component={ChatRoom} />
    </Stack.Navigator>
  );
}
export { ChatStack };