// Home screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, ScrollView, Modal, SafeAreaView, StyleSheet, StatusBar, FlatList, Dimensions, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import  HeaderInner  from '../../components/HeaderInner';
import  ListItems  from '../../components/ListItems';
import  CustomButton  from '../../components/CustomButton';
import  Packages  from '../../components/Packages';
import  UserDetailsModal  from '../../components/UserDetailsModal';
import colorTheme from '../../config/theme.style'
import { List, ListItem, Avatar } from 'react-native-elements';
import { onSignOut, isSignedIn } from '../../config/auth'
import api from './services'
import moment from "moment";
import { connect } from 'react-redux';
import FastImage, { FastImageProps } from 'react-native-fast-image'
//import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';

import { noAthorized } from '../../components/Utils'

import { userData } from '../../../redux/actions/userActions';


//import all the components we are going to use.
const { width } = Dimensions.get('window');
const height = width * 1;
const screenHeight = Dimensions.get('window').height;
const pageinfo = {
    title: "Perfil",
    page: "Profile",
};
class Profile extends Component {
  constructor(props) {
    super(props);
    noAthorized(props)
    this.state = {
      showPackageModal: false,
      user: this.props.user,
      items: [
        {
          id: 0,
          icon: require('../../assets/images/profile/coupons.png'),
          destination: 'Coupons',
          title: 'Cupons de desconto',
          subtitle: 'Ganhe descontos nos nossos parceiros'
        },
        {
          id: 1,
          icon: require('../../assets/images/profile/preferences.png'),
          destination: 'Preferences',
          title: 'Preferências',
          subtitle: 'Escolha os perfis que te interessam'
        },
        {
          id: 2,
          icon: require('../../assets/images/profile/hobbies.png'),
          destination: 'Hobbies',
          title: 'Hobbies e Atividades',
          subtitle: 'O que você faz nas horas vagas?'

        },
        {
          id: 3,
          icon: require('../../assets/images/profile/configurations.png'),
          destination: 'Configurations',
          title: 'Configurações',
          subtitle: 'Informações e notificações da sua conta'

        },
        {
          id: 4,
          icon: require('../../assets/images/profile/pictures.png'),
          destination: 'Photos',
          title: 'Fotos',
          subtitle: 'Exclua, Reordene ou adicione novas fotos'

        },
        {
          id: 5,
          icon: require('../../assets/images/profile/share.png'),
          destination: 'Invite',
          title: 'Convidar amigos',
          subtitle: 'Convide amigos e ganhe recompensas'

        }
      ]
    }
    //console.warn(this.props.navigation.getParam('lastScreen'))
  }

  changeCover = (photoId) => {
    this.setState({loadingImage: true});
        /*const options = {
        quality: 0.8,
        maxWidth: 600,
        maxHeight: 600,
        storageOptions: {
          skipBackup: true,
        },
      };
      ImagePicker.launchImageLibrary(options, (response) => {

          // // Same code as in above section!
          // const source = { uri: response.uri };
          console.warn('Response = ', response);
          const source = { uri: 'data:image/jpeg;base64,' + response.data };

          // const source = { uri: 'data:image/jpeg;base64,' + response.data };
          if (response.didCancel) {
              console.warn('User cancelled image picker');
              this.setState({loadingImage: false});
          } else if (response.error) {
              console.warn('ImagePicker Error: ', response.error);
              this.setState({loadingImage: false});
          } else if (response.customButton) {
              console.warn('User tapped custom button: ', response.customButton);
              this.setState({loadingImage: false});
          } else {
             const cover = { uri: 'data:image/jpeg;base64,' + response.data };
             //const source = { uri: 'data:image/jpeg;base64,' + response.data };
             console.warn(photoId)
             console.warn('finalizou a adição de fotos')
             isSignedIn().then((token) => {
               api.changePhoto(JSON.parse(token), { photo: cover, photoType: 'cover', photoOrder: 0, oldPhoto: photoId }).then(res => {
                  this.setState({loadingImage: false});
                  console.warn(res);
                  const {photoId, photoUrl} = res.data
                  this.setState(prevState => ({
                    user: {
                      ...prevState.user,
                      cover: {
                        ...prevState.user.cover,
                        photoId: photoId,
                        photoUrl: photoUrl
                      },
                    }
                  }), () => {
                    const { userData } = this.props;
                    userData(this.state.user)
                  })

                 }).catch(err => alert(JSON.stringify(err)))
             }
             );



          }

      });*/

      ImagePicker.openPicker({
        width: 650,
        height: 900,
        cropping: true,
        includeBase64: true,
        includeExif: true,
        //cropperStatusBarColor: colorTheme.PRIMARY_COLOR,
        cropperToolbarTitle: 'Editar Imagem',
        useFrontCamera: true,
        mediaType: 'photo'
      }).then(image => {
        const cover = { uri: `data:${image.mime};base64,${image.data}`};
        isSignedIn().then((token) => {
          api.changePhoto(JSON.parse(token), { photo: cover, photoType: 'cover', photoOrder: 0, oldPhoto: photoId }).then(res => {
            this.setState({loadingImage: false});
             const {photoId, photoUrl} = res.data
             this.setState(prevState => ({
              user: {
                ...prevState.user,
                cover: {
                  ...prevState.user.cover,
                  photoId: photoId,
                  photoUrl: `data:${image.mime};base64,${image.data}`
                },
              }
            }), () => {
              const { userData } = this.props;
              userData(this.state.user)
            })
  
            }).catch(err => console.warn(JSON.stringify(err)))
        });
      }).catch( err => {
        this.setState({loadingImage: false});
        this.setState({ ['selectedItem'+index]: false})
      });

  }
  showUserDetails(userId){
    const { user } = this.props
     this.refs.details.open(userId, user);
 }


  componentDidMount() {
    //this.loggedInfo()
    /*onSignOut().then(data => {
      const { navigation } = this.props;
      navigation.navigate('Auth', { data: {} })
    })*/
  }

  /*loggedInfo = async (action) => {
      isSignedIn().then((token) => {
        api.loggedInfo(JSON.parse(token))
            .then(res => {
              console.warn(res);
            })
            .catch(function(error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
             // ADD THIS THROW error
              throw error;
            });
        }
      );
  }*/
  showModal = () => {
   this.setState({showPackageModal: true})
  }

  hideModal = () => {
   this.setState({showPackageModal: false})
  }


  showModal = () => {
    //  alert('ok')
    this.setState({showPackageModal: true})
   }

   hideModal = () => {
    this.setState({showPackageModal: false})
   }


  render() {
    const { user } = this.props;
    const { showPackageModal, hideModal, loadingImage } = this.state
    return (
      <SafeAreaView style={[styles.container]}>
        <HeaderInner pageinfo={pageinfo} />
        <StatusBar
          barStyle="default" />
        <ScrollView style={styles.container}>
          <View style={styles.profileInfo}>
              <View style={styles.userInfo}>
                <View style={styles.cover} >
                  {(loadingImage) ? 
                    <TouchableOpacity style={styles.loadingImage} onPress={() => this.showUserDetails(user.userId)}>
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 25, paddingRight: 25 }}>
                        <ActivityIndicator color={colorTheme.PRIMARY_COLOR}/>
                      </View>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={styles.loadingImage} onPress={() => this.showUserDetails(user.userId)}>
                      <FastImage style={styles.coverPhoto} source={{uri: (user.cover && user.cover.photoUrl) ? user.cover.photoUrl : null}} />
                    </TouchableOpacity>

                  }
                  <TouchableOpacity style={styles.coverEdit} onPress={() => this.changeCover((user.cover && user.cover.photoId) ? user.cover.photoId : null)}>
                    <Image style={{ height: 9, width: 9}} source={require('../../assets/images/edit-cover.png')} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => this.showUserDetails(user.userId)}>
                <View style={styles.userName}>
                  <Text style={styles.userDesc}>{(user.birthDate) ? user.firstName.split(' ')[0].replace(' ', '')+', ' + moment().diff(user.birthDate, 'years') : user.firstName}</Text>
                    {user.verified === 1 &&
                    <View style={styles.verified} >
                        <Image style={{ width: 13.5, height: 13, tintColor: '#7ED321',}}  source={require('../../assets/images/icons/verified.png')} />
                    </View>
                    }
                  </View>
                </TouchableOpacity>
                <Text style={styles.userLocation}>{(user.location) ? user.location[0].city : null}/{(user.location) ? user.location[0].state : null}</Text>
              </View>
              {(user && user.packages && user.packages.level < 2) ?
                <TouchableOpacity style={styles.button} onPress={this.showModal}>
                  <CustomButton  text={'Conheça o Shipper VIP'}></CustomButton>
                </TouchableOpacity>
                :
                <TouchableOpacity style={styles.button} onPress={this.showModal}>
                  <CustomButton  text={`Você é VIP até ${moment((user.packages && user.packages.level <= 2) ? user.packages.end : null).format('DD/MM')}`}></CustomButton>
                </TouchableOpacity>
              }
            </View>
            <View style={styles.profileItems}>
              <ListItems items={this.state.items} onPress={(path) => this.props.navigation.navigate(path)}>
              </ListItems>
            </View>
            <UserDetailsModal ref="details" />
            <Packages modalVisible ={showPackageModal} onPressClose={(v)=> this.hideModal(v)} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({
  loadingImage: {
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.45)',
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 100/ 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    borderColor: '#000',
  },
  userInfo: {
    width: '100%',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 45,
    marginBottom: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: colorTheme.TEXT_MUTED
  },
  profileInfo: {
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: -38
  },
  profileItems: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 15
  },
  cover: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 100/ 2,
    backgroundColor: '#f4f4f4',
    marginBottom: 10
  },
  coverPhoto: {
    width: 100,
    height: 100,
    borderRadius: 100/ 2,
    position: 'absolute'
  },
  coverEdit: {
    width: 32,
    height: 32,
    borderRadius: 32/ 2,
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorTheme.PRIMARY_COLOR
  },
  userName: {
    color: '#fff',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    alignItems: 'center',
    maxWidth: width - 205
  },
  verified: {
    marginLeft: 5
  },
  userDesc: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 3,
    color: colorTheme.DARK_COLOR
  },
  userLocation: {
    fontSize: 13,
    fontWeight: '400',
    color: colorTheme.TEXT_MUTED
  },
  scrollContainer: {
    height: '100%',
    position: 'absolute',
    borderRadius:10,
    overflow:'hidden',
    backgroundColor: 'red',
    borderColor: '#000',
    borderWidth:3
  },
});

/** Redux */
const mapStateToProps = state => {
  return {
    user: state.userData.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userData: user => {
          dispatch(userData(user))
      }
  };
};


export default (connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile));
