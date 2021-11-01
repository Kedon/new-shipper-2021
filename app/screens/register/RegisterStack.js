import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

/* REGISTER PAGE */
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import EmailPage from './EmailPage';
import NamePage from './NamePage';
import BirthdayPage from './BirthdayPage';
import PasswordPage from './PasswordPage';
import GenrePage from './GenrePage';
import HobbiesPage from './HobbiesPage';
import AddPhotosPage from './AddPhotosPage';
import PasswordRecoverPage from './PasswordRecoverPage';
import PasswordRecoverCodePage from './PasswordRecoverCodePage';
import ProfileCheckPage from './ProfileCheckPage'
import LoginFacebookPage from './LoginFacebookPage'
import Browser from '../../components/Browser'
/* REGISTER PAGE */


const Stack = createNativeStackNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: "#9AC4F8",
  },
  headerTintColor: "white",
  headerBackTitle: "Back",
};

const RegisterStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
        <Stack.Screen name="LoginPage" options={{headerShown: false }} component={LoginPage} />
        <Stack.Screen name="RegisterPage" options={{headerShown: false }} component={RegisterPage} />
        <Stack.Screen name="EmailPage" options={{headerShown: false }} component={EmailPage} />
        <Stack.Screen name="NamePage" options={{headerShown: false }} component={NamePage} />
        <Stack.Screen name="BirthdayPage" options={{headerShown: false }} component={BirthdayPage} />
        <Stack.Screen name="PasswordPage" options={{headerShown: false }} component={PasswordPage} />
        <Stack.Screen name="GenrePage" options={{headerShown: false }} component={GenrePage} />
        <Stack.Screen name="HobbiesPage" options={{headerShown: false }} component={HobbiesPage} />
        <Stack.Screen name="AddPhotosPage" options={{headerShown: false }} component={AddPhotosPage} />
        <Stack.Screen name="PasswordRecoverPage" options={{headerShown: false }} component={PasswordRecoverPage} />
        <Stack.Screen name="PasswordRecoverCodePage" options={{headerShown: false }} component={PasswordRecoverCodePage} />
        <Stack.Screen name="ProfileCheckPage" options={{headerShown: false }} component={ProfileCheckPage} />
        <Stack.Screen name="LoginFacebookPage" options={{headerShown: false }} component={LoginFacebookPage} />
        <Stack.Screen name="Browser" options={{headerShown: false }} component={Browser} />
    </Stack.Navigator>
  );
}
export { RegisterStack };