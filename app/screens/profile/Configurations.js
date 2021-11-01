// Home screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, Modal, ScrollView, SafeAreaView, StyleSheet, StatusBar, Dimensions, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import colorTheme from '../../config/theme.style'
import AsyncStorage from '@react-native-community/async-storage';
import AppAd from '../../components/AppAd';
import Switches from '../../components/Switches';
import TextField from '../../components/TextField';
import TextArea from '../../components/TextArea';
import DateTime from '../../components/DateTime';
import Select from '../../components/Select';
import CustomButton from '../../components/CustomButton';
import { onSignOut, isSignedIn } from '../../config/auth'
import api from './services'
import { noAthorized } from '../../components/Utils'
import { connect } from 'react-redux';
import { userDataUpdate,  userData, userToken } from '../../../redux/actions/userActions';
import { preferencesData } from '../../../redux/actions/preferencesActions'



import OneSignal from 'react-native-onesignal';
import moment from 'moment'
import { Picker } from '@react-native-community/picker'

//import all the components we are going to use.
const { width } = Dimensions.get('window');
const height = width * 1;
const screenHeight = Dimensions.get('window').height;

class Configurations extends Component {
  constructor(props) {
    super(props)
    noAthorized(props)
  }
  state = {
    firstName: null,
    genre: null,
    birthDate: null,
    email: null,
    occupation: null,
    description: null,
    loading: true,
    visibility: null,
    stopNotification: false,
    modalVisible: false,
    showBirthdayModal: false,
    showGenreList: false,
    changeVisibility: false,
    genres: [
      {
        id: 'masculino',
        label: 'Masculino',
        value: 'MALE'
      },
      {
        id: 'femnino',
        label: 'Feminino',
        value: 'FEMALE'
      }
    ]
  }

  componentDidMount() {
    this.userConfigurations()
  }

  componentWillUnmount() {
    const { firstName, genre, birthDate, email, occupation, description, visibility, stopNotification } = this.state
    this.updateUserConfigurations({
      firstName: firstName,
      genre: genre,
      birthDate: moment(birthDate).format('YYYY-MM-DD'),
      email: email,
      occupation: occupation,
      description: description,
      visibility: visibility || visibility === 1 ? 1 : 0,
      stopNotification:  stopNotification || stopNotification === 1 ? 1 : 0
    })
  }

  onchange = (id, value) => {
    this.setState({ [id]: value }, () => {
      
    })

  }

  onchangeNotification = (id, value) => {
    /**
     * Update State to receice / stop push notification
     */
    this.setState({ stopNotification: value })

  }


  userConfigurations = async (action) => {
    //const { navigation } = this.props;
    const { firstName, genre, birthDate, email, occupation, description, visibility } = this.state
      api.userConfigurations(this.props.user.userToken)
        .then(res => {
          //firstName, genre, birthDate, email, occupation, description
          this.setState({
            loading: false,
            firstName: res.data[0].firstName,
            genre: res.data[0].genre,
            birthDate: res.data[0].birthDate,
            email: res.data[0].email,
            occupation: res.data[0].occupation,
            description: res.data[0].description,
            visibility: res.data[0].visibility,
            stopNotification: res.data[0].stopNotification
          })

        })
        .catch(function (error) {
          console.log('There has been a problem with your fetch operation: ' + error.message);
          // ADD THIS THROW error
          throw error;
        });
  }

  updateUserConfigurations = async (params) => {
    //const { navigation } = this.props;
    const { firstName, genre, birthDate, email, occupation, description, visibility, stopNotification, changeVisibility } = this.state

    isSignedIn().then((token) => {
      api.updateUserConfigurations(JSON.parse(token), params)
        .then(res => {
          const { userDataUpdate } = this.props;
          userDataUpdate(params)
          OneSignal.sendTag('USER', !stopNotification ? this.props.user.userId : `not-receiving`)
          if(changeVisibility){
            const { navigation } = this.props;
            navigation.navigate('Timeline', { data: {} })
          }
        })
        .catch(function (error) {
          console.log('There has been a problem with your fetch operation: ' + error.message);
          // ADD THIS THROW error
          throw error;
        });
    }
    );
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  logOut = () => {
    onSignOut().then(data => {
      const { userData, preferencesData, userToken } = this.props;
      userData([])
      preferencesData([])
      userToken(null)
      this.props.navigation.navigate('Timeline')
    })
  }
  setSelectedValue(value) {
    //alert(value)
  }
  handleShowGenre() {
    this.setState({showGenreList: !this.state.showGenreList})
  }

  terminateAccount = () => {
    isSignedIn().then((token) => {
      api.terminateAccount(JSON.parse(token), this.props.user.userId)
        .then(res => {
          if(res.status === 'OK'){
            this.logOut()
          }
        })
        .catch(function (error) {
          console.log('There has been a problem with your fetch operation: ' + error.message);
          // ADD THIS THROW error
          throw error;
        });
    }
    );
  }

  changeVisibility = () => {
    this.setState({ visibility: true, changeVisibility: true }, () => {
      const { firstName, genre, birthDate, email, occupation, description, visibility, stopNotification, changeVisibility } = this.state
      this.updateUserConfigurations({
        firstName: firstName,
        genre: genre,
        birthDate: moment(birthDate).format('YYYY-MM-DD'),
        email: email,
        occupation: occupation,
        description: description,
        visibility: visibility || visibility === 1 ? 1 : 0,
        stopNotification:  stopNotification || stopNotification === 1 ? 1 : 0
      })

      this.setModalVisible(false)
  
    })
  }


  render() {
    const { firstName, genre, birthDate, email, occupation, description, loading, visibility, genres, showBirthdayModal, showGenreList, stopNotification } = this.state
    if (!loading) {
      return (
        <SafeAreaView style={[styles.container]}>
          <AppAd style={styles.container} />
          <ScrollView>
            <View>
              <TextField
                textFieldId={"firstName"}
                label={'Nome: '}
                placeholder={'Diga o seu nome completo '}
                value={firstName}
                onChange={this.onchange}
                ref="change" />
              <Select
                selectId={"genre"}
                label={'Gênero: '}
                placeholder={'Qual é o seu gênero? '}
                options={genres}
                selected={genre}
                selectGenre={(value)=>this.setState({genre: value, showGenreList: false})}
                showGenreList={showGenreList}
                clickShowGenresList={()=> this.handleShowGenre()}
                value={genre == 'MALE' ? 'Masculino' : 'Feminino'}
                ref="change" />
              <DateTime
                dateTimeId={"birthDate"}
                label={'Nascimento: '}
                placeholder={'Em que data você nasceu? '}
                value={birthDate}
                onCancel={()=> this.setState({ showBirthdayModal: false })}
                onPress={() => this.setState({ showBirthdayModal: true })}
                showModal={showBirthdayModal}
                setDate={(value) => this.setState({ birthDate: value, showBirthdayModal: false })}
                // onChange={this.onchange}
                ref="change" />
              <TextField
                textFieldId={"email"}
                label={'Email: '}
                placeholder={'Endereço de email válido'}
                value={email}
                onChange={this.onchange}
                ref="change" />
              <TextField
                textFieldId={"occupation"}
                label={'Ocupação: '}
                placeholder={'Qual a sua profissão? '}
                value={occupation}
                onChange={this.onchange}
                ref="change" />
              <TextArea
                textAreaId={"description"}
                label={'Sobre mim: '}
                keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                placeholder={'Fale um pouco sobre você, como gosta de se divertir e o que faz quando não está trabalhando '}
                multiline={true}
                numberOfLines={4}
                value={description}
                onChange={this.onchange}
                ref="change" />
            </View>
            <View>
              <View style={styles.label}>
                <Text style={styles.title}>VISIBILIDADE:</Text>
              </View>

            </View>
            <View style={styles.switchContainer}>
              <Switches
                switchId={'visibility'} //same state element name
                switchValue={visibility === 1 || visibility ? true : false}
                switchLabel={"Ocultar o meu perfil"}
                switchDescription={'Você não será mais visto e nem poderá ver os outros perfis, a menos que seja VIP.'}
                onChange={this.onchange}
                ref="change"
              />
            </View>

            <View style={styles.switchContainer}>
              <Switches
                switchId={'stopNotification'} //same state element name
                switchValue={stopNotification === 1 ? true : false}
                switchLabel={'Notificações'}
                switchDescription={'Quando esta opção estiver marcada, você não receberá notificações quando outro usuário enviar mensagens para você.'}
                onChange={this.onchangeNotification}
                ref="change"
              />
            </View>
            <TouchableOpacity onPress={this.logOut}>
              <Text style={styles.logout}>SAIR</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              this.setModalVisible(true);
            }}>
              <Text style={styles.terminate}>ENCERRAR CONTA</Text>
            </TouchableOpacity>
            <View>
              <Modal
                style={{ marginTop: 22 }}
                animationType="slide"
                transparent={false}
                visible={this.state.modalVisible}>
                <View style={styles.modalContainer}>
                  <View style={styles.modalComponent}>
                    <Text style={styles.modalTitle}>Tem certeza?</Text>
                    <Text style={[styles.modalParagraph, styles.modalSpaceBottom]}>Ao excluir sua conta, todos os seus dados e conversas de chat serão apagados e não poderão mais ser recuperados.</Text>
                    <Text style={[styles.modalParagraph, styles.modalSpaceBottom]}>Você tem a opção de ocultar o seu perfil e não aparecer mais na timeline nem ficará mais disponível para chat.</Text>
                    <Text style={[styles.modalParagraph, styles.modalSpaceBottom]}>Tem certeza de que deseja encerrar definitivamente a sua conta?</Text>
                    <View style={styles.buttons}>
                      <TouchableOpacity style={styles.button} onPress={this.changeVisibility}>
                        <CustomButton text={'Desativar conta'}></CustomButton>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.button} onPress={() => {
                        this.setModalVisible(false);
                      }}>
                        <CustomButton text={'Fechar'}></CustomButton>
                      </TouchableOpacity>
                    </View>
                    <View>
                      <TouchableOpacity onPress={() => {
                        this.setModalVisible(false);
                      }}>
                        <Text style={[styles.terminate, styles.modalSpaceTop]} onPress={this.terminateAccount}>Encerrar conta</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    } else {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 25, paddingRight: 25 }}>
          <ActivityIndicator />
        </View>
      );
    }
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderColor: '#000',
    position: 'absolute',
    width: '100%',
    height: '100%',

  },
  switchContainer: {
    borderTopWidth: 0.5,
    borderTopColor: '#D8D8D8',
  },
  title: {
    color: colorTheme.DARK_COLOR
  },
  label: {
    display: 'flex',
    flexDirection: 'row',
    padding: 15,
    backgroundColor: colorTheme.EXTRA_LIGHT_COLOR
  },
  highLight: {
    color: colorTheme.PRIMARY_COLOR,
    paddingLeft: 3,
    paddingRight: 3
  },
  rangeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: '#D8D8D8',
    borderBottomColor: '#D8D8D8',


  },

  rangeSlider: {
    width: width - 30,
    height: 50,
    paddingTop: 5,
    paddingBottom: 5
  },
  userInfo: {
    width: '100%',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 45,
    marginBottom: 15,
    borderBottomWidth: 0.2,
    borderBottomColor: colorTheme.TEXT_MUTED
  },
  profileInfo: {
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',

  },
  button: {
    backgroundColor: colorTheme.PRIMARY_COLOR,
    borderRadius: 5,
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
    padding: 12,
    textAlign: 'center',
    alignItems: 'center',
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
    marginBottom: 10
  },
  coverPhoto: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    position: 'absolute'
  },
  coverEdit: {
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
    position: 'absolute',
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorTheme.PRIMARY_COLOR
  },
  userDesc: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  userLocation: {
    fontSize: 13,
    fontWeight: '400',
    color: colorTheme.TEXT_MUTED
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
  text: {
    fontSize: 30,
    alignSelf: 'center',
    color: 'red'
  },
  logout: {
    color: colorTheme.PRIMARY_COLOR,
    textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 5
  },
  terminate: {
    color: colorTheme.TEXT_MUTED,
    textAlign: 'center',
    paddingTop: 5,
    paddingBottom: 10
  },
  modalContainer: {
    backgroundColor: Platform.OS === 'ios' ? '#00000066' : 'transparent',
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalComponent: {
    justifyContent: 'center',
    width: '100%',
    height: 'auto',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 25
  },
  modalTitle: {
    fontSize: 22,
    color: colorTheme.PRIMARY_COLOR,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600'
  },
  modalParagraph: {
    fontSize: 16,
    lineHeight: 20,
    color: colorTheme.TEXT_MUTED
  },
  modalSpaceBottom: {
    marginBottom: 10,
  },
  modalSpaceTop: {
    marginTop: 10,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginRight: 5,
    marginLeft: 5,
    width: '50%'
  }
});


const mapStateToProps = state => {
  return {
    user: state.userData,
  };
};


const mapDispatchToProps = dispatch => {
  return {
    userDataUpdate: user => {
      dispatch(userDataUpdate(user))
    },
    userData: user => {
      dispatch(userData(user))
    },
    preferencesData: user => {
      dispatch(preferencesData(user))
    },
    userToken: token => {
      dispatch(userToken(token))
    }
  };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Configurations);

