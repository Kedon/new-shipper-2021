// Home screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, ScrollView, Modal, StyleSheet, StatusBar, Image, Dimensions, TouchableOpacity } from 'react-native';
import  CustomButton  from './CustomButton';
import colorTheme from '../config/theme.style'
import { Avatar } from 'react-native-elements';
import { onSignIn, isSignedIn } from './../config/auth'
import moment from "moment";
import { connect } from 'react-redux';
import { BlurView, VibrancyView } from "@react-native-community/blur";

import api from './services';

//import all the components we are going to use.
const { width } = Dimensions.get('window');
const height = width * 1;
const screenHeight = Dimensions.get('window').height;
class Packages extends Component {
  constructor(props) {
    super(props);
    this.refs = {};
    this.state = {
      loading: true,
      packages: [],
      // modalVisible: false,
    }
  }

  componentDidMount(){
    this.packages()
  }

  packages = async () => {
      //const { navigation } = this.props;
      isSignedIn().then((token) => {
        this.setState({loading: true})
        api.packages(JSON.parse(token))
            .then(res => {
              this.setState({packages: res.data})
            })
            .catch(err => console.warn(JSON.stringify(err)))
        }
      );
  }

//   open() {
//    this.setState({ modalVisible: true })
//  };

  close = () => {
   const {  onPressClose } = this. props;
   /**
    * Callback function send data to father
    */
   onPressClose(false)
 };

 buyPackage = (pakackage) => {
  const {  navigation } = this. props;
  navigation.navigate('Payment', { package: pakackage })
  this.close();
};

  render() {
    const { modalVisible, onPressClose, user } = this.props;
    const { packages } = this.state;

    return (
      <View>
        <Modal
          style={{marginTop: 22}}
          animationType="slide"
          hardwareAccelerated={true}
          visible={modalVisible}
          transparent>
          <View
              style={styles.modalContainer}
            >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ScrollView
                horizontal={true}
                decelerationRate={0}
                snapToInterval={width - 20}
                snapToAlignment={"center"}
                showsHorizontalScrollIndicator={false}>
                {packages.map((pakackage, index) =>
                  <View key={index} style={styles.modalComponent}>
                    <View key={index} style={styles.modalItem}>
                      <Text style={styles.modalTitle}>{pakackage.title}</Text>
                      <View style={styles.list}>
                      {pakackage.advantages.map((advantages, i) =>
                        <View style={styles.itemList} key={i}>
                          <View style={styles.avatar}>
                            <Avatar
                              size={29}
                              avatarStyle={styles.avatarStyle}
                              overlayContainerStyle={{backgroundColor: 'white'}}
                              title="MT"
                              source={advantages.icon && { uri: advantages.icon }}
                              activeOpacity={0.7}
                              />
                            </View>
                            <View style={styles.subtitleView,{width: width - 140, marginLeft: 25}}>
                              <Text style={styles.title}>{advantages.title}</Text>
                              <Text style={styles.subtitle}>{advantages.descripton}</Text>
                            </View>
                        </View>
                        
                      )}
                      </View>
                      <View>
                        {(user && user.packages && user.packages.level > 1) ?
                            (user && user.packages && user.packages.level == pakackage.level) ?
                              <View style={styles.button}>
                                <CustomButton  text={`Esté é seu plano até ${moment(user.packages.end).format('DD/MM')}`}></CustomButton>
                              </View>
                            :
                            <Text style={styles.subtitle}>Após término do seu plano atual, você pode alterar para este.</Text>
                          :
                          <TouchableOpacity onPress={() => this.buyPackage(pakackage)}>
                            <CustomButton  text={'Apenas R$ '+pakackage.price.toFixed(2).replace('.', ',')+'/mês'}></CustomButton>
                          </TouchableOpacity>


                        }
                      </View>
                    </View>
                    <TouchableOpacity onPress={this.close}>
                      <Text style={styles.closeButton}>Fechar</Text>
                    </TouchableOpacity>

                  </View>

                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  image: {
    width: 30,
    height: 23
  },
  modalContainer: {
    backgroundColor: Platform.OS === 'ios' ? '#00000066' : 'rgba(0,0,0,0.5)',
    position: 'absolute',
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
    padding: 15,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 16,
    color: colorTheme.PRIMARY_COLOR,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
    fontWeight: '600',
  },
  modalParagraph: {
    fontSize: 13,
    lineHeight: 20,
    color: colorTheme.TEXT_MUTED
  },
  modalSpaceBottom: {
    marginBottom: 10,
  },
  modalSpaceTop: {
    marginTop: 10,
  },
  list: {
    borderTopWidth: 1,
    borderTopColor: '#f4f4f4',
    marginRight: -15,
    marginLeft: -15,
    marginBottom: 15,
  },
  itemList: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.01)',
    borderColor: '#000',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f4'
  },
  title: {
    fontWeight: '400',
    fontSize: 14,
    color: colorTheme.DARK_COLOR
  },
  subtitle: {
    fontWeight: '400',
    fontSize: 12,
    color: colorTheme.TEXT_MUTED
  },

  avatarContainer: {
    width: 30,
    height: 30,

  },
  avatarStyle: {
    /*backgroundColor: '#F60',
    width: 30,
    height: 23,*/
  },
  closeButton: {
    color: '#FFF',
    marginTop: 20,
    textAlign: 'center'
  }
});

/** Redux */
const mapStateToProps = state => {
  return {
    user: state.userData.user,
  };
};


export default (connect(
  mapStateToProps,
)(Packages));
