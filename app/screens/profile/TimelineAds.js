// Setting screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { Animated, StyleSheet, Dimensions, ScrollView } from 'react-native'
import ImagesUser from './ImagesUser';
import { whileStatement } from '@babel/types';
const { width } = Dimensions.get('window');
import colorTheme from '../config/theme.style'
import { noAthorized } from '../../components/Utils'
//import all the components we are going to use.

const images = [
    'https://uploads.metropoles.com/wp-content/uploads/2019/07/16170446/outback.jpg',
]

export default class TimelineAds extends React.Component {
    constructor(props) {
        super(props)
        noAthorized(props)
      }
     page = 0
     state = {
         page: 0
     }
    render() {
        return (
            <TouchableOpacity style={styles.container}>
                <View style={{ width: '100%', height: 30, alignItems: 'center', justifyContent: 'flex-end' }}>
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
                    <View style={styles.imageContent} >
                      <ImagesUser images={images}  index={this.state.page}/>
                    </View>
                    <View style={styles.info}>
                      <Text style={styles.title} ellipsizeMode='tail' numberOfLines={1}>50% de desconto no Outback Norte Shopping</Text>
                      <Text style={styles.description} ellipsizeMode='tail' numberOfLines={2}>Das 17h às 20h, de segunda à sexta, ganhe 50% de desconto em pratos principais selecionados. Promoção válida até 31/12/2019 ou enquanto durarem os estoques.</Text>
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
        marginBottom:30

    },

    imageContent: {
        flex: 1,
        width: '100%',
        height: "100%",
        position: 'absolute'

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
