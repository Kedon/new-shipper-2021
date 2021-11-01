// Home screen
import React, { Component } from 'react';
//import react in our code.
import {TextInput, Image, View, StyleSheet } from 'react-native';
import colorTheme from '../config/theme.style'

//import all the components we are going to use.
export default class searchInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: null,
    };

    this.arrayholder = [];
  }

  searchFilterFunction = text => {
    this.setState({
      value: text,
    });
    this.props.onChangeText(text);
  };
  render() {
    return (
            <View style={styles.searchContainer}>
              <View style={styles.searchInput}>
                <View style={styles.search}>
                  <TextInput
                    style={styles.searchbox}
                    placeholder={this.props.placeholder}
                    onChangeText={text => this.searchFilterFunction(text)}
                    autoCorrect={false}
                    value={this.state.value}
                  />
                  <Image source={require('../assets/images/icons/search.png')} style={styles.searchPic, { width: 17.5, height: 17.5 }}/>
                </View>
              </View>
            </View>
    );
  }
}


const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    padding: 10,
  },
  searchInput: {
    flexGrow: 1
  },
  searchIcon: {
    paddingLeft: 10,
  },
  search: {
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    //borderColor: '#d9d9d9',
    //borderWidth: 1,
    padding: 10,
    borderRadius: 5
  },
  searchbox: {
    flexGrow: 1,
    margin: 0,
    padding: 0
  },

  searchPic: {
    flexGrow: 1,
    width: 20,
    height: 20
  }
});
