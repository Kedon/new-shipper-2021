// Setting screen
import React, { Component } from 'react';
import theme from '../../config/theme.style'
//import react in our code.

import { Keyboard, KeyboardAvoidingView, ScrollView, Text, SafeAreaView, View, Image, StyleSheet, StatusBar, Dimensions, Linking, Alert, Platform, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
//import { KeyboardAccessoryView, KeyboardAccessoryNavigation } from 'react-native-keyboard-accessory';

import { Input } from 'react-native-elements';
import { Icon, Button, ThemeProvider } from 'react-native-elements';
import api from './auth-service'
import { onSignIn, isSignedIn, userDataSave } from '../../config/auth'
import CustomDropdownAlert from '../../components/CustomDropdownAlert'

import AsyncStorage from '@react-native-community/async-storage';
import { loggedUser, user } from '../../config/constants'

const screenHeight = Dimensions.get('window').height;
import NetInfo from "@react-native-community/netinfo";
import { connect } from 'react-redux';
import { preferencesData } from '../../../redux/actions/preferencesActions';
import { userData, userToken } from '../../../redux/actions/userActions';
import OneSignal from 'react-native-onesignal';


const { width } = Dimensions.get('window');


// import Loader from 'react-native-mask-loader';
//import all the components we are going to use.
let eltheme = {
  colors: {
    primary: '#fff',
  },
};
class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.scroll = null;
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    this.state = {
      scroll: true,
      appHasLoaded: true,
      appReady: false,
      rootKey: Math.random(),
      photos: [],
      email: 'anitta@kedon.com.br',
      password: '123456',
      //email: '',
      //password: '',
      showDownAlert: false,
      errorMessage: '',
      accountButtons: true,
      connection: {
        type: null,
        isConnected: null
      },
      modalVisible: false,
    }

    this._image = require('../../assets/images/icons/twitter.png');
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({ connection: { type: state.type, isConnected: state.isConnected } })
    });
  }

  /*componentDidMount() {
    isSignedIn().then(data => {
      console.warn(this.props.user)
    })
  }*/
  componentWillUnmount() {
    this.unsubscribe()
  }



  getItemData = async () => {
    try {
      let user = await AsyncStorage.getItem(loggedUser)
      //alert(user)

    } catch (error) {
      console.warn(JSON.stringify(error))
    }
  }
  resetAnimation() {
    this.setState({
      appReady: false,
      rootKey: Math.random()
    });

    setTimeout(() => {
      this.setState({
        appReady: true,
      });
    }, 3000);
  }

  componentDidUpdate() {
    const { navigation, route } = this.props;
    /*if (route.params && route.params.register == 'register' && route.params.email && route.params.password) {
      api.authentication({ email: route.params.email, password: route.params.password }).then(async res => {
        await userDataSave(res.data.user)
        await onSignIn(res.token).then(() => {
          navigation.navigate("App")
        }
        )
      }).catch(err => alert(JSON.stringify(err)))
    }*/
  }

  componentWillUnmount() {
    // this.keyboardDidShowListener.remove();
    //this.keyboardDidHideListener.remove();
  }
  _keyboardDidShow() {
    // this.scroll.scrollToEnd({ animated: true });
    this.setState({ accountButtons: false })
  }

  _keyboardDidHide() {
    // this.scroll.scrollToEnd({ animated: true });
    this.setState({ accountButtons: true })

  }



  register = () => {
    const { navigation } = this.props;
    navigation.navigate('EmailPage', { data: {} })
  }

  browser = (title, url) => {
    const { navigation } = this.props;
    navigation.navigate('Browser', { title, url })
  }

  gpsDebug = () => {
    const { navigation } = this.props;

    navigation.navigate("Debbuger")

  }

  enter = async () => {

    const { email, password } = this.state
    this.setState({ loading: true })
    await api.authentication({ email: email, password: password })
      .then(async res => {
        this.setState({ loading: false })
        userDataSave(res.data.user)
        this.getUserInfo(res.data.token)
        OneSignal.setExternalUserId(res.data.user.userId);
        OneSignal.sendTag("USER", res.data.user.userId);
        try {
          await onSignIn(res.data.token)
          //
        } catch (error) {
          console.warn(error)
        }

      })
      .catch(err => {
        this.setState({ showDownAlert: true, errorMessage: err && err.data && err.data.message })
        console.log(JSON.stringify(err))
      })
  }
  facebookLogin = async () => {
    const { navigation } = this.props;

    navigation.navigate("LoginFacebookPage")

  }

  async getUserInfo(token) {
    const { userData, userToken, preferencesData } = this.props;
    await api.getUserInfo(token)
      .then(res => {
        userData(res.data[0].data)
        userToken(token)

      })
      .catch(function (error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
        // ADD THIS THROW error
        throw error;
      });

      //OBTEM AS PREFERENCIAS DO USUARIO 
      await api.userPreferences(token)
      .then(res => {
        console.warn(JSON.stringify(res))
        const { minAge, maxAge, looking, distance } = res.data[0]
        const params = {
          ageRange: minAge+","+maxAge,
          looking: looking,
          distance: distance
        }
        preferencesData(params)
      })
      .catch(function (error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
        // ADD THIS THROW error
        throw error;
      });
  }
  // onSignIn(res.token).then(() => navigation.navigate("App"))

  // enter = () => {
  //   const { navigation } = this.props;
  //   const { email, password } = this.state

  //   api.authentication({ email: email, password: password }).then(res => {

  //   }).catch(err => alert(JSON.stringify(err)))
  // }
  forgetPassword = () => {
    const { navigation } = this.props;
    navigation.navigate('PasswordRecoverPage', { data: {} })
  }

  toggleModal() {
    this.setState( prevState => ({ modalVisible: !prevState.modalVisible }))
  };
  formatUserName = (field, textValue) => {
    this.setState({ [field]: textValue.toLowerCase() });
  }

  render() {
    let { email, password, connection, loading } = this.state;

    return (

      // <View key={this.state.rootKey} style={styles.root}>
      // <Loader
      //   isLoaded={this.state.appReady}
      //   imageSource={this._image}
      //   backgroundStyle={styles.loadingBackgroundStyle}>
      <View style={styles.content}>
        <StatusBar barStyle="light-content" />
        <Image source={require('../../assets/images/bkg-gradient-red.png')} style={styles.gradientContainer} />
        <View style={styles.imageOverlay}></View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <SafeAreaView style={[styles.container]}>
            <ThemeProvider theme={eltheme} style={{ maxHeight: screenHeight - 90, backgroundColor: '#000' }}>
              <View style={styles.form} >
                <ScrollView
                  style={styles.messages}
                  scrollsToTop={true}
                  ref={(scroll) => { this.scroll = scroll; }}
                  keyboardShouldPersistTaps="handled"
                  onContentSizeChange={(contentWidth, contentHeight) => {
                    // this.scroll.scrollToEnd({ animated: true });
                  }}>
                  {/*<Text  style={{color: '#fff', fontSize: 12, textAlign: 'center'}}>Conexão: {connection.type}</Text>
                  <Text  style={{color: '#fff', fontSize: 12, textAlign: 'center'}}>Está conectado: {connection.isConnected ? 'SIM': 'NÃO'}</Text>*/}
                  <View style={{flex: 1, flexDirection:'row', justifyContent: 'center', marginBottom: 25}}>
                  <Image source={require('../../assets/images/logo.png')} style={{  width: 65, height: 65}} resizeMode="contain" />
                   <Image source={require('../../assets/images/shipper-logo-text.png')} style={{ width: 175, height: 65, marginLeft: 15}} resizeMode="contain" />
                  </View>
                  
                  <View>
                    <Input
                      autoCapitalize='none'
                      autoCorrect={false}
                      inputStyle={{ color: '#fff' }}
                      leftIcon={
                        <Image style={{ width: 15, height: 15, tintColor: '#fff', opacity: 0.65, marginRight: 10 }} source={require('../../assets/images/icons/user.png')} />
                      }
                      onChangeText={textValue => this.formatUserName('email', textValue)}
                      keyboardType={Platform.OS === 'ios' ? 'default' : 'visible-password'}
                      value={this.state.email}

                      inputContainerStyle={{ borderColor: '#fff' }}
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      placeholder='Seu email'
                      //keyboardType="email-address"
                      //onChangeText={(email) => this.setState({ email: email })}
                      //value={email}
                    />
                    <Input
                      inputStyle={{ color: '#fff' }}
                      inputContainerStyle={{ borderColor: '#fff' }}
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      placeholder='Senha'
                      secureTextEntry={true}
                      onChangeText={(password) => this.setState({ password })}
                      value={password}
                      leftIcon={
                        <Image style={{ width: 15, height: 18, tintColor: '#fff', opacity: 0.65, marginRight: 10 }} source={require('../../assets/images/icons/key.png')} />
                      }
                    />


                  </View>
                  <View style={styles.enterButton}>
                    <TouchableOpacity
                      style={styles.buttonStyle}
                      onPress={this.enter}
                      underlayColor='#fff'>
                      <Text style={{ color: theme.PRIMARY_COLOR, textAlign: 'center', fontSize: 18 }}>{loading ? <ActivityIndicator color={theme.PRIMARY_COLOR} /> :' Entrar'}</Text>
                    </TouchableOpacity>
                    {/* <Button title='Entrar' onPress={this.enter} buttonStyle={styles.buttonStyle} /> */}
                    <Button title='Esqueci minha senha' onPress={this.forgetPassword} type="clear" color='white' />
                  </View>
                </ScrollView>
              </View>
            </ThemeProvider>
          </SafeAreaView>
        </KeyboardAvoidingView>
        {this.state.accountButtons &&
          <ThemeProvider theme={eltheme} style={styles.registerButtons}>
            <View style={styles.register}>
              <Button title='Criar conta' onPress={this.register} type="outline" buttonStyle={{ marginBottom: 10, borderWidth: 1, borderRadius: 30 }} />
              <Button onPress={this.facebookLogin}
                buttonStyle={{ marginBottom: 10, borderWidth: 1, borderRadius: 30 }}
                icon={
                  <Image style={{ width: 20, height: 20, tintColor: '#fff', marginRight: 10 }} source={require('../../assets/images/icons/facebook.png')} />}
                iconLeft title='Cadastrar com facebook' type="outline" />
            </View>
            <Text style={styles.terms}>
                  Ao tocar em entrar, você concorda com os nossos <Text onPress={() => this.browser('Termos', 'http://appshipper.com.br/docs/termos_de_uso.html')} style={styles.termLink}>Termos</Text>. Saiba como processamos seus dados em nossa <Text onPress={() => this.browser('Política de Privacidade', 'http://appshipper.com.br/docs/politicas_de_privacidade.html ')} style={styles.termLink}>Política de Privacidade</Text> e <Text onPress={() => this.browser('Políticas de Cookies', 'http://appshipper.com.br/docs/politicas_de_privacidade.html')} style={styles.termLink}>Política de Cookies</Text>.
            </Text>
          </ThemeProvider>
        }
        <CustomDropdownAlert
          open={this.state.showDownAlert} onClose={() => this.setState({ showDownAlert: false, errorMessage: '' })}
          text={this.state.errorMessage} />
      </View>
      // </Loader>
      //   </View>

    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    position: 'absolute',
    justifyContent: 'center', alignItems: 'center'
  },
  gradientContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    position: 'absolute',
    justifyContent: 'center', alignItems: 'center'
  },
  content: {
    flex: 1,
  },
  buttonStyle: {
    padding: 10,
    borderRadius: 30,
    backgroundColor: 'green',
    backgroundColor: theme.WHITE,
    color: theme.PRIMARY_COLOR,
  },
  enterButton: {
    padding: 10,
    marginTop: 20
  },
  imageOverlay: {
    height: '100%',
    width: '100%',
    backgroundColor: '#C6002C',
    opacity: 0.0,
    position: 'absolute',
  },
  form: {
    marginTop: 40,
    color: '#fff',
    width: '90%',
  },
  formTitle: {
    color: '#fff',
    fontSize: 30,
    width: '100%',
    textAlign: 'center',
    marginBottom: 30
    // fontFamily: 'Nunito-Regular',
  },
  registerButtons: {
    flex: 1,
    padding: 40,
    left: 20,
    backgroundColor: '#FFF',
    position: 'absolute'
  },
  register: {
    padding: 10,
  },
  root: {
    flex: 1,
  },
  loadingBackgroundStyle: {
    backgroundColor: '#F73859',
  },
  terms: {
    color: "#FFF",
    marginBottom: 30,
    marginTop: 0,
    marginRight: 30,
    marginLeft: 30,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center"
  },
  termLink: {
    textDecorationLine: "underline",
    fontWeight: '700'
  },
  modalContainer: {
    backgroundColor: Platform.OS === 'ios' ? '#00000066' : 'rgba(0,0,0,0.5)',
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalComponent: {
    height: 'auto',
    flex: 1,
    flexDirection: 'column',
    width: width - 50,
    marginRight: 10,
    marginLeft: 10,
    justifyContent: 'center',
  },
  modalItem: {
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    padding: 15
  },
  modalTitle: {
    fontSize: 25,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontWeight: '600',
  },
  modalParagraph: {
    fontSize: 20,
    lineHeight: 23,
    marginBottom: 10,
    textAlign: 'center',
  },
  closeButton: {
    color: '#FFF',
    marginTop: 20,
    textAlign: 'center'
  },

})

/** Redux */
const mapStateToProps = state => {
  return {
    user: state.userData.user,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userData: user => {
      dispatch(userData(user))
    },
    userToken: token => {
      dispatch(userToken(token))
    },
    preferencesData: preferences => {
      dispatch(preferencesData(preferences))
    }

  };
};

export default (connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage));
