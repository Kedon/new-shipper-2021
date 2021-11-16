// Home screen
import React, { Component } from 'react';
//import react in our code.
import { Image, Text, View, SafeAreaView, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Share, ActivityIndicator } from 'react-native';
import colorTheme from '../../config/theme.style'
import  CustomButton  from '../../components/CustomButton';
import  CouponsCard  from '../../components/CouponsCard';
import api from './services'
import moment from "moment";
import { noAthorized } from '../../components/Utils'
import  EmptyState  from '../../components/EmptyState';
import { connect } from 'react-redux';


//import all the components we are going to use.
const { width } = Dimensions.get('window');
const height = width * 1;
const screenHeight = Dimensions.get('window').height;
class CheckinCoupons extends Component {
  constructor(props) {
    super(props);
    noAthorized(props)
    this.state = {
      checkin: [],
      loading: true,
      company: [],
      companyId: props.route.params.companyId,
    }
  }

  onShare = async () => {
    try {
      const result = await Share.share({
        title: 'Shipper, App de relacionamento inovador',
        message: 'Encontre pessoas disponíveis no App e conheça nos lugares mais badalados da sua cidade.',
        url: 'https://shipper.com/r/7gtEIYYZ6g',//URL INDIVIDUAL DO USUÁRIO
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };


  componentDidMount() {
    this.companyCoupons()
  }

  companyCoupons = async (action) => {
      //const { navigation } = this.props;
      if(this.props.token){
        api.companyCoupons(this.props.token, this.state.companyId)
            .then(res => {
              this.setState({
                loading: false,
                company: res.data[0]
               })
            })
            .catch(function(error) {
             // ADD THIS THROW error
              throw error;
            });
        }
  }




  render() {
    const { company, loading } = this.state;

    if(!loading) {
      return (
        <SafeAreaView style={[styles.container]}>
          <View>
            {/*<View style={styles.location}>
              <Image source={require('../../assets/images/icons/pin.png')} style={styles.searchPic, { width: 20, height: 24, tintColor: colorTheme.TEXT_MUTED, marginRight: 3 }}/>
              <Text style={styles.address}>{company.address}</Text>
            </View>*/}
            <ScrollView contentContainerStyle={styles.container}>
              {!company.coupons ?
                <View style={{flex: 1, height: '100%'}}>
                  <EmptyState title={'Ainda não temos campanhas ativas!'} description={'Faça check-in e fique conectado, em breve teremos surpresas por aqui.'} width={250} height={250} illustration={require('../../assets/images/no_chat.png')}/>
                </View>
                  :
                <CouponsCard items={company.coupons} backScreen='CheckinCoupons' navigation={this.props.navigation} />
              }
            </ScrollView>

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
  },
  location: {
    flexDirection: "row",
    alignItems: 'center',
    paddingRight: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    color: colorTheme.PRIMARY_COLOR,
    borderBottomColor: '#ededed',
    borderBottomWidth: 1,

  },
  address: {
    color: colorTheme.TEXT_MUTED,
    marginHorizontal: 20
  }
});


/** Redux */
const mapStateToProps = state => {
  return {
    token: state.userData.userToken
  };
};


export default (connect(
  mapStateToProps,
)(CheckinCoupons))
