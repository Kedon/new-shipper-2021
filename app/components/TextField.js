// Setting screen
import React, { Component } from 'react';
import { TextInput, Platform } from 'react-native';
//import react in our code.
import { Text, View, Dimensions } from 'react-native';
import { StyleSheet } from 'react-native'
//import all the components we are going to use.
const { width } = Dimensions.get('window');
import colorTheme from '../config/theme.style'


export default class TextField extends Component {

    render() {
      const {textFieldId} = this.props;
        return (
          <View style={styles.rowContainer}>
            <Text style={styles.text}>{this.props.label}</Text>
            <View style={styles.textInput} >
              <TextInput
              onChangeText={(text) => {
                this.props.onChange(textFieldId, text)
              }}
              keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
              inputContainerStyle={styles.inputContainer}
              placeholder={this.props.placeholder}
              style={styles.input}
              defaultValue={this.props.value}/>
            </View>
          </View>
        );
    }
}


const styles = {
  rowContainer: {
    //flex: 1,
    width: width,
    flexDirection: "row",
    //display: 'flex',
    //justifyContent: "space-between",
    alignItems: "center",
    //flex: 1,
    fontSize: 18,
    lineHeight: 23,
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#D8D8D8',
    paddingLeft: 10,
    backgroundColor: '#FDFDFD',

    //flex: 1,

  },
  text: {
    //flex: 1
    //width: '50%'
    fontSize: 16,
    color: colorTheme.DARK_COLOR
  },
  textInput: {
    alignSelf: 'flex-start',
    flexGrow: 1

  },
  inputContainer: {
    borderBottomWidth:0,
  },
  input: {
    textAlign: 'right',
    backgroundColor: 'transparent',
    marginBottom: -3,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,

    color: colorTheme.TEXT_MUTED,
    fontSize: 15,
  }
};
