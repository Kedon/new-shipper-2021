// Setting screen
import React, { Component } from 'react';
//import react in our code.
import { Keyboard, Alert, Text, View, Image, SafeAreaView, StyleSheet, TouchableOpacity, StatusBar, ScrollView, NativeModules, FlatList, TouchableHighlight } from 'react-native';
//import all the components we are going to use.
import colorTheme from '../../config/theme.style'
import { Input, Button, ThemeProvider } from 'react-native-elements';
//import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import FastImage, { FastImageProps } from 'react-native-fast-image';


let theme = {
    colors: {
        primary: colorTheme.PRIMARY_COLOR,
    },
};

class AddPhotosPage extends React.Component {
    constructor(props) {
        super(props);
        // this.selectImage = this.selectImage.bind(this)
    }
    state = {
        data: [1,2,3,4,5],
        photos: []
    }
    componentDidMount = async () => {
        setTimeout(() => {
            Keyboard.dismiss();
        }, 200);
        // this.getPhotos()

    };
    //   getPhotos = () => {
    //     CameraRoll.getPhotos({
    //       first: 20,
    //       assetType: 'All'
    //     })
    //     .then(r => this.setState({ photos: r.edges }))
    //   }

    next = () => {
        const { navigation, route } = this.props;
        navigation.navigate('HobbiesPage', {
            email: route.params.email,
            name: route.params.name,
            birthDate: route.params.birthDate,
            password: route.params.password,
            genre: route.params.genre,
            ageRange: route.params.ageRange,
            looking: route.params.looking,
            distance: route.params.distance,
            photos: this.state.photos
        })
    }

    // selectImage() {
    //     ImagePicker.openCropper({
    //         path: this.state.image.uri,
    //         width: 200,
    //         height: 200
    //       }).then(image => {
    //         console.log('received cropped image', image);
    //         this.setState({
    //           image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
    //           images: null
    //         });
    //       }).catch(e => {
    //         console.log(e);
    //         Alert.alert(e.message ? e.message : e);
    //       });
    // }

    photoActions = (index, photoType) => {
        Alert.alert(
          'O que gostaria de fazer?',
          null,
          [
            {text: 'Alterar essa imagem', onPress: () => this.onOpenLibary(index, photoType)},
            {text: 'Excluir essa imagem', onPress: () => this.deletePhoto(index), style: 'cancel'},
          ],
          { cancelable: true }
        )
      }

      deletePhoto = (index) => {
        
        this.setState({photos: this.state.photos.filter((f,i) => i !== index )})
      }

    onOpenLibary = (index, photoType) => {
        //let photos = [...this.state.photos];
        //let item = {...photos[index]};
        //this.setState({loadingImage: true});
        //this.setState({ ['selectedItem'+index]: true})
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
          //const source = { uri: `data:${image.mime};base64,${image.data}`};
          const photo = `data:${image.mime};base64,${image.data}`;
          let photos = [...this.state.photos];
          photos[index] = {
            photoUrl: `data:${image.mime};base64,${image.data}`,
            uri: `data:${image.mime};base64,${image.data}`,
            photo: photo, //BASE64
            photoType: photoType,
            photoOrder: index
          };
           this.setState({photos});

        }).catch( err => {
          //this.setState({loadingImage: false});
          //this.setState({ ['selectedItem'+index]: false})
        });
      }

    /*onOpenLibary = (index, photoType) => {
      const options = {
        quality: 0.8,
        maxWidth: 600,
        maxHeight: 600,
          storageOptions: {
            skipBackup: true,
          },
      };
      let photos = [...this.state.photos];

        ImagePicker.launchImageLibrary(options, (response) => {
            // // Same code as in above section!
            // const source = { uri: response.uri };
            const source = { uri: 'data:image/jpeg;base64,' + response.data };

            // const source = { uri: 'data:image/jpeg;base64,' + response.data };
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
              const photo = { uri: 'data:image/jpeg;base64,' + response.data };
              console.warn(response.uri)
               //const photos = Object.assign(this.state.photos);
               //photos[idx] = source.uri;
               //this.setState({photos})

               //const {photoId, photoUrl} = res.data

               photos[index] = {
                photoUrl: response.uri,
                photo: photo, //BASE64
                photoType: photoType,
                photoOrder: index
              };

               this.setState({photos});

            }
        });
    }*/

    render() {
        const { state, goBack } = this.props.navigation;
        const { photos } = this.state
        return (
            <SafeAreaView style={[styles.container]}>
                <StatusBar
                    barStyle="default" />
                <ThemeProvider theme={theme}>
                    <TouchableOpacity onPress={() => goBack()}>
                        <Image style={{ width: 11, height: 20, tintColor: colorTheme.PRIMARY_COLOR }} source={require('../../assets/images/icons/bt-back.png')} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Minhas</Text>
                    <Text style={styles.subtitle}>Melhores fotos são:</Text>

                    <View style={styles.space}></View>

                    <ScrollView>
                        <View style={styles.bcontainer}>
                            {this.state.data.map((h, index) =>
                              (index == 0) ?
                              <TouchableOpacity key={`index_0`} style={[styles.buttonContainer, styles.pinkbkg]} onPress={() => photos && photos[index] ? this.photoActions(index, 'cover') : this.onOpenLibary(index, 'cover')}>
                                  <View>
                                      {photos && photos[index] && photos[index].photoUrl ? <FastImage style={[{ width: 130, height: 135 }]} source={{ uri: photos[index].photoUrl }} /> : <Image style={{ width: 40, height: 65, tintColor: colorTheme.PRIMARY_COLOR }} source={require('../../assets/images/profile-placeholder.png')} />}
                                  </View>
                              </TouchableOpacity>
                              :
                              <TouchableOpacity key={index} style={[styles.buttonContainer, styles.greybkg]} onPress={() => this.onOpenLibary(index, 'gallery')}>

                                <View>
                                    {/*<Input type="file"/>*/}
                                    {photos && photos[index] ? <FastImage style={[{ width: 130, height: 135 }]} source={{ uri: photos[index].photoUrl }} /> :  <Image style={{ width: 40, height: 65, tintColor: '#D1D1D1' }} source={require('../../assets/images/photo-placeholder.png')} />}

                                </View>
                                <FastImage style={[{ width: 20, height: 20, position: 'absolute', bottom: 10, right: 10 }]} source={require('../../assets/images/icons/more-icon.png')} />
                            </TouchableOpacity>)
                            }



                        </View>
                        <Text style={styles.help}>Perfis com fotos recebem até 90% mais likes do que perfis sem fotos.</Text>

                    </ScrollView>


                    {/* <View style={styles.container}>
                        {
                            this.state.photos.map((p, i) => {

                                <TouchableHighlight
                                    style={{ opacity: i === this.state.index ? 0.5 : 1 }}
                                    key={i}
                                    underlayColor='transparent'
                                    onPress={() => this.setIndex(i)}
                                >
                                    <Image
                                        style={{
                                            width: width / 3,
                                            height: width / 3
                                        }}
                                        source={{ uri: p.node.image.uri }}
                                    />
                                </TouchableHighlight>

                            })
                        }

                    </View> */}
                    <View style={styles.actionButton}>
                        <Button title='Continuar' onPress={this.next} />
                        <Button title='Pular' type="clear" onPress={this.next} />
                    </View>

                </ThemeProvider>


            </SafeAreaView>

        );
    }
}
export default (AddPhotosPage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 15,
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
        fontSize: 12,
        textAlign: 'center',
        color: colorTheme.PRIMARY_COLOR,
        margin: 20,
        fontWeight: 'bold'
    },
    bcontainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start' // if you want to fill rows left to right
    },
    buttonContainer: {
        width: '31%', // is 50% of container width
        margin: '1%',
        borderRadius: 5,
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
});
