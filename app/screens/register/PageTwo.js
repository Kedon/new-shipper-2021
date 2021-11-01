// Setting screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, Image, SafeAreaView, StyleSheet, TouchableOpacity, StatusBar, Button } from 'react-native';
//import all the components we are going to use.

class PageTwo extends React.Component {
    render() {
        const {navigation, route } = this.props
        const { itemId, otherParam } = route.params;

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Details Screen</Text>
            <Text>{JSON.stringify(this.props)}</Text>
            <Text>itemId: {JSON.stringify(itemId)}</Text>
                <Text>otherParam: {JSON.stringify(otherParam)}</Text>

            <Button
              title="Go to Details... again"
              onPress={() => navigation.push('Details', {
                itemId: Math.floor(Math.random() * 100),
              })}
            />
            <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
            <Button title="Go back" onPress={() => navigation.goBack()} />
            <Button
              title="Go back to first screen in stack"
              onPress={() => navigation.popToTop()}
            />
       
       
          </View>
        );
    }
}
export default (PageTwo);