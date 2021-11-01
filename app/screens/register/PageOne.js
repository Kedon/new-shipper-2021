// Setting screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, Image, SafeAreaView, StyleSheet, TouchableOpacity, StatusBar, Button } from 'react-native';

//import all the components we are going to use.

class PageOne extends React.Component {
    render() {
        const {route, navigation} = this.props
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Home Screen</Text>
                <Text>{JSON.stringify(this.props)}</Text>
                <Button
                title="Go to Details"
                onPress={() => navigation.navigate('Details', {
                    itemId: 86,
                    otherParam: 'anything you want here',
                  })}
                />
            </View>
        );
    }
}
export default (PageOne);