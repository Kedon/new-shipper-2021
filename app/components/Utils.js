
import React, { Component } from 'react';
import { Text, View, Image, Alert } from 'react-native';

// import Icons from '../config/Icons'
import { isSignedIn } from '../config/auth'


// export const ModalAlert = ({ title = '...', subtitle = null, type = 'SUCCESS', onPress = () => { } }) => (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//         <Image source={type === 'SUCCESS' ? Icons.success : Icons.error} />
//         <Text style={{ fontSize: 20 }}>{title}</Text>
//         <Text style={{ fontSize: 12, marginTop: 10, color: "#cccccc" }}>{subtitle}</Text>
//     </View>
// )



export const noAthorized = (props) => {
    const { navigation } = props;
    isSignedIn()
        .then(data => data)
        .catch(error => {
            if (!this.alertPresent) {
                this.alertPresent = true;
                if (error) {
                    if (error) {
                        Alert.alert('Não autorizado',
                            'Você não tem autorização para ver essa página.', [{
                                text: 'OK',
                                onPress: () => {

                                    this.alertPresent = false
                                    if (navigation) {
                                        navigation.navigate('LoginPage', { data: {} })
                                    }

                                }
                            }], { cancelable: false });
                    }

                } else {
                    this.alertPresent = false;
                }
            }
        })


}

//   Alert.alert(
//     'Não autorizado',
//     'Você não tem autorização para ver essa página.',
//     [
//       {text: 'OK', onPress: () =>  navigation.navigate('LoginPage', { data: {} })},
//     ],
//     { cancelable: false }
//   )


