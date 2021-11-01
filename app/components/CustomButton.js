// Home screen
import React, { Component } from 'react';
//import react in our code.
import { Text, StyleSheet, View } from 'react-native';
import colorTheme from '../config/theme.style'

export default class CustomButton extends Component {
  render() {
    return (
      <View style={[styles.button, {backgroundColor: colorTheme[`${this.props.color ? this.props.color : 'PRIMARY_COLOR'}`]}]}>
        <Text style={styles.buttonText}>{this.props.text}</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    padding: 12,
    textAlign:'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
  },
});
