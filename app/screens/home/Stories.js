// Setting screen
import React, { Component, Fragment } from 'react';
//import react in our code.
import { Text, View, Modal, ScrollView, Dimensions, TouchableOpacity, TouchableWithoutFeedback, ImageBackground, Image, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { TextInput } from 'react-native';
import moment from "moment";
import 'moment/locale/pt-br';
import { Avatar } from 'react-native-elements';
import colorTheme from '../../config/theme.style';
import FastImage, { FastImageProps } from 'react-native-fast-image'
import ImagePicker from 'react-native-image-picker';
import CustomButton from '../../components/CustomButton'
import api from './services';
import { noAthorized } from '../../components/Utils'
import { isSignedIn } from '../../config/auth'
import { BlurView, VibrancyView } from "@react-native-community/blur";
import  Packages  from '../../components/Packages';
const { width } = Dimensions.get('window');
const height = Dimensions.get('window').height;
//import all the components we are going to use.
import { connect } from 'react-redux';
import gradient from '../../assets/images/gradient.png'
import firestore from '@react-native-firebase/firestore';
import * as geofirestore from 'geofirestore';

const selfie = { uri: 'https://st2.depositphotos.com/2931363/10483/i/950/depositphotos_104839108-stock-photo-joyful-selfie-joyful-young-loving.jpg'}
class Stories extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            modalVisible: false,
            storie: null,
            description: '',
            userStorie: null,
            stories: [],
            offset: 0,
            perPage: 6,
            loading: false,
            userStoriesLength: 0,
            showPackageModal: false
        }
      }
    

    createStory = () => {
        this.setState( prevState => ({showModal: !prevState.showModal }))
    } 

       showPackageModal = () => {
        this.setState( prevState => ({showPackageModal: !prevState.showPackageModal}))
       }
       

    /*createStory = () => {
        this.setState( prevState => ({showModal: !prevState.showModal }))
    }*/

    dismiss = () => {
        this.setState( prevState => ({showModal: false, storie: null }))
    }

    openStories = (i) => {
        /*this.setState( prevState => ({modalVisible: !prevState.modalVisible }), () => {
            this.scrollTo(i);
        })*/
        
    }



    createStoryPhoto = () => {
        const { user } = this.props;
        const { userStoriesLength } = this.state
    
         if(user && user.packages && !user.packages.end && userStoriesLength >= 2 ){
          Alert.alert(
            'Poste mais stories',
            'Você já postou seus 2 stories de hoje. Seja premium para poder postar até 6 stories por dia.',
            [
              {
                text: "Quero ser Premium",
                onPress: () => this.showPackageModal()
              },
              {
                text: "Cancelar",
                onPress: () => this.setState({ visibility: 1 }),
                style: "cancel"
              },
            ],
            { cancelable: true }
          );
        } else if (user && user.packages && user.packages.end && userStoriesLength >= 6){
            Alert.alert(
                null,
                'Você já atingiu o seu limite de stories de hoje. Volte amanhã para adicionar novos.',
                [
                  {
                    text: "Ok, entendi!",
                    onPress: () => this.setState({ visibility: 1 }),
                    style: "cancel"
                  },
                ],
                { cancelable: true }
              );
        } else {
            this.setState({showActivity: true});
            const options = {
            quality: 0.8,
            maxWidth: 600,
            maxHeight: 600,
            storageOptions: {
              skipBackup: true,
            },
          };
          ImagePicker.launchImageLibrary(options, (response) => {
              const source = { uri: 'data:image/jpeg;base64,' + response.data };
              // const source = { uri: 'data:image/jpeg;base64,' + response.data };
              if (response.didCancel) {
                  this.createStory()
                  this.setState({showActivity: false});
              } else if (response.error) {
                  this.setState({showActivity: false});
              } else if (response.customButton) {
                  this.setState({showActivity: false});
              } else {
                 const cover = { uri: 'data:image/jpeg;base64,' + response.data };
                 this.setState({storie: cover, showActivity: false})
              }
    
          });
        } 
        
      }

      sendStorie = () => {
        isSignedIn().then((token) => {
            const { storie, description } = this.state
            const { latitude, longitude } = this.props.user.location[0]
            this.setState({showActivity: true})
            api.postStorie(JSON.parse(token), { storie, description })
            .then(res => {
                this.setState( prevState => ({
                    description: '', 
                    showActivity: false,
                    userStorie: [{
                        storieId: res.data.storieId,
                        fileUrl: res.data.fileUrl,
                        description: res.data.description,
                        createAt: res.data.createAt
                    }, ...this.state.userStorie],
                    showModal: false,
                    storie: null,
                    userStoriesLength: prevState.userStoriesLength + 1
                }))
            }).catch(err => noAthorized(err))
        });

      }

      componentDidMount = () => {
        this.loadStories()
      }
      loadStories = () => {
            
          this.setState({ loading: true })
          const {offset, perPage } = this.state
          isSignedIn().then((token) => {
            
          api.stories(JSON.parse(token), {offset, perPage})
            .then(res => {
                
                this.setState({stories: [...this.state.stories, ...res.data.userInfo], offset: offset + res.data.userInfo.length, loading: false}, () => {
                    setTimeout(() => {
                        var index = this.props.route.params.index;
                        this.scroll.scrollTo({x: width * index, y: 0, animated: true});
                    }, 50);
                    
            
                })
            }).catch(err => noAthorized(err))
        })
      }

      showUserDetails = (data) => {
        const { navigation } = this.props;
        navigation.navigate('UserProfile', {user: data, useName: data.firstName})
      }

      
    render() {
      const { user } = this.props;
      const { loadingImage, storie, userStorie, stories, loading, modalVisible, showPackageModal } = this.state
        return (
            <View style={styles.stories}>
                {/*POSTAR UM STORE*/}
                <View
                    style={{height: height}}
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showModal}>
                    <ScrollView
                            horizontal={true}
                            decelerationRate="fast"
                            snapToInterval={width}
                            snapToAlignment={"center"}
                            showsHorizontalScrollIndicator={false}
                            ref={(c) => {this.scroll = c}}
                            >
                            {stories && stories.map((str, index) =>
                            <TouchableWithoutFeedback 
                                style={{ flex: 1 }} 
                                key={`storie_${index}`}
                                /*onLayout={event => {
                                    const layout = event.nativeEvent.layout;
                                    this.arr[key] = layout.y;
                                    console.log('height:', layout.height);
                                    console.log('width:', layout.width);
                                    console.log('x:', layout.x);
                                    console.log('y:', layout.y);
                                  }}*/
                            >
                                <ImageBackground source={{uri: str && str.stories && str.stories.length > 0 && str.stories[0].fileUrl}} style={styles.image}>
                                    <SafeAreaView style={{flex: 1, position: 'relative'}}>
                                        <Image style={styles.gradientBk} source={gradient} />
                                        <View style={styles.description}>
                                            
                                            <TouchableOpacity style={styles.userInfo} onPress={ () => this.showUserDetails(str)}>
                                                <View>
                                                    <FastImage
                                                        style={[styles.storeSmall]}
                                                        source={{uri: str && str.photos && str.photos.length > 0 && str.photos[0].photoUrl}}
                                                        />
                                                    <View style={styles.userStatusSmall}></View>
                                                </View>
                                                <View style={{marginLeft: 8}}>
                                                    <Text style={styles.storieName}>{str && str.firstName && str.firstName.split(' ')[0].replace(' ', '')}, {(str.birthDate) ? moment().diff(str.birthDate, 'years') : ''} <Text style={styles.storieTime}>&mdash; {moment(str.stories[0].createAt, "YYYY-MM-DD HH:mm:ss").locale('pt-br').fromNow()}</Text></Text>
                                                    <Text numberOfLines={1} style={styles.storieLocation}><Text style={styles.distance}>{(str && str.location && str.location[0].distance) ? str.location[0].distance.toFixed(2)+' KM - ' : null}</Text>{(str && str.location && str.location[0].district) ? str.location[0].district : ' - '}{(str && str.location && str.location[0].city) ? ', '+str.location[0].city : null}</Text>
                                                </View>

                                            </TouchableOpacity>
                                            <Text style={[styles.descriptionParagraph, {textAlign: 'center'}]}>{str.stories[0].storieDescription}</Text>
                                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                                <Text style={styles.dismiss}>Sair</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </SafeAreaView>
                                </ImageBackground>
                            </TouchableWithoutFeedback>
                            )}
                                
                                
                        </ScrollView>
                </View>
                {/*NAVEGAR NOS STORES*/}
                    <Modal
                    style={{marginTop: 22}}
                    animationType="slide"
                    hardwareAccelerated={true}
                    visible={modalVisible}
                    transparent>
                        <View style={styles.modalContainer}>
                        
                        </View>
                        
                    </Modal>
                    <Packages modalVisible={showPackageModal} onPressClose={(v)=> this.showPackageModal()} />
            </View>


        );
    }
}


const styles = {
    stories: {
        borderBottomWidth: 5,
        borderBottomColor: colorTheme.LIGHT_COLOR,
    },

    count: {
        color: '#FFF',
        fontSize: colorTheme.FONT_SIZE_XSMALL,
        color: colorTheme.LIGHT_COLOR,
        display: 'flex',
        textAlign: 'right',
        marginBottom: 5
    },
    descriptionText: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderColor: 'rgba(255,255,255,0.3)',
        borderWidth: .5,
        borderRadius: 10,
        marginBottom: 10,
        paddingTop: 5,
        paddingBottom: 10,
        paddingRight: 10,
        paddingLeft: 10,
    },
    messageContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: width,
     },
    message: {
        color: 'white',
        backgroundColor: colorTheme.SECONDARY_COLOR,
        fontSize: colorTheme.FONT_SIZE_SMALL,
        fontWeight: colorTheme.FONT_WEIGHT_BOLD,
        paddingTop: 10,
        paddingLeft: 15,
        paddingBottom: 10,
        paddingRight: 15,
        margin: 5,
        borderRadius: 17,
    },
    gradientBk: {
        width: width,
        flex: 1,
        position: 'absolute',
        resizeMode: 'stretch',
        //top: 0,
        bottom: 0,
        zIndex: 0,
    },    
    description: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 25,
        paddingTop: 60,
        paddingBottom: 30,
        zIndex: 0,
        width: '100%',
        height: '100%',
    },
    descriptionTitle: {
        fontSize: colorTheme.FONT_SIZE_SLARGE * 1.8,
        color: colorTheme.LIGHT_COLOR,
        fontWeight: colorTheme.FONT_WEIGHT_THIN,
    },
    descriptionCaption: {
        fontSize: colorTheme.FONT_SIZE_LARGE *1.05,
        marginBottom: 15,
        color: colorTheme.LIGHT_COLOR,
        fontWeight: colorTheme.FONT_WEIGHT_REGULAR,
    },
    descriptionParagraph: {
        fontSize: colorTheme.FONT_SIZE_REGULAR,
        marginBottom: 10,
        color: colorTheme.LIGHT_COLOR,
        fontWeight: colorTheme.FONT_WEIGHT_THIN,
    },
    dismiss: {
        fontSize: colorTheme.FONT_SIZE_XSMALL,
        marginTop: 12,
        opacity: .8,
        color: colorTheme.LIGHT_COLOR,
        fontWeight: colorTheme.FONT_WEIGHT_BOLD,
        textTransform: 'uppercase',
        textAlign: 'center'
    },

    image: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        width: width,
        justifyContent: 'space-between'
      },
    modalContainer: {
        backgroundColor: Platform.OS === 'ios' ? '#00000066' : 'transparent',
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

      
    profile: {
        alignItems: 'center'
    },
    store: {
        width: 55,
        height: 55,
        borderRadius: 27.5,
        backgroundColor: '#f1f1f1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

    },
    storeSmall: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f1f1f1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

    },
    userStatus: {
        height: 12,
        width: 12,
        borderRadius: 6,
        borderColor: '#FFF',
        borderWidth: 2,
        position: 'absolute',
        top: 5,
        left: -3,
        backgroundColor: '#7ED321',
        overflow: 'hidden'
    },
    userStatusSmall: {
        height: 8,
        width: 8,
        borderRadius: 4,
        position: 'absolute',
        top: 3,
        left: -2,
        backgroundColor: '#7ED321',
        overflow: 'hidden'
    },
    userCover: {
      borderColor: '#FFF',
      borderWidth: 2,
      bottom: -5,
      right: -0,
      height: 19,
      width: 19,
      borderRadius: 35,
      position: 'absolute',
      zIndex: 2
    },
    user: {
        height: 15,
        width: 15,
        borderRadius: 35,
        zIndex: 1
    },
    addStory: {
      height: 18,
      width: 18,
      borderRadius: 35,
      top: -2,
      left: -2,
      zIndex: 1
    },
    title: {
      fontSize: colorTheme.FONT_SIZE_SMALL,
      marginBottom: 3,
      marginLeft: 15,
      marginTop: 15,
      color: colorTheme.GREY_COLOR,
      fontWeight: colorTheme.FONT_WEIGHT_BOLD
    },
    name: {
      fontSize: colorTheme.FONT_SIZE_SMALL,
      color: colorTheme.DARK_LIGHT_COLOR,
      fontWeight: colorTheme.FONT_WEIGHT_BOLD,
      marginTop: 5
    },
    userInfo: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        paddingRight: 5,
    },
    storieName: {
        color: "#FFFFFF",
        marginBottom: 1.5
    },
    storieTime: {
        color: "rgba(255,255,255,.70)",
        fontSize: colorTheme.FONT_SIZE_MEDIUM
    },
    storieLocation: {
        color: "#FFFFFF",
        fontSize: colorTheme.FONT_SIZE_XSMALL
    },
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        paddingRight: 5,
        height: 100,
        
    },
    cards: {
        height: 200,
        flexDirection: 'row'
    },
    transactions: {
        width: '100%',
    },
    transaction: {
        margin: 5,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 3,
        height: 30,
        width: 310
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
)(Stories));
