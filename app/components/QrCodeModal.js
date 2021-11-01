import React, { Component } from "react";
import {
  View,
  WebView,
  Modal,
  Text,
  Linking,
  Dimensions,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
} from "react-native";

import QRCodeScanner from "react-native-qrcode-scanner";
const screenHeight = Dimensions.get('window').height;
const { width } = Dimensions.get('window');

class QrCodeModal extends Component {

  state = {
    success: null,
  };

  openLink = () => {
    Linking.openURL(this.state.url).catch(err =>
      alert("An error occured", err)
    );
    this.setState({ success: false })
    alert('sucess')
  };

  handleButton = () => {
    //this.setState({ modalVisible: !this.state.modalVisible, success: false })
    //this.scanner.reactivate()
  }

  onSuccess = async (e) => {
    const {  onPressClose, navigation } = this. props;
    navigation.navigate('CheckinPartner', {companyId: e.data, autoCheckin: true })
    onPressClose(false)

  };

  /*open() {
    this.setState({ modalVisible: true });
  };
  close() {
    this.setState({ modalVisible: false })
  };*/

  close = () => {
    const {  onPressClose } = this. props;
    /**
     * Callback function send data to father
     */
    onPressClose(false)
  };


  render() {
    const { modalQrCodeVisible } = this.props;
    return (
      <View style={styles.container}>
      <Modal
        style={{marginTop: 22,height: screenHeight}}
        animationType="slide"
        transparent={false}
        visible={modalQrCodeVisible}>
        <SafeAreaView>
          <View style={styles.header}>
            <TouchableOpacity onPress={this.close} style={styles.backButton}>
              <Image style={{ height: 18, width: 10}} source={require('../assets/images/icons/backIcon.png')}/>
            </TouchableOpacity>
            <Text style={styles.title}>
              Check-in com QrCode
            </Text>
          </View>
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
        </SafeAreaView>
         </Modal>
      </View>
    );
  }
}

export default (QrCodeModal);

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
  },
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    borderBottomWidth: 1,
    borderBottomColor: '#e9e9e9',
    paddingTop: 3,
    paddingRight: 10,
    paddingBottom: 3,
    paddingLeft: 10,
  },
  backButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    width: width - 90,
    textAlign: 'center',
    paddingBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },



});
