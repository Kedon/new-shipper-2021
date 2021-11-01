// Setting screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, Image, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Animated, StyleSheet, Dimensions, ScrollView } from 'react-native'
import colorTheme from '../config/theme.style'

const { width } = Dimensions.get('window');

const images = [
    'https://s-media-cache-ak0.pinimg.com/originals/ee/51/39/ee5139157407967591081ee04723259a.png',
    'https://s-media-cache-ak0.pinimg.com/originals/40/4f/83/404f83e93175630e77bc29b3fe727cbe.jpg',
    'https://s-media-cache-ak0.pinimg.com/originals/8d/1a/da/8d1adab145a2d606c85e339873b9bb0e.jpg',
]

class BlankCard extends React.Component {
    render() {
        return (
            <View style={styles.container}>
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
                  <Text>oi</Text>
                </View>

                </View>
        );
    }
}

const styles = {

  processing: {
    backgroundColor: Platform.OS === 'ios' ? '#00000066' : 'transparent',
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
    borderRadius: 10
  },

    container: {
        flex: 1,
        flexDirection: 'column',
        width: width-20,
        justifyContent: 'center',
        padding:5,
        marginBottom:5
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
    userPersonal: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginLeft: 20,
        marginRight: 20
    },
    score: {
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50
    },
    verified : {
        marginBottom: 5
    },
    userName: {
        color: '#fff',
        flexDirection: 'row',
        alignItems: 'flex-end'


    },
    name: {
        color: '#fff',
        fontSize: 35,
        marginRight: 10
    },
    userLocale: {
        color: '#fff',
        fontSize: 15
    },
    userScore: {
        color: '#fff',
        fontSize: 12,
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
    actionMetrics: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },

    action: {
        backgroundColor: '#fff',
        padding: 15,
        width: '100%',
        flexDirection: 'column',
        paddingTop: 45,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    actionButtons: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -35,
        zIndex: 1
    },
    button: {
        backgroundColor: '#fff',
        borderRadius: 50,
        shadowOpacity: 0.25,
        shadowRadius: 5,
        shadowColor: '#000',
        shadowOffset: { height: 0, width: 0 },
        elevation: 4,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5
    },
    buttonSmall: {
        width: 40,
        height: 40,
    },

    buttonBig: {
        width: 55,
        height: 55,
    },
    cardLabel: {
        width: '100%',
        height: '20%',
        backgroundSize: '100%',
        overflow: 'hidden',
        marginBottom: -35,
        position: 'relative'
    },

    label: {
        color: '#A6AEBC',
        fontSize: 10,
        textAlign: 'center',
    },
    text: {
        color: '#222',
        fontSize: 18,
        marginRight: 4,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    transaction: {
        margin: 5,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 3,
        height: 30,
        width: 310
    },
    modalContainer: {
      backgroundColor: Platform.OS === 'ios' ? '#00000066' : 'transparent',
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
    notes: {
      fontSize: 13,
      textAlign: 'center',
      marginTop: 10,
      marginBottom: 5,
    },
    indicator: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        height: 25,
    },

    checkin: {
      borderTopWidth: 0.5,
      marginTop: 8,
      paddingTop: 8,
      borderTopColor: '#ededed',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',

    },
    checkinTextLine: {
      flexDirection: 'row',
    },
    checkinText: {
      fontSize: 13,
      color: colorTheme.TEXT_MUTED
    },
    checkinTextBold: {
      fontWeight: '600',
    }
};

/** Redux */
const mapStateToProps = state => {
  return {
    user: state.userData.user
  };
};

export default (BlankCard)
