// Setting screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, Image, SafeAreaView, StyleSheet, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
//import all the components we are going to use.
import colorTheme from '../../config/theme.style'
import { Input, Button, ThemeProvider } from 'react-native-elements';
import api from './auth-service'
import CustomDropdownAlert from '../../components/CustomDropdownAlert'

let theme = {
    colors: {
        primary: colorTheme.PRIMARY_COLOR,
    },
};
class PasswordRecoverPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            loading: false
        }
    }
    next = async () => {
        const { navigation } = this.props;
        let { email } = this.state
        this.setState({loading: true})
        await api.passrecover({ email: email }).then(res => {
            this.setState({loading: false})
            navigation.navigate('PasswordRecoverCodePage', {  })
        }
            
        ).catch(err => this.setState({showDownAlert: true, errorMessage: err.message, loading: false}))

    }

    render() {
        const { state, goBack } = this.props.navigation;
        let { email, loading } = this.state
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
                        <Text style={styles.title}>Esqueci a senha</Text>
                        <Text style={styles.subtitle}>Informe o seu endereço de e-mail para recuperação da senha:</Text>
                    <View style={styles.space}></View>
                        <Input
                            inputStyle={{ color: colorTheme.PRIMARY_COLOR }}
                            inputContainerStyle={{ borderColor: colorTheme.TEXT_MUTED }}
                            placeholderTextColor={colorTheme.TEXT_MUTED}
                            disabled={loading}
                            placeholder='E-mail cadastrado'
                            onChangeText={(text) => {
                                this.setState({ email: text })
                            }}
                            value={email}
                        />
                    <Text style={styles.help}>Enviaremos uma mensagem de recuperação de senha para o seu e-mail.</Text>

                        <View style={styles.actionButton}>
                            <Button title='Continuar' onPress={this.next}    disabled={loading}/>

                        </View>

                        { loading ? <ActivityIndicator size="large" color={colorTheme.PRIMARY_COLOR } /> : null}
                    </ThemeProvider>


                </SafeAreaView>
            </>

        );
    }
}
export default (PasswordRecoverPage);

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
