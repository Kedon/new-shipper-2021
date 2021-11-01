import React, { Component } from 'react';
import {Platform,  View, StyleSheet, Animated, Dimensions, Button, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icons from '../config/Icons'


export default class CustomModalComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            animation: new Animated.Value(0),
        }
        this.styles = StyleSheet.create({
            cover: {
                backgroundColor: "rgba(0,0,0,.5)",
                flex: 1,
            },
            sheet: {
                position: "absolute",
                top: Dimensions.get("window").height,
                left: 0,
                right: 0,
                flex: 1,
                height: "100%",
                justifyContent: this.switchPosition(props.position),
                alignItems: "center",
            },
            popup: {
                backgroundColor: "#FFF",
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                borderBottomLeftRadius: props.position === 'center' ? 15 : 0,
                borderBottomRightRadius: props.position === 'center' ? 15 : 0,
                minHeight: this.props.fullHeight ? '90%' : this.props.height,
                maxHeight: '100%',
                padding: 20,
                width: this.props.fullWidth ? '100%' : '80%'
            },
            bcontainer: {
                // flexDirection: 'row',
                // alignItems: 'center',
                // justifyContent: 'center',
                paddingLeft: 20,
                paddingRight: 20,
                marginBottom: 10,
                margin: 10
            },
        });
    }

    switchPosition = (pos) => {
        let position = pos.toUpperCase()
        switch (position) {
            case 'CENTER': return "center";
            case 'TOP': return "flex-start";
            case 'BOTTOM': return "flex-end";
            default: return "flex-end";
        }
    }
    handleClose = () => {
        Animated.timing(this.state.animation, {
            toValue: 0,
            duration: 200,
            useNativeDriver: Platform.OS === 'ios' ? true : false
        }).start();
    };
    render() {
        const { open, onPressClose, showCloseButton = true } = this.props

        const screenHeight = Dimensions.get("window").height;
        const backdrop = {
            transform: [
                {
                    translateY: this.state.animation.interpolate({
                        inputRange: [0, 0.01],
                        outputRange: [screenHeight, 0],
                        extrapolate: "clamp",
                    }),
                },
            ],
            opacity: this.state.animation.interpolate({
                inputRange: [0.01, 0.5],
                outputRange: [0, 1],
                extrapolate: "clamp",
            }),
        };

        const slideUp = {
            transform: [
                {
                    translateY: this.state.animation.interpolate({
                        inputRange: [0.01, 1],
                        outputRange: [0, -1 * screenHeight],
                        extrapolate: "clamp",
                    }),
                },
            ],
        };
        Animated.timing(this.state.animation, {
            toValue: open,
            duration: 200,
            useNativeDriver:  Platform.OS === 'ios' ? true : false
        }).start();
        return (
            <Animated.View style={[StyleSheet.absoluteFill, this.styles.cover, backdrop]}>
                <View style={[this.styles.sheet]}>

                    <Animated.View style={[this.styles.popup, slideUp]}>
                        {showCloseButton ? <View>
                            <TouchableOpacity onPress={onPressClose} style={{ marginRight: 0, marginBottom: 0, alignItems: 'flex-end' }}>
                                <Image source={Icons.close} style={{ resizeMode: 'contain', width: 18, height: 18, tintColor: '#F52C56' }} />
                            </TouchableOpacity>
                        </View>: null}


                        <View style={{flex: 1}}>
                            {this.props.children}
                            {/* <View style={this.styles.buttonContainer}>
                                <Button type="outline" title="Cancelar" onPress={onPressClose} buttonStyle={{ borderRadius: 25 }} />
                            </View>
                            <View style={this.styles.buttonContainer}>
                                <Button title={"Próximo"} />
                            </View> */}
                        </View>

                        {/* <Scroller /> */}
                    </Animated.View>
                </View>
            </Animated.View>
        );
    }
}