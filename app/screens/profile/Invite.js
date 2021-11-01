// Home screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, SafeAreaView, StyleSheet, Dimensions, TouchableOpacity, Share } from 'react-native';
import colorTheme from '../../config/theme.style'
import  CustomButton  from '../../components/CustomButton';
import { connect } from 'react-redux';
import { noAthorized } from '../../components/Utils'

import { userData } from '../../../redux/actions/userActions';
//import dynamicLinks from '@react-native-firebase/dynamic-links';

/*async function buildLink() {
  
  const link = await dynamicLinks().buildShortLink({
    link: 'https://appshipper.page.link',
    // domainUriPrefix is created in your Firebase console
    domainUriPrefix: 'https://appshipper.page.link',
    // optional set up which updates Firebase analytics campaign
    // "banner". This also needs setting up before hand
    analytics: {
      campaign: 'banner',
    },
    android: {
      packageName: 'com.shipper',
    },
  });

  //return link;
  alert(link)
}*/

//import all the components we are going to use.
const { width } = Dimensions.get('window');
const height = width * 1;
const screenHeight = Dimensions.get('window').height;
class Invite extends Component {
  constructor(props) {
    super(props)
    noAthorized(props)
  }
  onShare = async () => {
    try {
      const result = await Share.share({
        title: 'Shipper, App de relacionamento inovador',
        message: 'Encontre pessoas disponíveis no App e conheça nos lugares mais badalados da sua cidade.',
        url: 'https://shipper.com/r/7gtEIYYZ6g',//URL INDIVIDUAL DO USUÁRIO
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  componentDidMount = () => {
    //this.createDynamicLink()
    //buildLink()
  }

  /*createDynamicLink = () => {
    const link = 
  new firebase.links.DynamicLink('https://appshipper.com.br', 'appshipper.page.link')
    .android.setPackageName('com.shipper')
    .ios.setBundleId('com.shipper');

firebase.links()
    .createDynamicLink(link)
    .then((url) => {
      // ...
    }); 
  }*/

  render() {
    return (
      <SafeAreaView style={[styles.container]}>
        <View>
          <Text style={styles.description}>Convide amigos e ganhe 15 dias* de Shipper VIP por cada amigo que se cadastrar no Shipper. Compartilhe agora mesmo!</Text>
          <TouchableOpacity>
            <Text style={styles.learnMore}>Saiba mais</Text>
          </TouchableOpacity>
          <Text style={styles.url}>https://shipper.com/r/{this.props.user.code}</Text>
          <TouchableOpacity style={styles.button} onPress={this.onShare}>
            <CustomButton  text={'Convidar amigos'}></CustomButton>
          </TouchableOpacity>
          <Text style={styles.small}>*Máximo de 180 dias por usuário.</Text>
        </View>
      </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    marginLeft: 20,
    height: screenHeight - 80,
  },
  description: {
    color: colorTheme.TEXT_MUTE,
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center'
  },
  learnMore: {
    fontSize: 16,
    marginBottom: 10,
    color: colorTheme.PRIMARY_COLOR,
    fontWeight: '600',
    textAlign: 'center'
  },
  url: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
    textAlign: 'center',
    color: colorTheme.DARK_COLOR
  },
  small: {
    fontSize: 12,
    marginTop: 10,
    fontWeight: '600',
    textAlign: 'center',
    color: colorTheme.TEXT_MUTED
  }
});

/** Redux */
const mapStateToProps = state => {
  return {
    user: state.userData.user
  };
};

export default connect(
  mapStateToProps,
)(Invite);
