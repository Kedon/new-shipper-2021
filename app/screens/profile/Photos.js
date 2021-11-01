// Home screen
import React, { Component } from 'react';
//import react in our code.
import { Alert, Text, View, ScrollView, SafeAreaView, StyleSheet, StatusBar, FlatList, Dimensions, Image, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import colorTheme from '../../config/theme.style'
import FastImage, { FastImageProps } from 'react-native-fast-image';
//import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';

import  AppAd  from '../../components/AppAd';
import { connect } from 'react-redux';
import { onSignOut, isSignedIn } from '../../config/auth'
import { noAthorized } from '../../components/Utils'
import api from './services'

//import all the components we are going to use.
const { width } = Dimensions.get('window');
const height = width * 1;
const screenHeight = Dimensions.get('window').height;
class Photos extends Component {
  constructor(props) {
    super(props)
    /**
     * No token go back login
     */noAthorized(props)
  }

  state = {
    data: this.props.user.packages.level > 1 ? [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] : [1,2,3,4,5],
    photos: [],
    loading: true,
    loadingImage: false
  }

  componentDidMount() {
    this.userPhotos()
  }


  userPhotos = async () => {
      //const { navigation } = this.props;
      console.warn('user photos')
      isSignedIn().then((token) => {
        api.userPhotos(JSON.parse(token))
            .then(res => {
              //firstName, genre, birthDate, email, occupation, description
              if(res.data && res.data.length > 0){
                this.setState({
                  loading: false,
                  photos: res.data,
                })

              } else {
                this.setState({
                  loading: false,
                })
              }
            })
            .catch(function(error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
             // ADD THIS THROW error
              throw error;
            });
        }
      );
  }

  photoActions = (index, photoId) => {
    Alert.alert(
      'O que gostaria de fazer?',
      null,
      [
        {text: 'Alterar essa imagem', onPress: () => this.changePhoto(index, photoId)},
        {text: 'Excluir essa imagem', onPress: () => this.deletePhoto(index, photoId), style: 'cancel'},
      ],
      { cancelable: true }
    )
  }

  changePhoto = (index, photoId) => {
    let photos = [...this.state.photos];
    let item = {...photos[index]};
    this.setState({loadingImage: true});
    this.setState({ ['selectedItem'+index]: true})
    const options = {
    quality: 0.8,
    maxWidth: 600,
    maxHeight: 600,
      storageOptions: {
        skipBackup: true,
      },
    };

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
      const photo = { uri: `data:${image.mime};base64,${image.data}`};
      isSignedIn().then((token) => {
        api.changePhoto(JSON.parse(token), { photo: photo, photoType: 'gallery', photoOrder: index, oldPhoto: photoId }).then(res => {
          this.setState({ ['selectedItem'+index]: false, loadingImage: false})
           console.warn(res);
           const {photoId, photoUrl} = res.data

           photos[index] = {
            photoId: res.data.photoId,  
            photoUrl:  `data:${image.mime};base64,${image.data}`
           }

           this.setState({photos});

          }).catch(err => console.warn(JSON.stringify(err)))
      });
    }).catch( err => {
      this.setState({loadingImage: false});
      this.setState({ ['selectedItem'+index]: false})
    });
  }

  deletePhoto = (index, photoId) => {
    this.setState({loadingImage: true});
    isSignedIn().then((token) => {
      api.deletePhoto(JSON.parse(token), { photoId: photoId }).then(res => {
        this.setState({loadingImage: false})
        console.warn(res)
          if(res.status == 'OK'){
            const photos = this.state.photos.filter((photo) => photo.photoId !== photoId)
            this.setState({ photos: photos })
          } else {
            Alert.alert('Não foi possível remover esta imagem. Por favor, tente novamente mais tarde.')
          }
        }).catch(err => console.warn(JSON.stringify(err)))
      });

  }

  render() {
      const { photos, loading, loadingImage } = this.state;
      const color = colorTheme.TEXT_MUTED //colorTheme.PRIMARY_COLOR;
      if(!loading){
        return (
          <SafeAreaView style={[styles.container]}>
            <AppAd style={styles.container}/>
            <ScrollView>
            {(loadingImage) &&
              <View style={styles.loadingContainer}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 25, paddingRight: 25 }}>
                  <ActivityIndicator color={colorTheme.PRIMARY_COLOR}/>
                </View>
              </View>
            }

              <View style={styles.bcontainer}>
                  {this.state.data.map((h, index) =>
                    <TouchableOpacity key={index} style={[styles.buttonContainer, styles.greybkg]} onPress={() => photos && photos[index] ? this.photoActions(index, photos[index].photoId) : this.changePhoto(index, null) }>
                      <View>
                          {/*<Input type="file"/>*/}
                          {photos && photos[index] ? <FastImage style={[{ width: 130, height: 135 }]} source={{ uri: photos[index].photoUrl }} /> :  <Image style={{ width: 40, height: 65, tintColor: '#D1D1D1' }} source={require('../../assets/images/photo-placeholder.png')} />}
                      </View>
                      {photos && photos[index] ?
                        <View style={styles.coverEdit}>
                          <FastImage style={{ height: 10, width: 10}} source={require('../../assets/images/edit-cover.png')} resizeMode="contain" />
                        </View> :
                        <View style={styles.coverEdit}>
                          <FastImage style={[{ width: 20, height: 20 }]} source={require('../../assets/images/icons/more-icon.png')} />
                        </View>
                        }
                        {this.state['selectedItem'+index]  &&
                        <View style={[styles.loadingImage]}>
                          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 25, paddingRight: 25 }}>
                            <ActivityIndicator color={colorTheme.PRIMARY_COLOR} />
                          </View>
                        </View>}
                  </TouchableOpacity>)
                  }
              </View>
            </ScrollView>
          </SafeAreaView>
        );
      } else {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 25, paddingRight: 25 }}>
            <ActivityIndicator color={colorTheme.PRIMARY_COLOR} />
          </View>
        )
      }
  }
}


const styles = StyleSheet.create({
  loadingImage: {
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.45)',
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3
  },

  loadingContainer: {
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.45)',
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3
  },


    container: {
        flex: 1,
        //margin: 15,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 30,
        color: colorTheme.PRIMARY_COLOR,
        marginTop: 10
    },
    space: {
        width: '100%',
        height: 50
    },
    subtitle: {
        fontSize: 18,
        color: '#A2A2A2'
    },
    help: {
        fontSize: 10,
        textAlign: 'center',
        color: colorTheme.PRIMARY_COLOR,
        margin: 20,
        fontWeight: 'bold'
    },
    bcontainer: {
        flex: 1,
        flexDirection: 'row',
        margin: 15,
        flexWrap: 'wrap',
        alignItems: 'flex-start' // if you want to fill rows left to right
    },
    buttonContainer: {
        width: '31%', // is 50% of container width
        margin: '1%',
        borderRadius: 5,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        height: 130,
        overflow: 'hidden'

    },
    pinkbkg: {
        backgroundColor: `rgba(247, 56, 89, 0.1)`,
        borderWidth: 2,
        borderColor: colorTheme.PRIMARY_COLOR,
    },
    greybkg: {
        backgroundColor: `rgba(234, 234, 234, 0.4)`,
        borderWidth: 2,
        borderColor: '#D1D1D1',
    },
    scrollContainer: {
        height: '100%',
        position: 'absolute',
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: 'red',
        borderColor: '#000',
        borderWidth: 3
    },
    coverEdit: {
      width: 17,
      height: 17,
      borderRadius: 32/ 2,
      position: 'absolute',
      bottom: 10,
      right: 10,
      zIndex: 4,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colorTheme.PRIMARY_COLOR
    },
});

/** Redux */
const mapStateToProps = state => {
  return {
    user: state.userData.user
  };
};


export default connect(
  mapStateToProps
)(Photos);
