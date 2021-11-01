// Setting screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, Image, TouchableOpacity, Animated, StyleSheet, Dimensions, ScrollView, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { List, ListItem, Avatar } from 'react-native-elements';
import  UserDetailsModal  from './UserDetailsModal';
import FastImage, { FastImageProps } from 'react-native-fast-image'
import { BlurView, VibrancyView } from "@react-native-community/blur";
import  Packages  from './Packages';


import moment from "moment";
import { whileStatement } from '@babel/types';
const { width } = Dimensions.get('window');
import colorTheme from '../config/theme.style';

import { connect } from 'react-redux';

//import all the components we are going to use.

class LikeContacts extends Component {
    constructor(props) {
      super(props);
      this.state = {
        items: this.props.items,
        showPackageModal: false
      }
    }

  showUserDetails(userId){
       this.refs.details.open(userId);
   }
   showModal() {
    this.setState({showPackageModal: true})
   }

   hideModal() {
    this.setState({showPackageModal: false})
   }


    render() {
        const { navigation, items, user } = this.props;
        const { showPackageModal, hideModal } = this.state
        return (
          <View style={styles.container}>
            {items.map((item, index) =>
              <TouchableOpacity key={index} style={styles.card} onPress={() => {
                  (user && user.packages && user.packages.level < 2 || user && user.packages && user.packages.level == null) ?
                    this.showModal() :
                    this.showUserDetails(item.userId)
                }}>
                <View style={styles.cardContent}>
                <Image
                    style={styles.image}
                    source={item.photos[0] && { uri: item.photos[0].photoUrl }}
                    PlaceholderContent={<ActivityIndicator />}
                    blurRadius={(user && user.packages && user.packages.level < 2 || user && user.packages && user.packages.level == null) && 10}
                  />
                  <View style={styles.userInfo}>
                    {(user && user.packages && user.packages.level < 2 || user && user.packages && user.packages.level == null) ? 
                    null
                    :
                    <View
                      style={styles.absoluteView}
                      blurType="dark"
                      blurAmount={1}
                    >

                      <View style={styles.chatHeader}>
                        <View style={styles.label}>
                          <Text style={styles.title}>{(item.birthDate) ? item.firstName.split(' ')[0].replace(' ', '')+', ' + moment().diff(item.birthDate, 'years') : item.firstName}</Text>
                        </View>
                      </View>
                      <Text style={styles.userLocale} >
                        {item.location.city}/{item.location.state}
                      </Text>
                    </View>
                  }
                  </View>
                  <Text style={styles.time}>{moment(item.createdAt).format('DD/MM')}</Text>
                  {/*(user && user.packages && user.packages.level < 2 || user && user.packages && user.packages.level == null) &&
                    <BlurView
                    style={styles.absolute}
                    viewRef={this.state.viewRef}
                    blurType="light"
                    blurAmount={10}
                    reducedTransparencyFallbackColor="white"
                      />

                  */}
                </View>
              </TouchableOpacity>
            )}
            <UserDetailsModal ref="details" />
            <Packages modalVisible ={showPackageModal} onPressClose={(v)=> this.hideModal(v)} />

          </View>
        );
    }
}


const styles = {
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  card: {
      backgroundColor: '#F4F4F4',
      width: (width / 2) - 15,
      height: 220,
      marginLeft: 10,
      marginTop: 10,
      position: 'relative',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowOffset: { height: 2.5, width: 0 },
    },
    cardContent: {
        backgroundColor: '#F4F4F4',
        width: '100%',
        height: '100%',
        position: 'absolute',
        borderRadius: 10,
        overflow: 'hidden'
      },
    image: {
      width: '100%',
      height: '100%',
      position: 'absolute',
    },
    userInfo: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
        padding: 8,
    },
    absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
      absoluteView: {
      position: "absolute",
      left: 0,
      bottom: 0,
      right: 0,
      padding: 8,
      backgroundColor: 'rgba(0,0,0,0.58)'

    },
    itemList: {
      width: width
    },
    chatHeader: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: 2
    },
    label: {

    },
    title: {
      fontWeight: '600',
      fontSize: 13,
      color: '#FFF'
    },
    userLocale: {
      fontWeight: '400',
      fontSize: 11,
      color: '#FFF'
    },
    location: {
      flexDirection: 'row',
      alignItems: 'center',
      flexGrow: 2,
      flexShrink: 1
    },
    city: {
      fontWeight: '400',
      fontSize: 13,
      color: colorTheme.TEXT_MUTED,
    },
    time: {
      fontWeight: '700',
      fontSize: 11,
      color: '#FFF',
      padding: 5,
      right: 5,
      borderRadius: 5,
      top: 5,
      backgroundColor: colorTheme.PRIMARY_COLOR,
      position: 'absolute',
      zIndex: 3
    },

    chatBody: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'flex-start',
      marginBottom: 5
    },
    account: {
      position: 'relative',
    },
    accountStatus: {
      width: 12,
      height: 12,
      position: 'absolute',
      zIndex: 2,
      borderRadius: 10,
      bottom: 0,
      right: 0,
      borderColor: '#FFF',
      borderWidth: 2
    },
    online: {
      backgroundColor: '#00FF00',
    },
    offline: {
      backgroundColor: 'red',
    },
    avatarContainer: {
      backgroundColor: '#FFF',
    },
    avatarStyle: {
      backgroundColor: '#FFF',
    },
    subtitle: {
      flexGrow: 2,
      flexShrink: 1,
      fontWeight: '400',
      fontSize: 14,
      marginRight: 5,
      color: colorTheme.TEXT_MUTED
    },
    unread: {
      padding: 3,
      color: '#fff',
      textAlign: 'center',
      minWidth: 20,
      height: 20,
      fontSize: 11,
      borderRadius: 10,
      fontWeight: 600,
      backgroundColor: colorTheme.PRIMARY_COLOR
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
)(LikeContacts));
