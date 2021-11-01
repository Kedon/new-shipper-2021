import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import colorTheme from '../../config/theme.style'


/* HOME ROUTER */
import Likes from './Likes';
/* HOME ROUTER */

/* STACK DE CUPONS DE DESCONTO */
import Coupons from '../profile/Coupons';
import CouponsDetails from '../profile/CouponsDetails';
import Profile from '../profile/Profile';
import Preferences from '../profile/Preferences';
import Hobbies from '../profile/Hobbies';
import Configurations from '../profile/Configurations';
import Photos from '../profile/Photos';
import Invite from '../profile/Invite';
import Navegator from "../../Navegator";
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

const LikesStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
        <Stack.Screen name="Likes" options={{headerShown: false }} component={Likes} />
        {/* STACK DE CUPONS DE DESCONTO */}
        <Stack.Screen name="Profile" options={{headerShown: false }} component={Profile} />
        <Stack.Screen name="Preferences" options={ (navigation) => ({headerShown: true, title: 'Preferências' }) } component={Preferences} />
        <Stack.Screen name="Hobbies" options={ (navigation) => ({headerShown: true, title: 'Hobbies' }) } component={Hobbies} />
        <Stack.Screen name="Configurations" options={{headerShown: true, title: 'Configurações' }} component={Configurations} />
        <Stack.Screen name="Photos" options={{headerShown: true, title: 'Fotos' }} component={Photos} />
        <Stack.Screen name="Invite" options={{headerShown: true, title: 'Convites' }} component={Invite} />
        <Stack.Screen name="Coupons" options={{headerShown: true, title: 'Cupons' }} component={Coupons} />
        <Stack.Screen name="CouponsDetails" options={(navigation) => ({headerShown: false, title: JSON.stringify(navigation) })} component={CouponsDetails} />
        {/* STACK DE CUPONS DE DESCONTO */}

    </Stack.Navigator>
  );
}
export { LikesStack };