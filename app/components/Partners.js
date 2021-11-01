// Setting screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, Image, TouchableOpacity, Animated, StyleSheet, Dimensions, ScrollView, FlatList, SafeAreaView } from 'react-native';
import { List, ListItem, Avatar } from 'react-native-elements';
import { whileStatement } from '@babel/types';
import colorTheme from '../config/theme.style'
import moment from "moment";
import FastImage, { FastImageProps } from 'react-native-fast-image'
//import all the components we are going to use.
const { width } = Dimensions.get('window');

const list = [
  {
    name: 'Amy Farha',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Vice President'
  },
  {
    name: 'Chris Jackson',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman'
  },
]

class Partners extends Component {
    
    render() {
        const { navigation, route, items } = this.props;


        return (
          <React.Fragment>

            <FlatList style={styles.itemList}
              data={items}
              keyExtractor={item => item.companyId}
              renderItem={({ item }) => {
                return (
                  /*<ListItem onPress={() => navigation.navigate('CheckinPartner', {companyId: item.companyId, companyName: item.companyName })}
                    friction={90}
                    tension={100}
                    activeScale={0.95} //
                    leftAvatar={
                      <View style={{borderRadius: 40, overflow: 'hidden'}}>
                          <FastImage
                              style={styles.avatarStyle}
                              source={item.logo && { uri: item.logo }}
                            />
                        </View>
                    }
                    key={item.id}
                    title={
                      <View style={styles.partner}>
                        <View style={styles.partnerName}>
                          <Text style={styles.title} numberOfLines={1}>{item.companyName}</Text>
                        </View>
                        <View style={styles.distance}>
                          <Image source={require('../assets/images/icons/pin.png')} style={styles.searchPic, { width: 10, height: 12, tintColor: 'red', marginRight: 3 }}/>
                          <Text style={styles.distanceLabel}>{item.distance.toFixed(0)} km</Text>
                        </View>
                      </View>
                    }
                    titleStyle={styles.title}
                    subtitle={
                      <View>
                        <View style={styles.subtitleView}>
                          <Text style={styles.subtitle} numberOfLines={2}>{item.address}</Text>
                        </View>
                        <View style={styles.highlight}>
                          {(item.checkins == 1) ? (
                              <Text style={styles.checkins}>{item.checkins} checkin</Text>
                          ) : (item.checkins > 1) ? (
                              <Text style={styles.checkins}>{item.checkins} checkins</Text>
                          ) : null }
                          {(item.coupons == 1) ? (
                              <Text style={styles.promotions} numberOfLines={1}>{item.coupons} cupom disponível</Text>
                          ) : (item.coupons > 1) ? (
                              <Text style={styles.promotions} numberOfLines={1}>{item.coupons} cupons disponíveis</Text>
                          ) : null }
                        </View>
                      </View>
                    }
                    subtitleStyle={styles.subtitle}
                    bottomDivider

                  />*/
                <ListItem key={item.id} bottomDivider onPress={() => this.props.onPress('CheckinPartner', {companyId: item.companyId, companyName: item.companyName })}>
                    <View style={{borderRadius: 40, overflow: 'hidden'}}>
                    <FastImage
                        style={styles.avatarStyle}
                        source={item.logo && { uri: item.logo }}
                      />
                  </View>
                    <ListItem.Content>
                      <ListItem.Title>
                      <View style={styles.partner}>
                        <View style={styles.partnerName}>
                          <Text style={styles.title} numberOfLines={1}>{item.companyName}</Text>
                        </View>
                        <View style={styles.distance}>
                          <Image source={require('../assets/images/icons/pin.png')} style={styles.searchPic, { width: 10, height: 12, tintColor: 'red', marginRight: 3 }}/>
                          <Text style={styles.distanceLabel}>{item.distance.toFixed(0)} km</Text>
                        </View>
                      </View>
                      </ListItem.Title>
                      <ListItem.Subtitle>
                      <View>
                        <View style={styles.subtitleView}>
                          <Text style={styles.subtitle} numberOfLines={2}>{item.address}</Text>
                        </View>
                        <View style={styles.highlight}>
                          {(item.checkins == 1) ? (
                              <Text style={styles.checkins}>{item.checkins} checkin</Text>
                          ) : (item.checkins > 1) ? (
                              <Text style={styles.checkins}>{item.checkins} checkins</Text>
                          ) : null }
                          {(item.coupons == 1) ? (
                              <Text style={styles.promotions} numberOfLines={1}>{item.coupons} cupom disponível</Text>
                          ) : (item.coupons > 1) ? (
                              <Text style={styles.promotions} numberOfLines={1}>{item.coupons} cupons disponíveis</Text>
                          ) : null }
                        </View>
                      </View>
                      </ListItem.Subtitle>
                    </ListItem.Content>
                  </ListItem>
                );
              }}
            />
            </React.Fragment>
        );
    }
}


const styles = {
    itemList: {
      width: width
    },
    partner: {
      flexDirection: "row",
      width: '100%',
    },
    distance: {
      flexDirection: "row",
      alignItems: 'center',
      color: colorTheme.PRIMARY_COLOR
    },
    distanceLabel: {
      color: colorTheme.PRIMARY_COLOR
    },
    partnerName: {
      flexGrow: 1,
    },
    title: {
      fontWeight: '600',
      fontSize: 17,
      marginBottom: 3,
      width: width - 190,
      color: colorTheme.DARK_COLOR
    },
    avatarContainer: {
      backgroundColor: '#FFF',
    },
    avatarStyle: {
      backgroundColor: '#f1f1f1',
      width: 80,
      height: 80,
      borderColor: '#F1F1F1',
      borderWidth: 1
    },
    subtitle: {
      fontSize: 14,
      color: colorTheme.TEXT_MUTED,
      marginBottom: 8

    },
    expiration: {
      fontSize: 14,
      color: colorTheme.TEXT_MUTED,
      fontWeight: '600'
    },
    checkins: {
      color: colorTheme.PRIMARY_COLOR,
      marginRight: 15
    },
    promotions: {
      color: colorTheme.PRIMARY_COLOR
    },
    highlight: {
      flexDirection: "row",
      alignItems: 'center',
    }
};

export default (Partners);
