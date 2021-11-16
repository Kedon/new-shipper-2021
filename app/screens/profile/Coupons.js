// Home screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, SafeAreaView, StyleSheet, Dimensions, TouchableOpacity, Share, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import colorTheme from '../../config/theme.style'
import  CustomButton  from '../../components/CustomButton';
import  CouponsCard  from '../../components/CouponsCard';
import { onSignIn, isSignedIn } from '../../config/auth'
import  EmptyState  from '../../components/EmptyState';

import api from './services'
import moment from "moment";
import { noAthorized } from '../../components/Utils'
//import all the components we are going to use.
const { width } = Dimensions.get('window');
const height = width * 1;
const screenHeight = Dimensions.get('window').height;
export default class Invite extends Component {
  constructor(props) {
    super(props)
    noAthorized(props)
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
      console.log(error.message);
    }
  };

  state = {
    checkin: [],
    loading: true,
    coupons: [],
    current_page: 1,
    offset: 0,
    refreshing: false,
  }
  componentDidMount() {
    this.userCoupons()
  }

  userCoupons = async (action) => {
      //const { navigation } = this.props;
      isSignedIn().then((token) => {
        api.userCoupons(JSON.parse(token), {current_page: this.state.current_page, offset: this.state.offset})
            .then(res => {
              this.setState({
                loading: false,
                loadingMore: false,
                refreshing: false,
                coupons: [...this.state.coupons, ...res.data.coupons],
                //coupons: res.data.coupons,
                current_page: res.pagination.next_page,
                offset: res.pagination.offset,
               })
            })
            .catch(function(error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
             // ADD THIS THROW error
              throw error;
            });
        }
      );
  }

  isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };


  loadOldCoupons = () => {
    this.setState({loadingMore: true})
    this.userCoupons()
  }

  _onRefresh = async () => {
    this.setState({
      current_page: 1,
      offset: 0,
      coupons: [],
      refreshing: true
    }, () => this.userCoupons())

  }


  render() {
    const { coupons, loading, loadingMore, refreshing } = this.state;

    if(!loading) {
      return (
        <SafeAreaView style={[styles.container]}>
        <ScrollView
          style={styles.scrollContainer}
          onScroll={({nativeEvent}) => {
            if (this.isCloseToBottom(nativeEvent)) {
              this.loadOldCoupons();
            }
          }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          {coupons && coupons.length > 0 ? 
          <CouponsCard items={coupons} backScreen='Coupons' navigation={this.props.navigation} />
        :
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 25, paddingRight: 25, height: screenHeight - 80 }}>
          {!refreshing ? <EmptyState title={'Nenhum cupom ativo'} description={'Ative cupons de promoções e encotre-os aqui.'} width={250} height={250} illustration={require('../../assets/images/no_contact.png')}/> : null}
        </View>

      }
            
            {(loadingMore) &&
              <View style={{ padding: 25 }}>
                <ActivityIndicator />
              </View>
            }
          </ScrollView>
        </SafeAreaView>
      );
    } else {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 25, paddingRight: 25 }}>
          <ActivityIndicator color={colorTheme.PRIMARY_COLOR} />
        </View>
      );
    }
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContainer: {
    height: '100%',
    paddingBottom: 90
  },

});
