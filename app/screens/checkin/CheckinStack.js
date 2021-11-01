import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import colorTheme from '../../config/theme.style'


/* CHECKIN ROUTER */
import Checkin from './Checkin';
import CheckinPartner from './CheckinPartner';
import CheckinCoupons from './CheckinCoupons';
import CheckinQrCode from './CheckinQrCode';
/* CHECKIN ROUTER */
/* STACK DE CUPONS DE DESCONTO */
import Coupons from '../profile/Coupons';
import CouponsDetails from '../profile/CouponsDetails';
import Profile from '../profile/Profile';
import Preferences from '../profile/Preferences';
import Hobbies from '../profile/Hobbies';
import Configurations from '../profile/Configurations';
import Photos from '../profile/Photos';
import Invite from '../profile/Invite';
/* STACK DE CUPONS DE DESCONTO */

const Stack = createNativeStackNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: "#FFFFFF",
  },
  headerTintColor: colorTheme.PRIMARY_COLOR,
  headerBackTitle: "white",
  headerShown: false
};

const CheckinStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
        <Stack.Screen name="Checkin" options={{headerShown: false }} component={Checkin} />
        <Stack.Screen name="CheckinPartner" options={ (navigation) => ({headerShown: true, title: navigation.route.params.companyName }) } component={CheckinPartner} />
        <Stack.Screen name="CheckinCoupons" options={ (navigation) => ({headerShown: true, title: navigation.route.params.title }) } component={CheckinCoupons} />
        <Stack.Screen name="CheckinQrCode" options={{headerShown: true }} component={CheckinQrCode} />
        {/* STACK DE CUPONS DE DESCONTO */}
        <Stack.Screen name="Profile" options={{headerShown: false }} component={Profile} />
        <Stack.Screen name="Preferences" options={ (navigation) => ({headerShown: true, title: 'Preferências' }) } component={Preferences} />
        <Stack.Screen name="Hobbies" options={ (navigation) => ({headerShown: true, title: 'Hobbies' }) } component={Hobbies} />
        <Stack.Screen name="Configurations" options={{headerShown: true, title: 'Configurações' }} component={Configurations} />
        <Stack.Screen name="Photos" options={{headerShown: true, title: 'Fotos' }} component={Photos} />
        <Stack.Screen name="Invite" options={{headerShown: true, title: 'Convites' }} component={Invite} />
        <Stack.Screen name="Coupons" options={{headerShown: true, title: 'Cupons' }} component={Coupons} />
        <Stack.Screen name="CouponsDetails" options={{headerShown: false }} component={CouponsDetails} />
        {/* STACK DE CUPONS DE DESCONTO */}
    </Stack.Navigator>
  );
}
export { CheckinStack };