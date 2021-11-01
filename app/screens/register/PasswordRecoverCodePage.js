// Setting screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, Image, SafeAreaView, StyleSheet, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
//import all the components we are going to use.
import colorTheme from '../../config/theme.style'
import { Input, Button, ThemeProvider } from 'react-native-elements';
import CustomDropdownAlert from '../../components/CustomDropdownAlert'
import CustomModalComponent from '../../components/CustomModalComponent'
import { ModalAlert } from '../../components/Utils'
import api from './auth-service'

let theme = {
    colors: {
        primary: colorTheme.PRIMARY_COLOR,
    },
};
class PasswordRecoverCodePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            code: '',
            password: '',
            showDownAlert: '',
            errorMessage: '',
            openModal: false,
            loading: false
        }
    }
    next = async () => {
        const { navigation } = this.props;
        let { email, code, password } = this.state
        this.setState({loading: true})

        await api.recoverCode({ email: email, code: code, password: password }).then(res => {
            this.setState({ openModal: true,  loading: false})
            setTimeout(() => {
                this.setState({ openModal: false })

                setTimeout(() => {
                    navigation.navigate('LoginPage', {})
                }, 100)
            }, 3000)
        }
            // navigation.navigate('NamePage', { email: email }
        ).catch(err =>  this.setState({ showDownAlert: true, errorMessage: err.message, loading: false }))
    }

    render() {
        const { state, goBack } = this.props.navigation;
        let { email, code, password, openModal, loading } = this.state
        return (
            <>


                <CustomDropdownAlert
                    open={this.state.showDownAlert} onClose={() => this.setState({ showDownAlert: false, errorMessage: '' })}
                    text={this.state.errorMessage} />
                <SafeAreaView style={[styles.container]}>
                    <StatusBar
                        barStyle="default" />
                    <ThemeProvider theme={theme}>
                    <TouchableOpacity onPress={() => goBack()}>
                            <Image style={{ width: 11, height: 20, tintColor: colorTheme.PRIMARY_COLOR }} source={require('../../assets/images/icons/bt-back.png')} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Código</Text>
                        <Text style={styles.subtitle}>Informe o código recebido por e-mail e confirme seu endereçco de e-mail</Text>
                        <View style={styles.space}></View>
                        <Input
                            inputStyle={{ color: colorTheme.PRIMARY_COLOR }}
                            inputContainerStyle={{ borderColor: colorTheme.TEXT_MUTED }}
                            placeholderTextColor={colorTheme.TEXT_MUTED}
                            placeholder='E-mail'
                            onChangeText={(text) => {
                                this.setState({ email: text })
                            }}
                            value={this.state.email}
                        />
                        <View style={styles.space}></View>
                        <Input
                            inputStyle={{ color: colorTheme.PRIMARY_COLOR }}
                            inputContainerStyle={{ borderColor: colorTheme.TEXT_MUTED }}
                            placeholderTextColor={colorTheme.TEXT_MUTED}
                            placeholder='Código recebido por e-mail'
                            secureTextEntry={true}
                            onChangeText={(text) => {
                                this.setState({ code: text })
                            }}
                            value={this.state.code}
                        />
                        <View style={styles.space}></View>
                        <Input
                            inputStyle={{ color: colorTheme.PRIMARY_COLOR }}
                            inputContainerStyle={{ borderColor: colorTheme.TEXT_MUTED }}
                            placeholderTextColor={colorTheme.TEXT_MUTED}
                            placeholder='Informe sua nova senha'
                            secureTextEntry={true}
                            onChangeText={(text) => {
                                this.setState({ password: text })
                            }}
                            value={this.state.password}
                        />

                        <View style={styles.actionButton}>
                            <Button title='Continuar' onPress={this.next} />

                        </View>
                        { loading ? <ActivityIndicator size="large" color={colorTheme.PRIMARY_COLOR } /> : null}
                    </ThemeProvider>


                </SafeAreaView>
            </>

        );
    }
}
export default (PasswordRecoverCodePage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 15,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 30,
        color: colorTheme.PRIMARY_COLOR,
        marginTop: 10
    },
    space: {
        width: '100%',
        height: 50
    },
    subtitle: {
        marginTop: 15,
        fontSize: 18,
        lineHeight: 25,
        color: '#A2A2A2'
    },
    help: {
        fontSize: 10,
        color: '#A2A2A2',
        margin: 10
    },
    actionButton: {
        margin: 10
    },
    scrollContainer: {
        height: '100%',
        position: 'absolute',
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: 'red',
        borderColor: '#000',
        borderWidth: 3
    },
});
