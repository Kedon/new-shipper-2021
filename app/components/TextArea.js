// Setting screen
import React, { Component } from 'react';

//import react in our code.
import { Text, TextInput, View, Dimensions, Platform } from 'react-native';
import { StyleSheet } from 'react-native'
//import all the components we are going to use.
const { width } = Dimensions.get('window');
import colorTheme from '../config/theme.style'

export default class TextArea extends Component {
    render() {
      const {textAreaId} = this.props;
        return (
          <View style={styles.rowContainer}>
            <Text style={styles.text}>{this.props.label}</Text>
            <View style={styles.textInput} >
              <TextInput
                placeholder={this.props.placeholder}
                onChangeText={(text) => {
                  this.props.onChange(textAreaId, text)
                }}
                keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                textInputProps={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                multiline
                numberOfLines={4}
                style={styles.textInput}
                value={this.props.value}
              />
            </View>
          </View>
        );
    }
}


const styles = {
  rowContainer: {
    //flex: 1,
    width: width,
    //flex: 1,
    fontSize: 18,
    lineHeight: 23,
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#D8D8D8',
    paddingLeft: 10,
    backgroundColor: '#FDFDFD',

    //flex: 1,

  },
  label: {
    color: colorTheme.DARK_COLOR
  },
  text: {
    fontSize: 16,
    textAlign: 'left'
  },
  textInput: {
    height: 70,
    marginTop: 3,
    lineHeight: 19,
    backgroundColor: 'transparent',
    color: colorTheme.TEXT_MUTED
  },
  inputContainer: {
    borderBottomWidth:0,
  },
  input: {
    fontSize: 15,
    color: colorTheme.TEXT_MUTED
  }
};
