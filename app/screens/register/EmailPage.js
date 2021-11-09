// Setting screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, Image, SafeAreaView, StyleSheet, TouchableOpacity, StatusBar, TextInput } from 'react-native';
//import all the components we are going to use.
import colorTheme from '../../config/theme.style'
import { Input, Button, ThemeProvider } from 'react-native-elements';
import api from './auth-service'
import  CustomDropdownAlert  from '../../components/CustomDropdownAlert'
let theme = {
    colors: {
        primary: colorTheme.PRIMARY_COLOR,
    },
};
class EmailPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { email: '', placeName: '', validEmail: false,
        showDownAlert: false,
        errorMessage: '' };
    }

    next = async () => {
        const { navigation, route } = this.props;
        let { email } = this.state
        await api.getUserByEmail({email:email }).then(res => 
            {
                this.setState({showDownAlert: true, errorMessage: 'Você já está cadastrado. Tente recuperar a senha'})
                // if(res && res.data && res.data.user && res.data.user.userId) {
            }
           
        ).catch(err =>  navigation.navigate('NamePage', { email: email, data: route.params.data ? route.params.data : null }))
       
    }
    placeSubmitHandler = () => {
        if (this.state.placeName.trim() === '') {
            return;
        }
        this.props.add(this.state.placeName);
    }
    placeNameChangeHandler = (value) => {
        this.setState({
            placeName: value
        });
    }
    validate = (text) => {
        
    }

    formatUserName = (field, text) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        this.setState({ [field]: text })
        if (reg.test(text) === false) {
            console.log("Email is Not Correct");
            this.setState({ validEmail: false })
            return false;
        }
        this.setState({ validEmail: true })
        return true
    }
    

    render() {
        const { state, goBack } = this.props.navigation;
        let { email, placeName, validEmail } = this.state

        return (
        <>
        
        <CustomDropdownAlert 
         open={this.state.showDownAlert} onClose={() => this.setState({ showDownAlert: false, errorMessage: '' })} 
         text={this.state.errorMessage}/>
            <SafeAreaView style={[styles.container]}>
                <StatusBar
                    barStyle="default" />
                <ThemeProvider theme={theme}>
                    <TouchableOpacity onPress={() => goBack()}>
                        <Image style={{ width: 11, height: 20, tintColor: colorTheme.PRIMARY_COLOR }} source={require('../../assets/images/icons/bt-back.png')} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Meu</Text>
                    <Text style={styles.subtitle}>Endereço de email é:</Text>
                    <View style={styles.space}></View>
                    {/* <Input
            placeholder = "Seach Places"
            style = { styles.placeInput }
            value = { this.state.placeName }
            onChangeText = { this.placeNameChangeHandler }
            /> */}
                    {/* <Text>{placeName}</Text>
        <Button title = 'Add'
          style = { styles.placeButton }
          onPress = { this.placeSubmitHandler }
        /> */}
                    <TextInput
                        style={{ color: colorTheme.PRIMARY_COLOR, borderBottomWidth: 1, borderColor: colorTheme.TEXT_MUTED, paddingBottom: 10, marginLeft: 10, marginRight: 10, fontSize: 20}}
                        inputContainerStyle={{  }}
                        placeholderTextColor={colorTheme.TEXT_MUTED}
                        placeholder='E-mail'
                        keyboardType="email-address"
                        onChangeText={textValue => this.formatUserName('email', textValue)}
                        keyboardType={Platform.OS === 'ios' ? 'email-address' : 'email-address'}
                        value={this.state.email}  
                        autoCapitalize='none' 
                    />
                    {/*<Text style={styles.help}>Você receberá uma mensagem de confirmação antes de ativar a sua conta.</Text>*/}

                    <View style={styles.actionButton}>
                        <Button title='Continuar' onPress={this.next} disabled={!validEmail} />

                    </View>
                </ThemeProvider>

            </SafeAreaView>
            </>
        );
    }
}
// const mapStateToProps = state => {
//     return {
//       places: state.places.places,
//       placeName:  state.placeName
//     }
//   }

//   const mapDispatchToProps = dispatch => {
//     return {
//       add: (name) => {
//         dispatch(addPlace(name))
//       }
//     }
//   }
// connect(mapStateToProps, mapDispatchToProps)

export default EmailPage
// export default withNavigation(EmailPage);

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
