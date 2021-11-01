// Home screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, ScrollView, RefreshControl, SafeAreaView, StyleSheet, StatusBar, FlatList, Dimensions, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

//import all the components we are going to use.
const { width } = Dimensions.get('window');
const height = width * 1;
const screenHeight = Dimensions.get('window').height;
class Browser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      status: '',
      url: props.navigation.state.params.url,
    }
  }

  render() {
    const { loading, url } = this.state;
    //const { user } = this.props;

    //const { fields, loading } = this.state;
    //if(!loading) {
      return (
          <SafeAreaView style={styles.container}>
            <WebView
                  source={{ uri: url }}
                  startInLoadingState={true}
                  renderLoading={() => <View style={{flex: 1,}}><ActivityIndicator></ActivityIndicator></View>}
              />
          </SafeAreaView>
      );
    /*} else {
      return <ActivityIndicator />
    }*/

  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
});



export default (Browser);
