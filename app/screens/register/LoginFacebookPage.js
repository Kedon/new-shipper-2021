import React, { Component } from 'react';
import { Text, View, ScrollView, RefreshControl, SafeAreaView, StyleSheet, StatusBar, FlatList, Dimensions, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import api from './auth-service'
import { apiUrl, domain } from '../../config/constants'
import { onSignIn, isSignedIn } from '../../config/auth'
import CustomModalComponent from '../../components/CustomModalComponent'
import { ModalAlert } from '../../components/Utils'
// import SocketIOClient from 'socket.io-client'


class LoginFacebookPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            openModal: false,
            type: '',
            title: '',
            subtitle: ''
        }
        // this.socket = SocketIOClient(domain);
        //Listen on new_message
        // this.socket.on("fabebook_login", async (data) => {
        //     alert(JSON.stringify(data))
        // })
    }
    componentDidMount() {
        // this.createCheckout()
    }

    getUserData = (data) => {
        const { navigation } = this.props;

        if (data && !data.loading) {
            let token = null,
                email = null,
                user = null;
            if (data.url.indexOf('token') !== -1) {
                var params = data.url.split("?")[1].split("&");
                token = params[0].replace('token=', '')
                email = params[1].replace('email=', '')
                user = params[2].replace('user=', '')
            }



            if (token && email) {

                this.setState({ openModal: true, type: 'SUCCESS', title: 'Login realizado com sucesso', subtitle: 'Você será redirecionado para a home' })
                setTimeout(() => {
                    this.setState({ openModal: false })
                    setTimeout(() => {
                        onSignIn(token).then(() => navigation.navigate("App"))
                    }, 100)
                }, 3000)
            }
            else if(data.title === 'Erro') {
                setTimeout(() => {
                    this.setState({ openModal: true, type: 'ERROR', title: 'Não foi possível fazer login', subtitle: 'Você será redirecionado para a home' })
                    setTimeout(() => {
                        this.setState({ openModal: false })

                        setTimeout(() => {
                            navigation.navigate('LoginPage', {})
                        }, 100)
                    }, 3000)
                }, 500)
            }
        }
    }

    render() {
        const { openModal, title, type, subtitle } = this.state
        return (<View style={{ flex: 1 }}>
            <WebView
                source={{ uri: `${domain}/${apiUrl}/login/auth/facebook` }}
                startInLoadingState={true}
                onNavigationStateChange={state => this.getUserData(state)}
                // onNavigationStateChange={state => this.stateChange(state)}
                renderLoading={() => <View style={{ flex: 1, }}><ActivityIndicator></ActivityIndicator></View>}
            />
            {/*<CustomModalComponent open={openModal} showCloseButton={false} position={'bottom'} fullHeight={false} height={300} fullWidth={true} onPressClose={() => this.setState({ openModal: false })} >
                <ModalAlert title={title} type={type} subtitle={subtitle} />
            </CustomModalComponent>*/}
        </View>)
    }
}

export default (LoginFacebookPage);