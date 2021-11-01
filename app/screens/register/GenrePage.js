// Setting screen
import React, { Component } from 'react';
//import react in our code.
import { Keyboard, Text, View, Image, SafeAreaView, StyleSheet, TouchableOpacity, StatusBar, Alert } from 'react-native';
//import all the components we are going to use.
import colorTheme from '../../config/theme.style'
import { Input, Button, ThemeProvider } from 'react-native-elements';
let theme = {
    colors: {
        primary: colorTheme.PRIMARY_COLOR,
    },
};

class GenrePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            looking: '',
            genre: '',
            minAge: 18,
            maxAge: 99,
            male: null,
            female: null,
            lookingDefault: null,
            distance: 100
        }
    }

    componentDidMount() {
        setTimeout(() => {
            Keyboard.dismiss();
        }, 200);
    }

    setLooking = (genre) => {
        this.setState({ [genre]: (this.state[genre]) ? false : true })
    }
    setMine = (genre) => {

        this.setState({genre: genre})
    }
    next = () => {
        const { navigation, route } = this.props;
        //let { looking,  genre } = this.state
        const {minAge, maxAge, male, female, distance, genre} = this.state
        if(!genre || (!male && !female)){
          Alert.alert('Por favor, selecione o seu gênero e o(s) gênero(s) que bsuca.')
        } else {
          navigation.navigate('AddPhotosPage',  {
              email: route.params.email,
              name: route.params.name,
              birthDate: route.params.birthDate,
              password: route.params.password,
              ageRange: minAge+","+maxAge,
              looking: male && female ? 'MALE,FEMALE' : male ? 'MALE' : 'FEMALE',
              distance: distance,
              genre: genre
            })
        }

        console.warn({
            //email: route.params.email,
            //name: route.params.name,
            //birthDate: route.params.birthDate,
            //password: route.params.password,
            ageRange: minAge+","+maxAge,
            looking: male && female ? 'MALE,FEMALE' : male ? 'MALE' : female ? 'FEMALE' : null,
            distance: distance,
            genre: genre
    })


    }
    render() {
        const { state, goBack } = this.props.navigation;
        return (
            <SafeAreaView style={[styles.container]}>
                <StatusBar
                    barStyle="default" />
                <ThemeProvider theme={theme}>
                    <TouchableOpacity onPress={() => goBack()}>
                        <Image style={{ width: 11, height: 20, tintColor: colorTheme.PRIMARY_COLOR }} source={require('../../assets/images/icons/bt-back.png')} />
                    </TouchableOpacity>
                    
                    <Text style={styles.subtitle}>Meu</Text>
                    <Text style={styles.title}>Gênero:</Text>
                    <View style={styles.space}></View>

                    <View style={styles.bcontainer}>
                        <View style={styles.buttonContainer}>
                            <Button title="Homem" type={this.state.genre ==='MALE' ? 'solid' : 'outline'} onPress={() => this.setMine("MALE")}/>
                        </View>
                        <View style={styles.buttonContainer} >
                            <Button type={this.state.genre ==='FEMALE' ? 'solid' : 'outline'} title="Mulher" onPress={() => this.setMine("FEMALE")} />
                        </View>
                    </View>
                    <View style={styles.space}></View>
                    <Text style={styles.subtitle}>Eu</Text>
                    <Text style={styles.title}>Busco:</Text>
                   
                    <View style={styles.space}></View>

                    <View style={styles.bcontainer}>
                        <View style={styles.buttonContainer}>
                            <Button type={this.state.male ? 'solid' : 'outline'} title="Homem"  onPress={() => this.setLooking('male')} />
                        </View>
                        <View style={styles.buttonContainer} >
                            <Button type={this.state.female ? 'solid' : 'outline'}  title="Mulher"  onPress={() => this.setLooking('female')} />
                        </View>
                    </View>
                    <Text style={styles.help}>Você poderá alterar essas informações a qualquer momento nas configurações do seu perfil. Essa informação não ficará visível.</Text>

                    <View style={styles.container}>

                    </View>
                    <View style={styles.actionButton}>
                        <Button title='Continuar' onPress={this.next} />
                    </View>

                </ThemeProvider>


            </SafeAreaView>

        );
    }
}
export default (GenrePage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 15,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 30,
        color: colorTheme.PRIMARY_COLOR,

    },
    space: {
        width: '100%',
        height: 20
    },
    subtitle: {
        fontSize: 18,
        marginTop: 10,
        color: '#A2A2A2'
    },
    help: {
        fontSize: 12,
        color: colorTheme.PRIMARY_COLOR,
        margin: 10
    },
    bcontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        flex: 1,
        margin: 3
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
