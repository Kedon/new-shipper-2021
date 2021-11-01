// Home screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, ScrollView, SafeAreaView, Modal, StyleSheet, StatusBar, Image, Dimensions, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import { Divider } from 'react-native-elements';
import  CustomButton  from './CustomButton';
import  CustomModal  from './CustomModal';
import colorTheme from '../config/theme.style'
import { Avatar } from 'react-native-elements';
import ImagesUser from './ImagesUser';
import { onSignIn, isSignedIn } from '../config/auth'
import api from '../screens/profile/services'
import moment from "moment";
import { noAthorized } from './../components/Utils'
const images = [
    'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AAHAltE.img?h=0&w=720&m=6&q=60&u=t&o=f&l=f&x=556&y=238',
    'https://s-media-cache-ak0.pinimg.com/originals/40/4f/83/404f83e93175630e77bc29b3fe727cbe.jpg',
    'https://s-media-cache-ak0.pinimg.com/originals/8d/1a/da/8d1adab145a2d606c85e339873b9bb0e.jpg',
]
//import all the components we are going to use.
const { width } = Dimensions.get('window');
const height = width * 1;
const screenHeight = Dimensions.get('window').height;
class UserDetailsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      loading: true,
      details: [],
      page: 0,
      userInfo: {
        coverPhoto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS34bSHEn2hxEkG-AtbYUfFlb5kFE3cWWGHcRMVCx8_c23Icx_R',
        userName: 'Leona',
        userBirthday: '1983-03-29',
        userAge: '25',
        userCity: 'Rio de Janeiro',
        userState: 'RJ',
        genre: 'f',
        occupation: 'Analista de Sistemas',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi venenatis metus sit amet sem tempor luctus. Ut blandit tempor ultricies. In augue sem, pharetra lobortis leo a, semper elementum purus. In ultricies nulla a dictum sollicitudin. Etiam euismod elit neque, quis fermentum magna iaculis et. Sed a ex lectus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent nec est a quam elementum pharetra vitae quis turpis. Curabitur ullamcorper purus neque, non pulvinar nisi congue at. Fusce pretium augue non tempor lobortis. Nam dignissim nulla id bibendum scelerisque. Vestibulum pharetra suscipit mi eget interdum. Etiam hendrerit ante eget tincidunt malesuada.'
      },
      medRating: {
        preRating: {
           votes: 3,
           medScore: 4.7
        },
        posRating: {
          votes: 7,
          medScore: 4.3
        }
      },

    }
  }
  showModal(title, description){
    this.refs.modal.open(title, description);
  }


  open(userId) {
    this.setState({ modalVisible: true });
    console.warn(userId);
    this.userDetails(userId);
  };

  close() {
    this.setState({ modalVisible: false })
  };
  nextImage = (page)=> {
      this.setState({
          page:  this.state.page < images.length-1 ?  this.state.page +1 : 0
      })
  }
  prevImage = ()=> {
      this.setState({
          page: this.state.page === 0  ?  images.length-1 : this.state.page -1
      })
  }

  userDetails = async (userId) => {
      isSignedIn().then((token) => {
        api.userDetails(JSON.parse(token), userId)
            .then( (res) => {
                console.warn(res.data[0].data)
                this.setState({
                  loading: false,
                  details: res.data[0].data,
                }, () => {})
            })
            .catch(err => console.warn(JSON.stringify(err)))
        }
      );
  }


  render() {
    const {onPress = () => {}, partners, userInfo, matchInfo} = this.props
    const {loading, details, page} = this.state
    let titlePreMatch = ''
    let descPreMatch = ''
    let titlePosMatch = ''
    let descPosMatch = ''
    if(!loading){
      titlePreMatch =  details.medRating.preRating.medScore > 0 ? `O perfil de ${details.firstName.split(' ')[0].replace(' ', '')} tem uma média de ${details.medRating.preRating.medScore.toFixed(1)} de nota de pré-match` : 'Notas de pré-match';
      descPreMatch = details.medRating.preRating.medScore > 0 ? `Antes de fazer a combinação (match), os usuários podem votar nos perfis de outros usuários. Essa é a nota de pré-match e o perfil de ${details.firstName.split(' ')[0].replace(' ', '')} recebeu uma média de ${details.medRating.preRating.medScore.toFixed(1)}.` : `Antes de fazer a combinação (match), os usuários podem votar nos perfis de outros usuários. Essa é a nota de pré-match e o perfil de ${details.firstName.split(' ')[0].replace(' ', '')} ainda não recebeu uma nota.`;
      details.firstName.split(' ')[0].replace(' ', '') + ' tem uma média de ' + this.state.medRating.posRating.medScore.toFixed(1) + ' de nota de pós-match',
      'Depois da combinação (match), os usuários podem dar uma nota de pós-match avaliando como foi o match. ' + this.state.userInfo.userName + ' recebeu uma média de ' + this.state.medRating.posRating.medScore.toFixed(1) + '.'

      titlePosMatch =  details.medRating.posRating.medScore > 0 ? `${details.firstName.split(' ')[0].replace(' ', '')} tem uma média de ${details.medRating.posRating.medScore.toFixed(1)} de nota de pos-match` : 'Notas de pós-match';
      descPosMatch = details.medRating.posRating.medScore > 0 ? `Depois da combinação (match), os usuários podem dar uma nota de pós-match, avaliando como foi o match. ${details.firstName.split(' ')[0].replace(' ', '')} recebeu uma média de ${details.medRating.posRating.medScore.toFixed(1)}.` : `Depois da combinação (match), os usuários podem dar uma nota de pós-match avaliando como foi o match. Essa é a nota de pós-match e o perfil de ${details.firstName.split(' ')[0].replace(' ', '')} ainda não recebeu uma nota.`;

    }
      return (
        <SafeAreaView>
          <Modal
            style={{marginTop: 22,height: screenHeight}}
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}>
            {(!loading) &&
                <View style={styles.modalComponent}>
                  <View style={styles.topBar}></View>
                  <ScrollView style={{paddingBottom: 50, flexGrow: 1}}>
                    <View style={styles.content}>
                      <View style={styles.slider}>
                        <ImagesUser images={details.photos} radius={0} spacing={0} bullets={'bottom'} index={page}/>
                      </View>
                      <TouchableOpacity style={styles.close} onPress={() => {
                          this.close();
                        }}>
                        <Image style={{ height: 10, width: 18, tintColor: '#FFF'}} source={require('../assets/images/icons/downIcon.png')}/>
                      </TouchableOpacity>

                      <View style={styles.userInfo}>
                        <View style={styles.presentation}>
                          <View>
                            <Text style={styles.userDesc}>{details.firstName.split(' ')[0].replace(' ', '')}, {(details.birthDate) ? moment().diff(details.birthDate, 'years') : ''}</Text>
                            <View style={styles.userDistance}>
                              <Image style={styles.navIcon, { width: 10, height: 12, tintColor: colorTheme.TEXT_MUTED, marginRight: 5 }} source={require('../assets/images/icons/pin.png')} />
                              <Text style={styles.userLocation}>{details.location[0].distance.toFixed(2)} Km | {details.location[0].city}/{details.location[0].state}</Text>
                            </View>
                          </View>
                        </View>
                        <Divider style={styles.divider} />

                        <View style={styles.details}>
                          <Text style={styles.title}>Gênero: </Text>
                          <Text style={styles.text}>{details.genre == 'MALE' ? 'Masculino' : 'Feminino'}</Text>
                        </View>
                        {(details.occupation) &&
                          <View style={styles.details}>
                            <Text style={styles.title}>Ocupação: </Text>
                            <Text style={styles.text}>{details.occupation}</Text>
                            <Divider style={styles.divider} />
                          </View>
                        }
                        {(details.hobbies != null && details.hobbies.length > 0) &&
                          <View style={styles.details}>
                          <Text style={styles.title}>Hobbies: </Text>
                          {details.hobbies.map((hobbie, index) =>
                            <View>
                              <Text key={hobbie.hobbieId} style={styles.text}>{hobbie.hobbieName}{(index + 1) < details.hobbies.length ? ', ': ''} </Text>
                            </View>
                          )}
                            <Divider style={styles.divider} />
                          </View>
                        }
                        {(details.description) &&
                          <View>
                            <Text style={styles.description}>{details.description}</Text>
                            <Divider style={styles.divider} />
                          </View>
                        }
                      </View>
                    </View>
                  </ScrollView>
                </View>
              }
              {(loading) &&
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 25, paddingRight: 25 }}>
                  <ActivityIndicator />
                </View>

              }

                <CustomModal ref="modal" />

        </Modal>

      </SafeAreaView>
      );
  }
}


const styles = StyleSheet.create({
  topBar: {
    width: '100%',
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 99999
  },
  content: {
      flex: 1,
      width: '100%',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      borderRadius: 10,
      backgroundColor: '#FFF',
  },
  slider: {
      flex: 1,
      width: '100%',
      height: screenHeight * .7,
  },
  imageContent: {
      flex: 1,
      width: '100%',
      height: '100%',
      position: 'absolute'

  },
  imageNav: {
      flex: 1,
      width: '100%',
      height: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      bottom: 0,

  },
  navIcon: {
  },
  nextImage: {
    position: 'relative',
    width: '50%',
    paddingRight: 25,
    height: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  prevImage: {
    position: 'relative',
    width: '50%',
    height: '100%',
    paddingLeft: 25,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  indicator: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      flexDirection: 'row',
      height: 25,
      bottom: 0,
      position: 'absolute',
      zIndex: -1
  },
  close: {
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colorTheme.PRIMARY_COLOR,
      top: (screenHeight * .7),
      marginTop: - 25,
      right: 10,
      zIndex: 99999
  },

  bullet: {
      width: 10,
      height: 10,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: "#fff",
      opacity: 0.7,
      marginLeft:3,
      marginRight: 3
  },
  bulletActive: {
      backgroundColor: '#fff'
  },
  modalComponent: {
    height: 'auto',
    flex: 1,
    flexDirection: 'column',
    width: width,
    justifyContent: 'center',
  },
  userInfo: {
    padding: 20,
  },
  userDesc: {
    fontSize: 30,
    fontWeight: 'bold',
    width: width - 50,
  },
  userLocation: {
    fontSize: 15,
    fontWeight: '400',
    maxWidth: width,
    marginRight: 10,
    color: colorTheme.TEXT_MUTED,
  },
details: {
  flexDirection: 'row',
  marginTop: 3,
  marginBottom: 3
},
title: {
  fontWeight: '700'
},
description: {
  lineHeight: 22,
  fontSize: 15
},
divider: {
  backgroundColor: colorTheme.TEXT_MUTED,
  marginTop: 15,
  marginBottom: 15,
  marginRight: -20,
  marginLeft: -20
},
userDistance: {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
},
presentation: {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 3,
  marginTop: 0,
},
scores: {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
},
textCenter: {
  marginLeft: 10
},
label: {
    color: '#A6AEBC',
    fontSize: 10,
    textAlign: 'center',
},
indicator: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 25,
},
text: {
    color: '#555',
    fontSize: 16,
    marginRight: 4,
    fontWeight: '600',
    textAlign: 'center',
},


});

//export default withNavigation(MatchPopup);
export default UserDetailsModal;
