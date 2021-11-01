import React, { Component } from "react";
import {
  View,
  WebView,
  Text,
  Linking,
  Dimensions,
  StyleSheet,
} from "react-native";

import QRCodeScanner from "react-native-qrcode-scanner";
import ModalWebView from '../../components/ModalWebView'
import { noAthorized } from '../../components/Utils'
export default class CheckinQrCode extends Component {
  constructor(props) {
    super(props)
    noAthorized(props)
  }
  state = {
    modalVisible: false,
    success: null,
    url: '',
  };

  openLink = () => {
    Linking.openURL(this.state.url).catch(err =>
      alert("An error occured", err)
    );
    this.setState({ success: false })
  };

  handleButton = () => {
    this.setState({ modalVisible: !this.state.modalVisible, success: false })
    this.scanner.reactivate()
  }

  onSuccess = async (e) => {
    await this.setState({ success: true, modalVisible: true, url: e.data });
  };

  render() {
    return (
      <View style={styles.container}>
        <QRCodeScanner
          onRead={this.onSuccess}
          showMarker={true}
          checkAndroid6Permissions={true}
          ref={(elem) => { this.scanner = elem }}
          cameraStyle={styles.cameraContainer}
          bottomContent={
            <View style={styles.touchable}>
              {this.state.success && (
                <Text style={styles.text}>OK. Got it!</Text>
              )}
            </View>
          }
        />

         <ModalWebView
            handleButton={this.handleButton}
            modalVisible={this.state.modalVisible}
            url={this.state.url}
            openLink={this.openLink}
         />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "black"
  },

  touchable: {
    padding: 16
  },

  text: {
    fontSize: 21,
    color: "rgb(0,122,255)"
  },

  cameraContainer: {
    height: Dimensions.get('window').height,
  }

});
