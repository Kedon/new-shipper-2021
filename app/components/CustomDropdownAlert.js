
import React, { useState, Component } from 'react'
import { Animated, Button, StyleSheet, View, Text, Platform, Image } from 'react-native';

// import alertSign from '../../assets/icons/home/alert-sign.png'

function CustomDropdownAlert2({ open = 0, onClose = () => { }, text = '' }) {

    const [redSquareAnim] = useState(new Animated.Value(0))
    const [yellowSquareAnim] = useState(new Animated.Value(0))
    const [blueSquareAnim] = useState(new Animated.Value(0))
    const showAlert = open

    const slideUp = {
        transform: [
            {
                translateY: redSquareAnim.interpolate({
                    inputRange: [0.01, 1],
                    outputRange: [-100, 0],
                    extrapolate: "clamp",
                }),
            },
        ],
    };
    function showDownAlert(isToShow) {
        Animated.timing(redSquareAnim, {
            toValue: isToShow,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }
    // const onPressTiming = () => {
    //   Animated.timing(redSquareAnim, {toValue: 200, duration: 1000}).start()
    // }

    if (showAlert) {
        showDownAlert(showAlert)
        setTimeout(() => {
            onClose()
            showDownAlert(0)

        }, 3000)
    }

    return (<Animated.View style={[{
        backgroundColor: 'rgba(217, 12, 12, 0.9)',
        height: Platform.select({ ios: 90, android: 50 }),
        width: '100%',
        zIndex: 99999,
        top: 0,
        position: 'absolute',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        flexDirection: 'row',

        paddingTop: Platform.OS === 'android' ? 0 : 20,
        //iOS stuff
        shadowOffset: { width: 0, height: 2, },
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 1,
        shadowRadius: 4,
        marginTop: 0
    }, slideUp]}>
        {/* <Image source={alertSign} /> */}
        <Text style={styles.text}>{text}</Text>
        <Text style={styles.space}></Text>
    </Animated.View>)

}


export default class CustomDropdownAlert extends Component {
    constructor(props) {
        super(props)
        this.state = {
            animation: new Animated.Value(-100),
            actualPageSize: 350
        }
    }

    showDownAlert(isToShow) {

        // this.state.animation.setValue(initialValue);
        Animated.timing(     //Step 4
            this.state.animation,
            {
                toValue: isToShow ? Platform.select({ ios: 0, android: 0 }) : -100,
                // duration: 500,
                // useNativeDriver: true,
            }
        ).start();  //Step 5
    }
    render() {
        const { open = 0, onClose = () => { }, text = '' } = this.props
        const showAlert = open;

        if (showAlert) {
            this.showDownAlert(open)
            setTimeout(() => {
                // onClose()
                this.showDownAlert(0)
                onClose()
            }, 3000)
        }

        return (
            <Animated.View style={[{
                backgroundColor: 'rgba(217, 12, 12, 0.9)',
                height: Platform.select({ ios: 90, android: 50 }),
                width: '100%',
                zIndex: 99999,
                top: 0,
                position: 'absolute',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 20,
                flexDirection: 'row',
                overflow: 'hidden',

                paddingTop: Platform.OS === 'android' ? 0 : 20,
                //iOS stuff
                shadowOffset: { width: 0, height: 2, },
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowOpacity: 1,
                shadowRadius: 4,
                marginTop: 0
            },  { marginTop: this.state.animation }]}>
                <Text style={styles.text}>{text}</Text>
                <Text style={styles.space}></Text>
            </Animated.View >
            )
    }
}



const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        marginVertical: 100
    },
    itemContainer: {
        flex: 1,
        alignItems: 'center'
    },
    text: {
        fontSize: 14,
        marginLeft: 10,
        color: '#ffffff'
    },
    space: {
        width: 40
    }
})