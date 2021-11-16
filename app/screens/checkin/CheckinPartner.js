// Home screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, ScrollView, SafeAreaView, StyleSheet, Dimensions, TouchableOpacity, Share, Image, ImageBackground, ActivityIndicator } from 'react-native';
import colorTheme from '../../config/theme.style'
import  CustomButton  from '../../components/CustomButton';
import FastImage, { FastImageProps } from 'react-native-fast-image'


import moment from "moment";
import 'moment/locale/pt-br'
moment.locale('pt-br')


import { connect } from 'react-redux';
import { checkinData } from '../../../redux/actions/checkinActions'
import { noAthorized } from '../../components/Utils'

import api from './services'
//import all the components we are going to use.
const { width } = Dimensions.get('window');
const height = width * 1;
const screenHeight = Dimensions.get('window').height;

class CheckinPartner extends Component {
  constructor(props) {
       super(props)
       noAthorized(props)
       this.state = {
         checkin: [],
         loading: true,
         checkedIn: false,
         checkinId: null,
         companyId: props.route.params.companyId,
         autoCheckin: props.route.params && props.route.params.autoCheckin ? true : false,
         logoBackground: 'dark',
       }
    }

    componentDidMount() {
      this.getCheckin()
    }

    getCheckin = async (action) => {
        //const { navigation } = this.props;
        if(this.props.token){
          api.checkin(this.props.token, this.state.companyId)
              .then(res => {
                this.setState({
                  checkin: res.data[0],
                  loading: false,
                  checkinId: res.data[0].id,
                  checkedIn: (res.data[0].id) ? true : false,
                  checkinAt: null,
                  checkinAt: res.data[0].checkinAt
                 }, () => {
                   const {checkedIn, checkin, companyId, autoCheckin} = this.state;
                   if (!checkedIn && (checkin.companyId == companyId) && autoCheckin){
                    this.doCheck('in')
                  } else if(autoCheckin) {
                    this.props.navigation.navigate('CheckinCoupons', {companyId: companyId, title: checkin.companyName })
                  }
                 })
              })
              .catch(function(error) {
              console.log('There has been a problem with your fetch operation: ' + error.message);
               // ADD THIS THROW error
                throw error;
              });
          }
    }

    doCheck = async (action) => {
      const { checkinData, token } = this.props;
        api.doCheck(token, this.state.companyId, action, this.state.checkinId)
          .then(res => {
            if(res.data.action == 'checkin' ){
              this.setState({checkedIn: true, checkinId: res.data.checkinId, checkinAt: res.data.checkinAt})
              checkinData({
                checkedIn: true,
                checkinId: res.data.checkinId,
                checkinAt: res.data.checkinAt
              })

              const { navigation } = this.props;
              navigation.navigate('CheckinCoupons', {companyId: this.state.companyId, title: this.state.checkin.companyName })
            } else {
              checkinData({
                checkedIn: false,
                checkinId: null,
                checkinAt: null
              })

              this.setState({checkedIn: false, checkinId: null, checkinAt: null})
            }
          })
          .catch(function(error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
            // ADD THIS THROW error
            throw error;
          });
    }

  render() {
    const {checkin, loading, checkedIn, checkinAt, companyId} = this.state
    if(!loading){
      return (
        <SafeAreaView style={[styles.container]}>
          <View>
            <ImageBackground source={{uri: checkin.cover}} style={{ width: width, height: 200 }}>
              <View style={styles.topLogo}>
                <FastImage source={{uri: checkin.logo}} style={styles.logo} />
              </View>
            </ImageBackground>
            <View style={styles.checkinArea}>
              {(checkin.coupons == 1) ? (
                <Text style={styles.description}>Faça ckeck-in para aproveitar promoções e descobrir quem são os usuários que também fizeram checkin em {checkin.companyName}.</Text>
              ) :(checkin.coupons > 1) ? (
                <Text style={styles.description}>Faça ckeck-in para aproveitar promoções e descobrir quem são os usuários que também fizeram checkin em {checkin.companyName}.</Text>
              ) : null }
              {(!checkedIn && (checkin.companyId == companyId)) ?
                  <TouchableOpacity style={styles.button} onPress={() => this.doCheck('in')}>
                    <CustomButton  text={'Fazer check-in'}></CustomButton>
                  </TouchableOpacity>
                :
                <TouchableOpacity style={styles.button} onPress={() => this.doCheck('out')}>
                  <CustomButton  text={'Fazer check-out'}></CustomButton>
                </TouchableOpacity>

              }
              {(checkedIn) ?
                <View>
                  <Text style={styles.checkedIn}>Você fez checkin em {moment(checkinAt).format('DD/MM/YYYY HH:mm')}</Text>
                  <TouchableOpacity>
                    <Text style={styles.checkedInURL} onPress={() => {this.props.navigation.navigate('CheckinCoupons', {companyId: this.state.companyId, title: checkin.companyName })}}> Ver cupons disponóveis </Text>
                  </TouchableOpacity>
                </View>
                :
                null
              }
            </View>
            <View>
            </View>
          </View>
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    //marginRight: 20,
    //marginLeft: 20,
    //height: screenHeight - 80,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 70,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

  },
  bgDark: {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  bgLight: {
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  logo: {
    width: 95,
    height: 95,
    resizeMode: 'contain',
    padding: 20,
    borderRadius: 50
  },
  checkinArea: {
    marginTop: 20,
    marginRight: 20,
    marginLeft: 20,
  },
  topLogo: {
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#F1F1F1',
    borderWidth: 1

  },

  topDescriptionText: {
    fontSize: 18,
    color: '#FFF'
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: colorTheme.DARK_COLOR
  },
  expiration: {
    color: colorTheme.TEXT_MUTED,
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center'
  },

  learnMore: {
    fontSize: 16,
    marginBottom: 10,
    color: colorTheme.PRIMARY_COLOR,
    fontWeight: '600',
    textAlign: 'center'
  },
  code: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: '#F1F1F1',
    borderColor: '#d9d9d9',
    borderWidth: 1,
    padding: 10
  },
  checkedIn: {
    fontSize: 13,
    marginTop: 10,
    color: colorTheme.TEXT_MUTED,
    textAlign: 'center',
  },
  checkedInURL: {
    fontSize: 15,
    marginTop: 10,
    color: colorTheme.PRIMARY_COLOR,
    textAlign: 'center',
  }
});

/** Redux */
const mapStateToProps = state => {
  return {
    checkin: state.checkinData.checkin,
    token: state.userData.userToken
  };
};


const mapDispatchToProps = dispatch => {
  return {
    checkinData: checkin => {
        dispatch(checkinData(checkin))
      }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckinPartner);
