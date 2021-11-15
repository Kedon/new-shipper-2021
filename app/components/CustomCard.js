// Setting screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, Image, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Animated, StyleSheet, Dimensions, ScrollView } from 'react-native'
import ImageCarousel from './imageCarousel';
import FastImage, { FastImageProps } from 'react-native-fast-image'
import  Packages  from './Packages';
import  CustomModal  from './CustomModal';
import Carousel from './Carousel';
import  UserDetailsModal  from './UserDetailsModal';
import  CustomButton  from './CustomButton';
import ImagesUser from './ImagesUser';
import { whileStatement } from '@babel/types';
import colorTheme from '../config/theme.style'
import moment from "moment";
import api from '../screens/home/services'
//import all the components we are going to use.
import { onSignIn, isSignedIn } from '../config/auth'
import { connect } from 'react-redux';
import CryptoJS from "react-native-crypto-js";
const { width } = Dimensions.get('window');

const images = [
    'https://s-media-cache-ak0.pinimg.com/originals/ee/51/39/ee5139157407967591081ee04723259a.png',
    'https://s-media-cache-ak0.pinimg.com/originals/40/4f/83/404f83e93175630e77bc29b3fe727cbe.jpg',
    'https://s-media-cache-ak0.pinimg.com/originals/8d/1a/da/8d1adab145a2d606c85e339873b9bb0e.jpg',
]

class CustomCard extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          page: 0,
          modalVisible: false,
          ratingSent: 0,
          processing: false,
          userInfo: this.props.userInfo,
          showPackageModal: false
        }
      }

    showUserDetails(userId){
       this.refs.details.open(userId);
    }
    showModal(title, description){
      this.refs.modal.open(title, description);
    }


   open() {
     this.setState({ modalVisible: true })
   };

   close() {
     this.setState({ modalVisible: false })
   };
   removeCard(card, userId) {
     this.props.cardActions('remove', card, userId);
   };

   like(card, user, priority) {
     this.setState({processing: true})
      //alert(JSON.stringify(user.userId))
      let chatId = [user.userId, this.props.user.userId ]
      chatId.sort((a,b) => { return a < b ? -1 : a > b ? 1 : 0; });
      chatId = CryptoJS.MD5(JSON.stringify(chatId)).toString();
      isSignedIn().then((token) => {
       api.like(JSON.parse(token), { receiverUserId: this.state.userInfo.userId, priority: priority, chatId })
       .then(res => {
         console.warn("Response:" + JSON.stringify(res.data));
         this.setState({processing: false})
         if(res.data.isMatche) {
            this.props.cardActions('like', card, user, res.data);
          } else {
            this.props.cardActions('like', card, user);
          }
       })
       .catch(err => console.warn(err.message))
    })
   }


   rating(rating) {
     isSignedIn().then((token) => {
       this.setState({processing: true})
       api.rating(JSON.parse(token), { score: rating, type: 'PRE', preMatchUserId: this.state.userInfo.userId })
       .then(res => {
         this.setState({processing: false})
         this.setState(prevState => ({
          ratingSent: res.data.score,
           userInfo: {
             ...prevState.userInfo,
             preRating: {
               ...prevState.userInfo.preRating,
               sent: {
                 ...prevState.userInfo.preRating.sent,
                 score: res.data.score
               }
             },
             medRating: {
               ...prevState.userInfo.medRating,
               preRating: {
                 ...prevState.userInfo.medRating.preRating,
                 medScore: res.data.medRating.preScore
               }
             }
           }
         }))
         this.setState(prevState => ({
           userInfo: {
             ...prevState.userInfo,
         }
         }))
       })
       .catch(err => alert(err.response.data.message))
    })
   }

   ratingCompleted = (rating) => {
     this.setState({ratingSent: rating})
   }

   ratingValue = (rating) => {
    this.setState({ratingSent: rating})
   }

   showModal = () => {
    //  alert('ok')
    this.setState({showPackageModal: true})
   }

   hideModal = () => {
    this.setState({showPackageModal: false})
   }



    render() {
      const {card, cardViwed, userInfo, processing } = this.props
      const { showPackageModal, hideModal, ratingSent } = this.state

        return (
            <View style={styles.container}>
              <View
                style={{ width: '100%', height: 30, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <View style={{
                        width: '80%', height: '100%', backgroundColor: '#000', opacity: 0.05, borderTopLeftRadius: 10,
                        borderTopRightRadius: 10, position: 'absolute'
                    }}></View>
                    <View style={{
                        width: '90%', height: '50%', backgroundColor: '#000', opacity: 0.05, borderTopLeftRadius: 10,
                        borderTopRightRadius: 10, position: 'absolute'
                    }}></View>
                </View>

                <View style={styles.content} >
                {(this.state.processing || this.state.userInfo.userId === this.props.processing) &&
                  <View style={styles.processing}>
                    <ActivityIndicator size="large" color={colorTheme.PRIMARY_COLOR} />
                  </View>
                }

                  <ImagesUser images={this.state.userInfo.photos}  radius={10} spacing={30} bullets={'top'} index={this.state.page}/>
                    <View style={styles.cardLabel}>
                        <Image style={styles.gradientBk} source={require('../assets/images/black-gradient.png')} />
                        <View style={styles.userInfo}>
                            <TouchableOpacity style={{flex: 1}} onPress={() => this.showUserDetails(this.state.userInfo.userId, null)}>
                                <View >
                                  <View style={styles.userName}>
                                    <Text style={[styles.name]} numberOfLines={1}>{this.state.userInfo.firstName.split(' ')[0].replace(' ', '')}, {(this.state.userInfo.birthDate) ? moment().diff(this.state.userInfo.birthDate, 'years') : ''}</Text>
                                     {this.state.userInfo.verified === 1 &&
                                     <View style={styles.verified} >
                                        <Image style={{ width: 20, height: 20, tintColor: '#7ED321',}}  source={require('../assets/images/icons/verified.png')} />
                                     </View>
                                    }
                                    </View>
                                  </View>
                                  <View>
                                    <Text>

                                      <FastImage tintColor='#FFF'style={{ width: 12, height: 12, marginRight: 5 }} source={require('../assets/images/icons/pin.png')} resizeMode={FastImage.resizeMode.contain} /><Text style={styles.userLocale}>{(this.state.userInfo && this.state.userInfo.location[0].distance) ? this.state.userInfo.location[0].distance.toFixed(0) : ' - '} Km | {this.state.userInfo.location[0].city}/{this.state.userInfo.location[0].state}</Text>
                                    </Text>
                                  </View>
                            </TouchableOpacity>
                            {/*<TouchableOpacity style={styles.score}
                              onPress={() => this.showModal(
                                (this.state.userInfo.preRating.sent.score > 0) ? this.state.userInfo.firstName+' é nota '+this.state.userInfo.preRating.sent.score.toFixed(1)+ ' para você.' : null,
                                (this.state.userInfo.preRating.sent.score > 0) ? 'Você deu uma nota '+this.state.userInfo.preRating.sent.score.toFixed(1)+' para '+this.state.userInfo.firstName+'.' : 'Dê uma nota para o perfil de '+this.state.userInfo.firstName+' para ver a nota que ele(a) te deu em "Minha nota".'
                              )}>
                                <Image style={{ width: 26, height: 26, tintColor: '#fff' }} source={require('../assets/images/icons/empty-star.png')} />
                                {(this.state.userInfo.preRating.sent.score == null)
                                  ? (
                                    <Text style={styles.userScore}>Sua nota</Text>
                                  ) : (
                                    <Text style={styles.userScore}>{this.state.userInfo.preRating.sent.score.toFixed(1)}</Text>
                                  )
                                }
                              </TouchableOpacity>*/}
                        </View>

                    </View>
                    <View style={styles.actionButtons}>
                      {/*(user && user.packages && user.packages.level > 2) ?
                        <TouchableOpacity style={[styles.button, styles.buttonSmall]} onPress={() => {
                            this.like(this.props.card, this.state.userInfo, true);
                          }}>
                            <Image style={{ width: 21, height: 21, tintColor: '#54B6BA' }} source={require('../assets/images/icons/cut.png')} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={[styles.button, styles.buttonSmall]} onPress={this.showModal}>
                            <Image style={{ width: 21, height: 21, tintColor: '#54B6BA' }} source={require('../assets/images/icons/cut.png')} />
                        </TouchableOpacity>
                        */}

                        <TouchableOpacity style={[styles.button, styles.buttonBig]} onPress={() => { this.removeCard(this.props.card, this.state.userInfo.userId) }}>
                            <Image style={{ width: 22, height: 22, tintColor: '#848484' }} source={require('../assets/images/icons/close.png')} />
                        </TouchableOpacity>
                        {/*<TouchableOpacity style={[styles.button, styles.buttonBig]} onPress={() => {
                            this.MatchPopup();
                          }}>*/}
                        <TouchableOpacity style={[styles.button, styles.buttonBig]} onPress={() => {
                            this.like(this.props.card, this.state.userInfo, false);
                          }}>
                          <Image style={{ width: 28, height: 22, tintColor: '#F52C55' }} source={require('../assets/images/icons/heart.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.buttonBig]} onPress={() => { this.open() }}>
                            <Image style={{ width: 24, height: 24, tintColor: '#E0B645' }} source={require('../assets/images/icons/star.png')} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.action}>
                    <View style={styles.actionMetrics}>
                        <View style={styles.textCenter}>
                            <Text style={styles.label}>PERFIL</Text>
                            <View style={styles.indicator}>
                                <Text style={styles.text}>{(this.state.userInfo.medRating.preRating.medScore !== null ) ? this.state.userInfo.medRating.preRating.medScore.toFixed(1) : '-'}</Text>
                                <Image style={{ width: 15, height: 15, tintColor: '#E0B645' }} source={require('../assets/images/icons/star.png')} />
                            </View>
                        </View>

                        <View style={styles.textCenter}>
                            <Text style={styles.label}>MATCH</Text>
                            <View style={styles.indicator}>
                                <Text style={styles.text}>{(this.state.userInfo.medRating.posRating.medScore !== null) ? this.state.userInfo.medRating.posRating.medScore.toFixed(1) : '-'}</Text>
                                <Image style={{ width: 15, height: 15, tintColor: '#E0B645' }} source={require('../assets/images/icons/star.png')} />
                            </View>
                        </View>
                        {/*<TouchableOpacity style={styles.textCenter}
                          onPress={() => this.showModal(
                            (this.state.userInfo.preRating.received.score > 0 && this.state.userInfo.preRating.sent.score > 0) ? 'Você é '+this.state.userInfo.preRating.received.score.toFixed(1)+' para '+this.state.userInfo.firstName+'.' : null,
                            (this.state.userInfo.preRating.received.score > 0 && this.state.userInfo.preRating.sent.score > 0) ? (
                                'Você recebeu uma nota '+this.state.userInfo.preRating.received.score.toFixed(1)+' de '+this.state.userInfo.firstName+'.'
                            ) : (this.state.userInfo.preRating.received.score == null && this.state.userInfo.preRating.sent.score > 0) ? (
                                'Você ainda não recebeu uma nota de '+this.state.userInfo.firstName+'.'
                            ) : (
                              'Dê uma nota para o perfil de '+this.state.userInfo.firstName+' para ver a nota que ela te deu.'
                            )
                            )}>*/}
                            <TouchableOpacity style={styles.textCenter}
                            onPress={() => { this.open() }}>
                            <Text style={styles.label}>MINHA(S)</Text>
                            <View style={styles.indicator}>

                            {/*(this.state.userInfo.preRating.received.score > 0 && this.state.userInfo.preRating.sent.score > 0) ? (
                                <Text style={styles.text}>{this.state.userInfo.preRating.received.score.toFixed(1)}</Text>
                            ) : (this.state.userInfo.preRating.received.score == 0 && this.state.userInfo.preRating.sent.score > 0) ? (
                                <Text style={styles.text}>-</Text>
                            ) : (
                              <Text style={styles.text}>?</Text>
                            ) */}
                            {(this.state.userInfo.preRating.sent.score == null)
                                  ? (
                                    <Text style={styles.text}>-</Text>
                                  ) : (
                                    <Text style={styles.text}>{this.state.userInfo.preRating.sent.score.toFixed(1)}</Text>
                                  )
                                }
                                <Image style={{ width: 15, height: 15, tintColor: '#E0B645' }} source={require('../assets/images/icons/star.png')} />
                            </View>
                        </TouchableOpacity>
                        </View>
                        {(this.state.userInfo.checkin.cardCheckin && this.state.userInfo.checkin.loggedCheckin) &&
                          <View style={styles.checkin}>
                            <FastImage style={{borderRadius: 15, width: 25, height: 25, marginRight: 10, borderColor: '#F1F1F1', borderWidth: 1}} source={{ uri: this.state.userInfo.checkin.logo }}   PlaceholderContent={<ActivityIndicator />}/>
                            <View>
                              <View style={styles.checkinTextLine}>
                                <Text style={[styles.checkinText, styles.checkinTextBold]}>{this.state.userInfo.checkin.company} </Text>
                              </View>
                              <View style={styles.checkinTextLine}>
                                <Text style={styles.checkinText}>Fez check-in às </Text>
                                <Text style={[styles.checkinText, styles.checkinTextBold]}>{moment(this.state.userInfo.checkin.cardCheckin).format('HH:mm')}</Text>
                              </View>
                            </View>
                          </View>
                        }
                    </View>
                </View>

                <UserDetailsModal ref="details" />
                <CustomModal ref="modal" />
                <Modal
                  style={{marginTop: 22}}
                  animationType="slide"
                  transparent={true}
                  visible={this.state.modalVisible}
                  >
                  <View style={styles.modalContainer}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.modalComponent}>
                      <View style={styles.modalItem}>
                        {
                          (this.state.userInfo.preRating.sent.score < 1) ? (
                            <View style={{marginBottom: 15}}>
                              <Text style={styles.modalTitle}>Quantas estrelas você dá para o perfil de {this.state.userInfo.firstName}?</Text>
                              <View style={styles.stars}>
                              {[6,7,8,9,10].map((m) =>
                              //this.state.userInfo.preRating.sent.score
                              <TouchableOpacity onPress={() => this.ratingValue(m)}>
                                <Image style={{ width: 45, height: 45, marginLeft: 5, marginRight: 5, tintColor: m <= ratingSent ? '#E0B645' : '#EDEDED' }} source={require('../assets/images/icons/star.png')} />
                              </TouchableOpacity>
                              )}
                              </View>
                              <Text style={styles.notes}>O valor das estrelas são de 6 (1 estrela) até 10 (5 estrelas). Você não poderá alterar a quantidade de estrelas</Text>
                              <View style={{marginTop: 15}}>
                                <TouchableOpacity onPress={() => {this.rating(this.state.ratingSent); this.close()}}>
                                  <CustomButton  text={'Enviar'} ></CustomButton>
                                </TouchableOpacity>
                              </View>
                            </View>

                          ) : (
                          <Text style={styles.modalTitle}>Você deu {this.state.userInfo.preRating.sent.score.toFixed(1)} estrelas para o perfil de {this.state.userInfo.firstName.split(' ')[0].replace(' ', '')}.</Text>
                          )

                        }

                      </View>
                      <TouchableOpacity onPress={() => {
                          this.close();
                        }}>
                        <Text style={styles.closeButton}>Fechar</Text>
                      </TouchableOpacity>

                    </View>
                  </View>
                </View>
              </Modal>
              <Packages userToken={this.props.userToken} modalVisible ={showPackageModal} onPressClose={(v)=> this.hideModal(v)} />
            </View>
        );
    }
}

const styles = {

  stars: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },

  processing: {
    position: 'absolute',
    zIndex: 99999,
    backgroundColor: 'rgba(255,255,255,.9)',
    borderRadius: 10,
    left: 0,
    top: 0,
    right: 0,
    botton: 0,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'

  },

    container: {
        flex: 1,
        flexDirection: 'column',
        width: width-20,
        justifyContent: 'center',
        padding:5,
        marginBottom:5,
        position: 'relative'
    },

    content: {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        height: 60,
        borderRadius: 10,
        shadowOpacity: 0.75,
        shadowRadius: 5,
        shadowColor: '#ccc',
        shadowOffset: { height: 0, width: 0 },
        elevation: 4,
        backgroundColor: '#fff'
    },
    userPersonal: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginLeft: 20,
        marginRight: 20
    },
    score: {
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50
    },
    userName: {
        color: '#fff',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        alignItems: 'center',
        maxWidth: width - 85


    },
    name: {
        color: '#fff',
        fontSize: 35,
        marginRight: 10
    },
    userLocale: {
        color: '#fff',
        fontSize: 15
    },
    userScore: {
        color: '#fff',
        fontSize: 12,
    },

    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        position: 'absolute'
    },
    gradientBk: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        resizeMode: 'stretch'
    },
    actionMetrics: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },

    action: {
        backgroundColor: '#fff',
        padding: 15,
        width: '100%',
        flexDirection: 'column',
        paddingTop: 45,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    actionButtons: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -35,
        zIndex: 1
    },
    button: {
        backgroundColor: '#fff',
        borderRadius: 50,
        shadowOpacity: 0.25,
        shadowRadius: 5,
        shadowColor: '#000',
        shadowOffset: { height: 0, width: 0 },
        elevation: 4,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5
    },
    buttonSmall: {
        width: 40,
        height: 40,
    },

    buttonBig: {
        width: 55,
        height: 55,
    },
    cardLabel: {
        width: '100%',
        height: 110,
        backgroundSize: '100%',
        overflow: 'hidden',
        marginBottom: -35,
        position: 'relative'
    },

    label: {
        color: colorTheme.TEXT_MUTED,
        fontSize: 10,
        textAlign: 'center',
    },
    text: {
        color: colorTheme.TEXT_DARK,
        fontSize: 18,
        marginRight: 4,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    transaction: {
        margin: 5,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 3,
        height: 30,
        width: 310
    },
    modalContainer: {
      backgroundColor: Platform.OS === 'ios' ? '#00000066' : 'rgba(0,0,0,0.5)',
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
      fontSize: 22,
      textAlign: 'center',
      marginTop: 10,
      marginBottom: 10,
      fontWeight: '600',
    },
    modalParagraph: {
      fontSize: 20,
      lineHeight: 23,
      marginBottom: 10,
      textAlign: 'center',
    },
    closeButton: {
      color: '#FFF',
      marginTop: 20,
      textAlign: 'center'
    },
    notes: {
      fontSize: 13,
      textAlign: 'center',
      marginTop: 10,
      marginBottom: 5,
    },
    indicator: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        height: 25,
    },

    checkin: {
      borderTopWidth: 0.5,
      marginTop: 8,
      paddingTop: 8,
      borderTopColor: '#ededed',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',

    },
    checkinTextLine: {
      flexDirection: 'row',
    },
    checkinText: {
      fontSize: 13,
      color: colorTheme.TEXT_MUTED
    },
    checkinTextBold: {
      fontWeight: '600',
    }
};

/** Redux */
const mapStateToProps = state => {
  return {
    user: state.userData.user
  };
};

export default (connect(
  mapStateToProps,
)(CustomCard))
