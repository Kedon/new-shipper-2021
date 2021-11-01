// Setting screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, Image, Button, TouchableOpacity } from 'react-native';
//import all the components we are going to use.

class HeaderInner extends React.Component {

  constructor(props) {
        super(props);
        this.state = {
          scroll: true,
          appHasLoaded: true,
          appReady: false,
          rootKey: Math.random(),
          photos: [],
          userInfo: {
            coverPhoto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS34bSHEn2hxEkG-AtbYUfFlb5kFE3cWWGHcRMVCx8_c23Icx_R',
            userName: 'Tom Cruiser',
            userBirthday: '1983-03-29',
            userAge: '36',
            userCity: 'Rio de Janeiro',
            userState: 'RJ'
          },
        }

    }



    profile = () => {
      const { navigation } = this.props;
      navigation.navigate('Profile', { data: {} })
    }

    settings = () => {
      const { navigation } = this.props;
      navigation.navigate('Settings', { data: {} })
    }

    chat = () => {
      const { navigation } = this.props;
      navigation.navigate('Timeline', { data: {} })
    }


  render() {
    return (
      <View style={styles.container}>
        {/*<TouchableOpacity onPress={() => this.props.navigation.navigate('Timeline', { data: {} })}>
          <Image style={{ height: 18, width: 10}} source={require('../assets/images/icons/backIcon.png')}/>
        </TouchableOpacity>*/}
        <View style={styles.textCenter}>
            <Text style={styles.screenTitle}>{this.props.pageinfo.title}</Text>
        </View>
        {/*<TouchableOpacity onPress={this.settings}>
          <Image style={{ height: 15, width: 20}} source={require('../assets/images/menu.png')}/>
        </TouchableOpacity>*/}
      </View>
    );
  }
}


const styles = {
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      height: 65,
    },
    cards: {
      height: 200,
      flexDirection: 'row'
    },
    screenTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center'
    },
    transactions: {
      width: '100%',
    },
    transaction: {
      margin: 5,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 3,
      height: 30,
      width: 310
    },
  };

  export default (HeaderInner);
