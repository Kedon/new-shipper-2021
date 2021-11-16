// Home screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, ScrollView, SafeAreaView, StyleSheet, StatusBar, FlatList, Dimensions, Image, TouchableOpacity, Switch, ActivityIndicator, Button } from 'react-native';
import colorTheme from '../../config/theme.style'
import  AppAd  from '../../components/AppAd';
import { onSignIn, isSignedIn } from '../../config/auth'
import { noAthorized } from '../../components/Utils'
import api from './services'
//import all the components we are going to use.
const { width } = Dimensions.get('window');
const height = width * 1;
const screenHeight = Dimensions.get('window').height;
const pageinfo = {
    title: "Perfil",
    page: "Profile"
};
export default class Hobbies extends Component {
   constructor(props) {
      super(props);
      noAthorized(props)
      this.state = {
          loader: true,
          hobbies: [],
          initHobbies: [],
         switch1Value: false,
         switches: [
           {
             switchId: 1,
             switchValue: false,
             switchLabel: 'Mulheres'
           },
           {
             switchId: 2,
             switchValue: false,
             switchLabel: 'Homens'
           }
         ]
      }
   }
   componentDidMount() {
       this.getHobbies();
   }
   getHobbies = () => {
     //const { navigation } = this.props;
     isSignedIn().then((token) => {
       api.hobbies(JSON.parse(token))
           .then(res => {
             this.setState({
               loading: false,
               hobbies: res.data.hobbies,
               activeHobbies: res.data.hobbies.filter(hobbies => hobbies.active)
             })
           })
           .catch(err => console.log(err.response.data.message))
       }
     );
   }

   selectHobbie = (index) => {
     // 1. Make a shallow copy of the items
     let hobbies = [...this.state.hobbies];
     // 2. Make a shallow copy of the item you want to mutate
     let item = {...hobbies[index]};
     // 3. Replace the property you're intested in
     item.active = item.active ? 0 : 1;
     // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
     hobbies[index] = item;
     // 5. Set the state to our new copy
     this.setState({hobbies});
   }

   getSelectedsHobbies = () => {
      let selecteds = this.state.hobbies.filter(hobbies => hobbies.active)
      return selecteds.map(s => s)
   }

   updateHobbies = async (params) => {
       //const { preferencesData } = this.props;
       isSignedIn().then((token) => {
         api.updateHobbies(JSON.parse(token), params)
             .then(res => {
               //preferencesData(params)
             })
             .catch(function(error) {
             console.log('There has been a problem with your fetch operation: ' + error.message);
              // ADD THIS THROW error
               throw error;
             });
         }
       );
   }


   componentWillUnmount() {
     const selecteds = this.getSelectedsHobbies()
     const initialHobbies = JSON.stringify(this.state.activeHobbies);
     const newHobbies = JSON.stringify(selecteds);
     if(initialHobbies != newHobbies) {
       this.updateHobbies(selecteds);
     }

   }


  render() {
    const { hobbies, loading } = this.state;
    const color = colorTheme.TEXT_MUTED //colorTheme.PRIMARY_COLOR;
    if(!loading){
      return (
        <SafeAreaView style={[styles.container]}>
          <AppAd style={styles.container}/>
          <View style={styles.bcontainer}>
            {hobbies.map((hobbie, index) =>
              <TouchableOpacity key={index} onPress={() => this.selectHobbie(index)} style={[styles.button, hobbie.active == 1 ? styles.buttonActive : styles.buttonInactive]}>
                <Text style={[styles.text, hobbie.active == 1 ? styles.textActive : styles.textInactive]}>{hobbie.hobbieName}</Text>
              </TouchableOpacity>)
            }
          </View>
        </SafeAreaView>
      );
    } else {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 25, paddingRight: 25 }}>
          <ActivityIndicator />
        </View>
      )
    }
  }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        margin: 15,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start' // if you want to fill rows left to right
    },
    buttonContainer: {
        width: '48%', // is 50% of container width
        margin: '1%',
        borderColor: '#000',
        borderWidth: 2,
        borderColor: colorTheme.TEXT_MUTED,
        borderRadius: 10
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
    button: {
      display: 'flex',
      width: '48%', // is 50% of container width
      margin: '1%',
      height: 50,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      //backgroundColor: '#2AC062',
      //shadowColor: '#2AC062',
      //shadowOpacity: 0.4,
      //shadowOffset: { height: 10, width: 0 },
      shadowRadius: 20,
    },
    text: {
      fontSize: 16,
      marginTop: 2
    },
    buttonActive: {
      borderColor: colorTheme.PRIMARY_COLOR,
      borderWidth: 1,
      borderColor: colorTheme.PRIMARY_COLOR,
      backgroundColor: colorTheme.PRIMARY_COLOR
    },
    textActive: {
      color: '#FFF',
    },
    buttonInactive: {
      borderColor: colorTheme.TEXT_MUTED,
      borderWidth: 1,
      borderColor: colorTheme.TEXT_MUTED,
    },
    textInactive: {
      color: colorTheme.TEXT_MUTED,
    },




});
