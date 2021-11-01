// Setting screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, Image, SafeAreaView, StyleSheet, TouchableOpacity, StatusBar, Button } from 'react-native';
import { onSignOut, isSignedIn } from '../../config/auth'


//import all the components we are going to use.

class PageOne extends React.Component {
    logOut = () => {
        const { navigation } = this.props
        onSignOut().then(data => {
          const { navigation } = this.props;
          navigation.navigate('LoginPage', { data: {} })
        })
      }
    render() {
        const {route, navigation} = this.props
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Logged One</Text>
                <Text>{JSON.stringify(this.props)}</Text>
                <Button
                title="Logout"
                onPress={this.logOut}
                />
                <Button
                title="Go to Details"
                onPress={() => navigation.navigate('DetailsLogged', {
                    itemId: 86,
                    otherParam: 'anything you want here',
                  })}
                />
            </View>
        );
    }
}
export default (PageOne);