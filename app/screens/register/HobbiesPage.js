// Setting screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, Image, SafeAreaView, StyleSheet, TouchableOpacity, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
//import all the components we are going to use.
import colorTheme from '../../config/theme.style'
import { Input, Button, ThemeProvider } from 'react-native-elements';
import api from './auth-service'

let theme = {
    colors: {
        primary: colorTheme.PRIMARY_COLOR,
    },
};
class HobbiesPage extends React.Component {
    constructor(props) {
        super(props);
        this.selecteds = []
        this.state = {
            loader: false,
            data: [],
            myHobbies: []
        }
    }
    componentDidMount() {
        this.getHobbies();
    }
    getHobbies = () => {
        const { navigation } = this.props;
        this.setState({loader: true})
        // api.hobbies().then(data => console.log(data)).catch(err => alert(JSON.stringify(err)))
        api.hobbies()
            .then(res => {
                this.setState({loader: false, data: res.data.hobbies})
            })
            .catch(err => console.log(err))
    }

    selectHobbie = (index) => {

    // 1. Make a shallow copy of the items
    let data = [...this.state.data];
    // 2. Make a shallow copy of the item you want to mutate
    let item = {...data[index]};
    // 3. Replace the property you're intested in
    item.active = item.active ? false : true;
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    data[index] = item;
    // 5. Set the state to our new copy
    this.setState({data});

    }

    getSelectedsHobbies = () => {
        let selecteds = this.state.data.filter(data => data.active)
       return selecteds.map(s => s)
    }
    next = () => {
        const { navigation, route } = this.props;

        navigation.navigate('ProfileCheckPage', {
                email: route.params.email,
                name: route.params.name,
                birthDate: route.params.birthDate,
                password: route.params.password,
                ageRange: route.params.ageRange,
                looking: route.params.looking,
                distance: route.params.distance,
                genre: route.params.genre,
                photos: route.params.photos,
                hobbies: this.getSelectedsHobbies(),
                data: route.params.data ? route.params.data : null
             })

    }

    render() {
        const { state, goBack } = this.props.navigation;
        const { loader } = this.state
        return (
            <SafeAreaView style={[styles.container]}>
                <StatusBar
                    barStyle="default" />
                <ThemeProvider theme={theme}>
                    <TouchableOpacity onPress={() => goBack()}>
                        <Image style={{ width: 11, height: 20, tintColor: colorTheme.PRIMARY_COLOR }} source={require('../../assets/images/icons/bt-back.png')} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Meus hábitos</Text>
                    <Text style={styles.subtitle}>O que gosta de fazer no tempo vago?</Text>

                    <View style={styles.space}></View>

                    {/* */}
                    { loader ? <View style={styles.containerLoader}>
                        <ActivityIndicator size="large" color="#888888" />
                    </View>:
                    <ScrollView>
                        <View style={styles.bcontainer}>
                            {this.state && this.state.data && this.state.data.map((h, index) => <View key={index} style={styles.buttonContainer}>
                                <Button type={h.active ? "solid": "outline"} title={h.hobbieName} buttonStyle={{ paddingLeft: 0, paddingRight: 0 }}  onPress={() => this.selectHobbie(index)} />
                            </View>)
                            }
                        </View>
                    </ScrollView> }
                    <Button title='Continuar' onPress={this.next} />
                </ThemeProvider>


            </SafeAreaView>

        );
    }
}
export default (HobbiesPage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 15,
        backgroundColor: '#fff',
    },
    containerLoader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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
        color: colorTheme.PRIMARY_COLOR,
        margin: 10
    },
    bcontainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start' // if you want to fill rows left to right
    },
    buttonContainer: {
        width: '48%', // is 50% of container width
        margin: '1%'
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
