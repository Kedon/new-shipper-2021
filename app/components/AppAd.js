// Home screen
import React, { Component } from 'react';
//import react in our code.
import {View, Text, SafeAreaView, StyleSheet, StatusBar, Dimensions, Image, TouchableOpacity, ScrollView, ActivityIndicator, Linking } from 'react-native';
import  Packages  from './Packages';
import FastImage, { FastImageProps } from 'react-native-fast-image';
import { onSignIn, isSignedIn } from './../config/auth'

import api from './services';

//import all the components we are going to use.
const { width } = Dimensions.get('window');
const height = width * 1;
const screenHeight = Dimensions.get('window').height;
class AppAd extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: this.props.items,
      loading: true,
      ads: [],
      page: 0,
      showPackageModal: false
    }
  }
 showModal = () => {
  this.setState({showPackageModal: true})
 }

 hideModal = () => {
  this.setState({showPackageModal: false})
 }

 componentDidMount(){
   this.appAds()
 }

 appAds = async () => {
     //const { navigation } = this.props;
     isSignedIn().then((token) => {
       this.setState({loading: true})
       api.appAds(JSON.parse(token), 'slider')
           .then(res => {
             this.setState({ads: res.data, loading: false})
           })
           .catch(err => console.log(JSON.stringify(err)))
       }
     );
 }

 openSharePage = () => {
  const { navigation } = this.props;
  Linking.canOpenURL(`https://www.instagram.com/appshipper/`).then(supported => {
    if (supported) {
      Linking.openURL(`https://www.instagram.com/appshipper/`);
    } else {
      console.log("Don't know how to open URI: " + this.props.url);
    }
  });
  //navigation.navigate('Invite')
 }


  render = () => {
    const { showPackageModal, hideModal, ads, loading } = this.state
    if (!loading){
      return (
          <View style={styles.adContainer}>
            <ScrollView
            horizontal={true}
            snapToInterval={width}
            snapToAlignment={"center"}
            decelerationRate="fast"
            pagingEnabled
            showsHorizontalScrollIndicator={false}>
              {ads.map((image, index) =>
                <TouchableOpacity key={`ad_${index}`} style={styles.button, {height: 140, width: width}} onPress={this.openSharePage}>
                  <FastImage style={styles.adStyle}  source={ {uri: image.image}} resizeMode="cover"/>
                </TouchableOpacity>
              )}
            </ScrollView>
            <Packages modalVisible ={showPackageModal} onPressClose={(v)=> this.hideModal(v)} />
          </View>
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
  adContainer: {
  /*shadowColor: "#000",
  shadowOffset: {
  	width: 0,
  	height: 6,
  },
  shadowOpacity: 0.07,
  shadowRadius: 6.65,
  elevation: 6,
  borderRadius: 10*/
},
  adStyle: {
      flex: 1,
      width:width,
      borderRadius: 0
    },
});

export default (AppAd);
