// Setting screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, Image, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Animated, StyleSheet, Dimensions, ScrollView } from 'react-native'
import { Rating, AirbnbRating } from 'react-native-elements';
import FastImage, { FastImageProps } from 'react-native-fast-image'
import { whileStatement } from '@babel/types';
import colorTheme from '../config/theme.style'

const { width } = Dimensions.get('window');

const images = [
    'https://s-media-cache-ak0.pinimg.com/originals/ee/51/39/ee5139157407967591081ee04723259a.png',
    'https://s-media-cache-ak0.pinimg.com/originals/40/4f/83/404f83e93175630e77bc29b3fe727cbe.jpg',
    'https://s-media-cache-ak0.pinimg.com/originals/8d/1a/da/8d1adab145a2d606c85e339873b9bb0e.jpg',
]

class EmptyState2 extends React.Component {
    render() {
      const {title, description, illustration, width, height, label ='', onPress = () => {}} = this.props

        return (
          <View style={styles.container} >
            <FastImage source={illustration} style={{ width: width, height: height, marginBottom: 10 }} resizeMode={FastImage.resizeMode.contain}/>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
            <TouchableOpacity onPress={onPress}>
                <Text style={styles.link}>{label}</Text>
              </TouchableOpacity>
          </View>
        );
    }
}

const styles = {

    container: {
        flex: 1,
        flexDirection: 'column',
        width: width-20,
        justifyContent: 'center',
        alignItems: 'center',
        padding:30,
        marginBottom:5
    },
    title: {
      fontSize: 20,
      lineHeight: 25,
      color: colorTheme.DARK_COLOR,
      fontWeight: colorTheme.FONT_WEIGHT_REGULAR,
      marginBottom: 15,
      textAlign: 'center'
    },
    description: {
      fontSize: 16,
      lineHeight: 20,
      color: colorTheme.TEXT_MUTED,
      fontWeight: colorTheme.FONT_WEIGHT_REGULAR,
      textAlign: 'center'
    },
    link: {
      fontSize: 16,
      lineHeight: 20,
      color: colorTheme.PRIMARY_COLOR,
      fontWeight: colorTheme.FONT_WEIGHT_MEDIUM,
      textAlign: 'center',
      marginTop: 15
    },

};

/** Redux */
const mapStateToProps = state => {
  return {
    user: state.userData.user
  };
};

export default (EmptyState2)
