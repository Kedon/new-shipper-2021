import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableOpacity
} from "react-native";
import { Divider } from 'react-native-elements';
import FastImage, { FastImageProps } from 'react-native-fast-image'
import colorTheme from '../config/theme.style';
import  CustomButton  from './CustomButton';
import ImagesUser from './ImagesUser';
import { connect } from 'react-redux';
import { activeChat } from '../../redux/actions/chatsActions'

import moment from "moment";
//console.disableYellowBox = true;
const { width } = Dimensions.get('window');
const height = width * 1;
const screenHeight = Dimensions.get('window').height;
class UserProfile extends Component {

  state = {
    isScrollEnabled: false,
    fadeAnim: new Animated.Value(0), // init opacity 0
    chatButtonPosition: 'relative',
    descriptionLength: 2,
    visible: this.props.visible,
    user: this.props.route.params.user,
    page: 0,
    navigation: true
  }

  goToChat = () => {
    const { navigation } = this.props;
    const { user } = this.state;
    const userData = {
        userId: user.userId,
        birthDate: user.birthDate,
        blocked: null,
        firstName: user.firstName,
        hobbies: user.hobbies,
        isMatche: null,
        location: user.location,
        photos: user.photos,
        typing: false,
        unread: 0
       }
       this.props.activeChat(userData)
        navigation.navigate('ChatRoom', {user })
  }

  render() {
    const {user, page} = this.state;
    const userPhotos = user.photos && user.photos.length > 0 ? [...new Set(user.photos.map(({photoId}) => photoId))].map(e => user.photos.find(({photoId}) => photoId == e)) : null;	


      return (
          <View>
            <ScrollView style={{paddingBottom: 50, flexGrow: 1}}>
                    <View style={styles.content}>
                      <View style={styles.slider}>
                        <ImagesUser images={userPhotos}  radius={0} spacing={0} bullets={'bottom'} index={page} navigation={this.state.navigation}/>
                      </View>

                      <View style={styles.userInfo}>
                        <View style={styles.presentation}>
                          <View>
                            <Text style={styles.userDesc}>{user.firstName.split(' ')[0].replace(' ', '')}, {(user.birthDate) ? moment().diff(user.birthDate, 'years') : ''}</Text>
                            <View style={styles.userDistance}>
                              <Image style={styles.navIcon, { width: 10, height: 12, tintColor: colorTheme.TEXT_MUTED, marginRight: 5 }} source={require('../assets/images/icons/pin.png')} />
                              <Text style={styles.userLocation}>{user.location[0].distance.toFixed(2)} Km | {user.location[0].city}/{user.location[0].state}</Text>
                            </View>
                          </View>
                        </View>
                        <Divider style={styles.divider} />

                        <View style={styles.details}>
                          <Text style={styles.title}>Gênero: </Text>
                          <Text style={styles.text}>{user.genre == 'MALE' ? 'Masculino' : 'Feminino'}</Text>
                        </View>
                        {(user.occupation) &&
                          <View style={styles.details}>
                            <Text style={styles.title}>Ocupação: </Text>
                            <Text style={styles.text}>{user.occupation}</Text>
                            <Divider style={styles.divider} />
                          </View>
                        }
                        {(user.hobbies != null && user.hobbies.length > 0) &&
                          <View style={styles.details}>
                            <Text style={styles.title}>Hobbies: </Text>
                            {user.hobbies.map((hobbie, index) =>
                              <View>
                                <Text key={hobbie.hobbieId} style={styles.text}>{hobbie.hobbieName}{(index + 1) < user.hobbies.length ? ', ': ''} </Text>
                              </View>
                            )}
                            <Divider style={styles.divider} />
                          </View>
                        }
                        {user.description ?
                          <View>
                            <Text style={styles.description}>{user.description}</Text>
                            <Divider style={styles.divider} />
                          </View>
                          : null
                        }
                      </View>
                    </View>

                  </ScrollView>
                  <TouchableOpacity style={[{position: 'absolute', left: 15, right: 15, bottom: 15, zIndex: 2}]} onPress={() => this.goToChat()}>
                    <CustomButton  text={'Chame '+(user && user.firstName && user.firstName.split(' ')[0].replace(' ', ''))+' para um chat'}></CustomButton>
                </TouchableOpacity>
          </View>
        
      )
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
          marginBottom: 45
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
        fontWeight: colorTheme.FONT_WEIGHT_BOLD, 
        fontSize: colorTheme.FONT_SIZE_LARGE, 
        marginBottom: 2.5,
        color: colorTheme.PRIMARY_COLOR,
        width: width
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
      fontSize: 15,
      width: width - 40
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

const mapStateToProps = state => {
    return {
        activeChat: state.chats,
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
      activeChat: user => {
        dispatch(activeChat(user))
      },
    };
  };
  
  
  
  
  export default (connect(
    mapStateToProps,
    mapDispatchToProps
  )(UserProfile))

