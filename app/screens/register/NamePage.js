// Setting screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, Image, SafeAreaView, StyleSheet, TouchableOpacity, StatusBar, TextInput } from 'react-native';
//import all the components we are going to use.
import colorTheme from '../../config/theme.style'
import { Input, Button, ThemeProvider } from 'react-native-elements';
let theme = {
    colors: {
        primary: colorTheme.PRIMARY_COLOR,
    },
};
class NamePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name : ''}
    }

    componentDidMount = () => {
        const { route } = this.props;
        this.setState({
            name: route.params && route.params.data && route.params.data.facebookName ? route.params.data.facebookName : '',
        })
    }
    next = () =>{
        const {navigation, route } = this.props;
        let { name } = this.state;
        navigation.navigate('BirthdayPage', {
            email: route.params.email,
            name: name,
            data: route.params.data ? route.params.data : null
        } )
    }
    render() {
        const { state, goBack } = this.props.navigation;
        let { name} = this.state

        return (
            <SafeAreaView style={[styles.container]}>
                <StatusBar
                    barStyle="default" />
                <ThemeProvider theme={theme}>
                    <TouchableOpacity onPress={() => goBack()}>
                        <Image style={{ width: 11, height: 20, tintColor: colorTheme.PRIMARY_COLOR }} source={require('../../assets/images/icons/bt-back.png')} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Qual é o seu nome? </Text>
                    <Text style={styles.subtitle}>Como gostaria de ser chamado(a)?</Text>
                    <View style={styles.space}></View>
                    <TextInput
                        style={{ color: colorTheme.PRIMARY_COLOR, borderBottomWidth: 1, borderColor: colorTheme.TEXT_MUTED, paddingBottom: 10, marginLeft: 10, marginRight: 10, fontSize: 20}}
                        inputContainerStyle={{  }}
                        placeholderTextColor={colorTheme.TEXT_MUTED}
                        placeholder='Seu nome'
                        onChangeText={(name) => this.setState({name})}
                        value={name}
                    />
                    <Text style={styles.help}>Deve conter pelo menos 3 caracteres</Text>

                    <View style={styles.actionButton}>
                    <Button title='Continuar' onPress={this.next}  disabled={!name || name.length < 3}/>

                    </View>
                </ThemeProvider>


            </SafeAreaView>

        );
    }
}
export default (NamePage);

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
});
