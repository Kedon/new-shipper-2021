// Setting screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, Image, SafeAreaView, StyleSheet, TouchableOpacity, StatusBar, ScrollView, NativeModules, FlatList, TouchableHighlight, ActivityIndicator } from 'react-native';
//import all the components we are going to use.
import colorTheme from '../../config/theme.style'
import { Input, Button, ThemeProvider } from 'react-native-elements';
import moment from "moment";
import api from './auth-service'

let theme = {
    colors: {
        primary: colorTheme.PRIMARY_COLOR,
    },
};

class ProfileCheckPage extends React.Component {
    constructor(props) {
        super(props);
        // this.selectImage = this.selectImage.bind(this)
    }
    state = {
      loading: false
    }
    componentDidMount = async () => {
        // this.getPhotos()
        this.next()

    };
    //   getPhotos = () => {
    //     CameraRoll.getPhotos({
    //       first: 20,
    //       assetType: 'All'
    //     })
    //     .then(r => this.setState({ photos: r.edges }))
    //   }

    next = () => {
        const { navigation, route } = this.props;
        // navigation.navigate('HobbiesPage', {
        //     email: route.params.email,
        //     name: route.params.name,
        //     birthDate: route.params.birthDate,
        //     password: route.params.password,
        //     looking: route.params.looking,
        //     genre: route.params.genre,
        //     photos: route.params.photos,
        //     hobbies: route.params.hobbies,
        // })

        console.log({
            email: route.params.email,
            name: route.params.name,
            birthDate: route.params.birthDate,
            password: route.params.password,
            ageRange: route.params.ageRange,
            looking: route.params.looking,
            distance: route.params.distance,
            genre: route.params.genre,
            photos: route.params.photos,
            hobbies: route.params.hobbies,
        })
    }

    saveUser = async() => {
        this.setState({ loading: true });
        const { navigation, route } = this.props;
        //alert(JSON.stringify(route.params.photos))
        let params = {
            firstName: route.params.name,
            lastName: 'None',
            email: route.params.email,
            password: route.params.password,
            birthDate:  moment(moment(route.params.birthDate, 'DD/MM/YYYY')).format('YYYY-MM-DD'),
            genre: route.params.genre,
            ageRange: route.params.ageRange,
            looking: route.params.looking,
            distance: route.params.distance,
            photos: route.params.photos,
            hobbies: route.params.hobbies,
            type: 'USER',
            facebookUserId: route.params && route.params.data && route.params.data.facebookId ? route.params.data.facebookId : null,
            //data: route.params.data ? route.params.data : null
          }

        //let newUser = await api.create(params)
        api.create(params).then(res => {
          if(res.status == 'OK'){
            this.setState({ loading: false }, () => this.props.navigation.navigate('LoginPage', {source: 'register', email: route.params.email, password: route.params.password}));
          }
         }).catch(err => console.log(JSON.stringify(err)))

        //let userData = await api.getUserByEmail({email: params.email})
        //let userAttr = userData.data.user
        /*api.userPhotos({ photos: route.params.photos, userId: userAttr.userId }).then(res => {
           if(res.status == 'OK'){
             this.setState({ loading: false }, () => this.props.navigation.navigate('LoginPage', {}));
           }
         }).catch(err => alert(JSON.stringify(err)))*/
    }
    // selectImage() {
    //     ImagePicker.openCropper({
    //         path: this.state.image.uri,
    //         width: 200,
    //         height: 200
    //       }).then(image => {
    //         console.log('received cropped image', image);
    //         this.setState({
    //           image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
    //           images: null
    //         });
    //       }).catch(e => {
    //         console.log(e);
    //         Alert.alert(e.message ? e.message : e);
    //       });
    // }
    browser = (title, url) => {
        const { navigation } = this.props;
        navigation.navigate('Browser', { title, url })
      }

    render() {
        const { state, goBack } = this.props.navigation;
        const { navigation, route } = this.props;
        return (
            <SafeAreaView style={[styles.container]}>
                <StatusBar
                    barStyle="default" />
                <ThemeProvider theme={theme}>
                    <TouchableOpacity onPress={() => goBack()}>
                        <Image style={{ width: 11, height: 20, tintColor: colorTheme.PRIMARY_COLOR }} source={require('../../assets/images/icons/bt-back.png')} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Confira</Text>
                    <ScrollView>
                    <View style={styles.space}></View>
                        <View>
                            <Text style={styles.subtitle}>Seus dados pessoais:</Text>
                            <Text style={styles.info}><Text style={styles.label}>Nome: </Text><Text style={styles.text}>{route.params.name}</Text></Text>
                            <Text style={styles.info}><Text style={styles.label}>E-mail:  </Text><Text style={styles.text}>{route.params.email}</Text></Text>
                            <Text style={styles.info}><Text style={styles.label}>Data de aniversário: </Text><Text style={styles.text}>{route.params.birthDate}</Text></Text>
                            <Text style={styles.info}><Text style={styles.label}>Sexo: </Text><Text style={styles.text}>{route.params.genre == 'MALE' ? 'Masculino' : 'Feminino'}</Text></Text>
                            <Text style={styles.info}><Text style={styles.label}>Buscando: </Text><Text style={styles.text}>{route.params.looking == 'MALE' ? 'Masculino' : 'Feminino'}</Text></Text>
                        </View>

                        <Text style={[styles.subtitle, { marginTop: 20 }]}>Seus hobbies:</Text>
                        {route.params.hobbies ? route.params.hobbies.map((hobby, index) =>
                            <View key={index}>
                               <Text style={styles.info}>{hobby.hobbieName}</Text>
                            </View>) : null}

                        {/* <Text style={[styles.subtitle, { marginTop: 20 }]}>Suas fotos:</Text>
                        <View style={styles.bcontainer}>
                            {route.params.photos ? route.params.photos.map((photo, index) =>
                                <View key={index} style={[styles.buttonContainer, styles.greybkg]}>
                                    <Image style={[{ width: 200, height: 130 }]} source={{ uri: photo }} />
                                </View>) : null}
                        </View> */}


                    </ScrollView>
                    {/*
                    {(this.state.loading) &&
                      <View style={[styles.loadingContainer]}>
                        <Text style={styles.info}>Criando a sua conta</Text>
                        <ActivityIndicator />
                      </View>
                    }
                    {(!this.state.loading) &&
                    <View style={styles.actionButton}>
                        <Button title='Finalizar' onPress={this.saveUser} />
                    </View>
                  }*/}
                    <Text style={styles.terms}>
                        Ao finalizar o seu cadastro, você concorda com os nossos <Text onPress={() => this.browser('Termos', 'http://appshipper.com.br/docs/termos_de_uso.html')} style={styles.termLink}>Termos</Text>. Saiba como processamos seus dados em nossa <Text onPress={() => this.browser('Política de Privacidade', 'http://appshipper.com.br/docs/politicas_de_privacidade.html ')} style={styles.termLink}>Política de Privacidade</Text> e <Text onPress={() => this.browser('Políticas de Cookies', 'http://appshipper.com.br/docs/politicas_de_privacidade.html')} style={styles.termLink}>Política de Cookies</Text>.
                    </Text>

                  <View style={styles.actionButton}>
                  {this.state.sending ?
                    <ActivityIndicator size="small" color={colorTheme.PRIMARY_COLOR} />
                    :
                      <Button title='Finalizar' disabled={this.state.loading} onPress={this.saveUser} />
                  }
                  </View>
                </ThemeProvider>

            </SafeAreaView>

        );
    }
}
export default (ProfileCheckPage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 15,
        backgroundColor: '#fff',
    },
    loadingContainer: {
      backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.45)',
      position: 'absolute',
      width: '100%',
      height: '100%',
      borderRadius: 5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3
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
        marginBottom: 25,
        color: colorTheme.PRIMARY_COLOR,
    },
    info: {
        fontSize: 15,
        lineHeight: 20
    },
    label: {
        fontWeight: '600',
        color: colorTheme.DARK_COLOR
        
    },
    text: {
    color: colorTheme.TEXT_MUTED
    },
    help: {
        fontSize: 10,
        textAlign: 'center',
        color: colorTheme.PRIMARY_COLOR,
        margin: 20,
        fontWeight: 'bold'
    },
    bcontainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start', // if you want to fill rows left to right,
    },
    buttonContainer: {
        width: '31%', // is 50% of container width
        margin: '1%',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 130,
        overflow: 'hidden'

    },
    pinkbkg: {
        backgroundColor: `rgba(247, 56, 89, 0.1)`,
        borderWidth: 2,
        borderColor: colorTheme.PRIMARY_COLOR,
    },
    greybkg: {
        backgroundColor: `rgba(234, 234, 234, 0.4)`,
        borderWidth: 2,
        borderColor: '#D1D1D1',
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
    terms: {
        borderColor: colorTheme.TEXT_MUTED,
        marginBottom: 20,
        marginTop: 0,
        fontSize: 12,
        lineHeight: 18,
        textAlign: "center"
      },
      termLink: {
        textDecorationLine: "underline",
        fontWeight: '700'
      },
});
