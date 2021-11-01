import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import colorTheme from '../../config/theme.style'


/* HOME ROUTER */
import Profile from './Profile';
import Preferences from './Preferences';
import Hobbies from './Hobbies';
import Configurations from './Configurations';
import Photos from './Photos';
import Invite from './Invite';
import Coupons from './Coupons';
import CouponsDetails from './CouponsDetails';
import HomePage  from '../home/Home'


/* HOME ROUTER */


const Stack = createNativeStackNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: "#FFFFFF",
  },
  headerTintColor: colorTheme.PRIMARY_COLOR,
  headerBackTitle: "white",
  headerShown: false
};

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
        <Stack.Screen name="Profile" options={{headerShown: false }} component={Profile} />
        <Stack.Screen name="Preferences" options={ (navigation) => ({headerShown: true, title: 'Preferências' }) } component={Preferences} />
        <Stack.Screen name="Hobbies" options={ (navigation) => ({headerShown: true, title: 'Hobbies' }) } component={Hobbies} />
        <Stack.Screen name="Configurations" options={{headerShown: true }} component={Configurations} />
        <Stack.Screen name="Photos" options={{headerShown: true }} component={Photos} />
        <Stack.Screen name="Invite" options={{headerShown: true }} component={Invite} />
        <Stack.Screen name="Coupons" options={{headerShown: true }} component={Coupons} />
        <Stack.Screen name="CouponsDetails" options={{headerShown: true }} component={CouponsDetails} />
        <Stack.Screen name="HomePage" options={{headerShown: true }} component={HomePage} />
    </Stack.Navigator>
  );
}
export { ProfileStack };