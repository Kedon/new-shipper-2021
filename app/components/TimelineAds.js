// Setting screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { Animated, StyleSheet, Dimensions, ScrollView, ActivityIndicator } from 'react-native'
import { onSignIn, isSignedIn } from '../config/auth'

import ImagesUser from './ImagesUser';
import { whileStatement } from '@babel/types';
const { width } = Dimensions.get('window');
import colorTheme from '../config/theme.style'
import FastImage, { FastImageProps } from 'react-native-fast-image'
import api from '../screens/home/services'


//import all the components we are going to use.

const images = [
    'https://uploads.metropoles.com/wp-content/uploads/2019/07/16170446/outback.jpg',
]

class TimelineAds extends React.Component {
     page = 0
     state = {
         page: 0,
         //loading: true,
         coupom: this.props.coupom,
         last: this.props.cardViwed,
     }
     couponsDetails = () => {
       const { navigation } = this.props;
       navigation.navigate('CouponsDetails', { data: {} })
     }

     componentDidMount() {
       //this.getCoupons()
       console.warn(this.props)
       this.props.coupomActions()
       //this.setState({loading: false})
       //console.warn("ROI: " + JSON.stringify(this.props))
     }
     componentDidUpdate(nextProps, nextState){
       const {card, cardViwed} = this.props
       const {last} = this.state
       if(card == cardViwed && last < card){
         this.updateAdsView()
       }
     }

     updateAdsView = async () => {
       if (!this.updating) {
        this.updating = true;
        isSignedIn().then((token) => {
          api.couponsCount(JSON.parse(token), {couponId: this.state.coupom.couponId, page: "home", metrics: "views"})
              .then(res => {
                this.updating = false;
              })
              .catch(err => /*alert(err.response.data.message)*/ console.log(err))
          })
        }
     }


    render() {
      const {card, cardViwed, visible} = this.props
      const { coupom } = this.state;
      return (
            <TouchableOpacity
            style={styles.container}>
              <View
                style={{ width: '100%', height: 30, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <View style={{
                        width: '80%', height: '100%', backgroundColor: '#000', opacity: 0.05, borderTopLeftRadius: 10,
                        borderTopRightRadius: 10, position: 'absolute'
                    }}></View>
                    <View style={{
                        width: '90%', height: '50%', backgroundColor: '#000', opacity: 0.05, borderTopLeftRadius: 10,
                        borderTopRightRadius: 10, position: 'absolute'
                    }}></View>
                </View>

                <View style={styles.content} >
                  
                    <TouchableOpacity style={styles.dismiss} onPress={() => this.props.removeAd(card)} >
                        <Image style={{ width: 12, height: 12, tintColor: colorTheme.GREY_COLOR }} source={require('../assets/images/icons/close.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.clicable}  onPress={() => this.props.navigation.navigate('CouponsDetails', { couponId: this.state.coupom.couponId })}></TouchableOpacity>

                    <View style={styles.imageContent} >
                      <FastImage style={{borderRadius: 10, width: width - 30, height: '100%'}, styles.image} source={{ uri: coupom.banner }}   PlaceholderContent={<ActivityIndicator />}/>
                    </View>
                    <View style={styles.info}>
                      <Text style={styles.title} ellipsizeMode='tail' numberOfLines={1}>{coupom.name} {coupom.couponId}</Text>
                      <Text style={styles.description} ellipsizeMode='tail' numberOfLines={2}>{coupom.description}</Text>
                    </View>
                </View>
            </TouchableOpacity>

        );
    }
}


const styles = {
    container: {
        flex: 1,
        flexDirection: 'column',
        width: width-20,
        justifyContent: 'center',
        padding:5,
        marginBottom:5

    },

    dismiss: {
      position: 'absolute',
      zIndex: 9999,
      top: 4,
      right: 4,
      backgroundColor: colorTheme.GREY_LIGHT_COLOR,
      display: 'flex',
      padding: 8,
      borderRadius: 10
    },
    clicable: {
      position: 'absolute',
      zIndex: 99,
      top: 4,
      right: 4,
      left: 4,
      bottom: 4,
      backgroundColor: colorTheme.PRIMARY_COLOR,
      display: 'flex',
      padding: 8,
      borderRadius: 10,
      opacity: 0
    },

    imageContent: {
        flex: 1,
        width: '100%',
        height: "100%",
        position: 'absolute',
        borderRadius: 10,
        overflow: 'hidden'

    },

    content: {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        height: 60,
        borderRadius: 10,
        shadowOpacity: 0.75,
        shadowRadius: 5,
        shadowColor: '#ccc',
        shadowOffset: { height: 0, width: 0 },
        elevation: 4,
        backgroundColor: '#fff'
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        position: 'absolute'
    },
    gradientBk: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        resizeMode: 'stretch'
    },
    info: {
        backgroundColor: '#FFF',
        padding: 15,
        width: '100%',
        alignItems: 'center',
        display: 'flex',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    title: {
        fontSize: 20,
        marginBottom: 5,
        textAlign: 'center',
        width: '100%',
        color: colorTheme.PRIMARY_COLOR,
        flexShrink: 1
    },
    description: {
        fontSize: 14,
        color: '#A2A2A2',
        textAlign: 'center',
        flexShrink: 1
    },
    transaction: {
        margin: 5,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 3,
        height: 30,
        width: 310
    }
};
export default (TimelineAds);
