// Setting screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, Image, SafeAreaView, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
//import all the components we are going to use.
import moment from "moment";
import colorTheme from '../../config/theme.style'
import { Input, Button, ThemeProvider } from 'react-native-elements';
import { TextInputMask } from 'react-native-masked-text'
let theme = {
    colors: {
        primary: colorTheme.PRIMARY_COLOR,
    },
};
class BirthdayPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            birthDate: '',
            buttonDisabled: true
        }
    }
    next = () => {
        const { navigation, route } = this.props;
        let {birthDate} = this.state
        navigation.navigate('PasswordPage', {

                email: route.params.email,
                name: route.params.name,
                birthDate: birthDate,
                data: route.params.data ? route.params.data : null
        })
    }
    render() {
        const { state, goBack } = this.props.navigation;
        let { birthDate } = this.state
        return (
            <SafeAreaView style={[styles.container]}>
                <StatusBar
                    barStyle="default" />
                <ThemeProvider theme={theme}>
                    <TouchableOpacity onPress={() => goBack()}>
                        <Image style={{ width: 11, height: 20, tintColor: colorTheme.PRIMARY_COLOR }} source={require('../../assets/images/icons/bt-back.png')} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Eu</Text>
                    <Text style={styles.subtitle}>Nasci em:</Text>
                    <View style={styles.space}></View>

                    <TextInputMask
                        type={'datetime'}
                        options={{
                            format: 'DD/MM/YYYY'
                        }}
                        placeholder='Data de Nascimento'
                        onChangeText={(birthDate) => this.setState({ birthDate })}
                        value={birthDate}
                        style={styles.textInputStype}
                    />


                    {/* <Input
                        inputStyle={{ color: colorTheme.PRIMARY_COLOR }}
                        inputContainerStyle={{ borderColor: colorTheme.TEXT_MUTED }}
                        placeholderTextColor={colorTheme.TEXT_MUTED}
                        placeholder='Data de Nascimento'
                        onChangeText={(birthDate) => this.setState({ birthDate })}
                        value={birthDate}
                    /> */}
                    <Text style={styles.help}>Qual é a sua data de nascimento?</Text>

                    <View style={styles.actionButton}>
                        <Button title='Continuar'onPress={this.next} disabled={!birthDate || birthDate.length < 10 || (birthDate.length === 10 && moment().diff(moment(moment(birthDate, 'DD/MM/YYYY')).format('YYYY-MM-DD'), 'years') < 18 ) || (birthDate.length === 10 && moment().diff(moment(moment(birthDate, 'DD/MM/YYYY')).format('YYYY-MM-DD'), 'years') > 99 )}/>

                    </View>
                </ThemeProvider>


            </SafeAreaView>

        );
    }
}
export default (BirthdayPage);

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
        fontSize: 18,
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
    textInputStype : {
        height: 50,
        borderColor: colorTheme.TEXT_MUTED,
        borderBottomWidth: 1,
        color: colorTheme.PRIMARY_COLOR,
        fontSize: 18,
        marginHorizontal: 10
      }
});
