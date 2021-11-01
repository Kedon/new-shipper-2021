// Home screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, ScrollView, Modal, StyleSheet, StatusBar, Image, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import  CustomButton  from './CustomButton';
import { Avatar } from 'react-native-elements';


//import all the components we are going to use.
const { width } = Dimensions.get('window');
const height = width * 1;
const screenHeight = Dimensions.get('window').height;
class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      title: '',
      description: ''
    }
  }
  open(title, description) {
    this.setState(
      {
        modalVisible: true,
        title: title,
        description: description
      })
  };

  close() {
    this.setState({ modalVisible: false })
  };

  render() {
    const {onPress = () => {}, partners, userInfo, matchInfo} = this.props
    return (
      <View>
        <Modal
          style={{marginTop: 22}}
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}>
          <View style={styles.modalContainer}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.modalComponent}>
              <View style={styles.modalItem}>
                  <View>
                    { (this.state.title) ? (<Text style={styles.modalTitle}>{this.state.title}</Text>) : null }
                    { (this.state.description) ? (<Text style={styles.modalParagraph}>{this.state.description}</Text>) : null }
                  </View>
                  <TouchableOpacity onPress={() => {
                      this.close();
                    }}>
                    <CustomButton  text={'Fechar'}></CustomButton>
                  </TouchableOpacity>

                <View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
    );
  }
}


const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: Platform.OS === 'ios' ? '#00000066' : 'rgba(0,0,0,0.45)',
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalComponent: {
    height: 'auto',
    flex: 1,
    flexDirection: 'column',
    width: width - 50,
    marginRight: 10,
    marginLeft: 10,
    justifyContent: 'center',
  },
  modalItem: {
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    padding: 15
  },
  modalTitle: {
    fontSize: 23,
    lineHeight: 27,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontWeight: '600',
  },
  modalParagraph: {
    fontSize: 18,
    lineHeight: 23,
    marginBottom: 10,
    textAlign: 'center',
  },
  closeButton: {
    color: '#FFF',
    marginTop: 20,
    textAlign: 'center'
  },

});

//export default withNavigation(MatchPopup);
export default CustomModal;
