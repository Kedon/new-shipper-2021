// Setting screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, Image, TouchableOpacity, TouchableHighlight, Animated, StyleSheet, Dimensions, ScrollView, FlatList, SafeAreaView } from 'react-native';
import { List, ListItem, Avatar } from 'react-native-elements';
import { whileStatement } from '@babel/types';
import colorTheme from '../config/theme.style';
import moment from "moment";
import FastImage, { FastImageProps } from 'react-native-fast-image'
import { connect } from 'react-redux';
import { activeChat } from '../../redux/actions/chatsActions'
import Swipeable from 'react-native-swipeable';
import firestore from '@react-native-firebase/firestore';
import { onSignIn, isSignedIn } from '../config/auth';

import api from '../screens/chat/services/index'
import { TextInputMaskMethods } from 'react-native-masked-text';


const { width } = Dimensions.get('window');

//import all the components we are going to use.

class ChatContacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.items,
      userPhotos: []
    }
  }

  goToChat = (user, chatName, cover) => {
    const { navigation } = this.props;
    navigation.navigate('ChatRoom', { user, chatName, cover })
    this.props.activeChat(user)
  };

  handleBlockContact = (contact) => {
    const property = this.props.user.userId === contact.owner.userId ? 'owner' : 'guest'
    if (property && property === 'owner') {
      firestore().collection("Contacts").doc(contact.contactId).update({ "guest.blocked": !contact.guest.blocked })
    } else if (property && property === 'guest') {
      firestore().collection("Contacts").doc(contact.contactId).update({ "owner.blocked": !contact.owner.blocked })
    }
  }

  componentDidMount() {
    isSignedIn().then(async (token) => {
      try {
        let res = await api.chatCoverPhotos(JSON.parse(token))
        //alert(JSON.stringify(res))
        this.setState({
          userPhotos: res.data
        })
      } catch (error) {
        alert(JSON.stringify(error))
      }

    })
  }

  render() {
    const { navigation, items } = this.props;
    const { userPhotos } = this.state
    const userCover = (userId) => {
      const cover = userPhotos && userPhotos.length > 0 && userPhotos.filter(f => f.receiverUserId === userId)
      return cover
    }

    return (
      <View>
        {/*<FlatList style={styles.itemList}
              data={items}
              keyExtractor={item => item.contactId}
              renderItem={({ item }) => {
                const displayUser = this.props.user.userId === item.owner.userId ? item.guest : item.owner
                const contactUser = this.props.user.userId === item.owner.userId ? item.owner : item.guest
                return (
                  
                );
              }}
            />*/}
        {items && items.filter(f => {
          if (this.props.user.userId === f.owner.userId) {
            return !f.owner.blocked
          } else {
            return !f.guest.blocked
          }
        }).sort((a, b) => moment(b.datetime).unix() - moment(a.datetime).unix()).map((item, index) => {
          const displayUser = this.props.user.userId === item.owner.userId ? item.guest : item.owner
          const contactUser = this.props.user.userId === item.owner.userId ? item.owner : item.guest
          const property = this.props.user.userId === item.owner.userId ? 'owner' : 'guest'
          const cover = userCover(displayUser.userId)

         console.log("displayUser: " + JSON.stringify(displayUser))

          return (<Animated.View useNativeDriver={true}>
            <Swipeable
              //onRightActionActivate={() => alert('left action')}
              //onRightActionDeactivate={() => alert('left action deactivated')}
              onRightActionComplete={() => this.handleBlockContact(item)}
            >
              <FlatList style={styles.itemList}
              data={items}
              keyExtractor={item => item.companyId}
              renderItem={({ item }) => {
                return (
                <ListItem key={item.contactId} bottomDivider onPress={() => { this.goToChat(displayUser, item.contactId, cover) }}>
                    <View style={styles.account}>
                    {displayUser.blocked ?
                      <View style={styles.blocked}>
                        <FastImage style={{ height: 20, width: 20 }} source={require('./../assets/images/icons/locked.png')} resizeMode={FastImage.resizeMode.contain} />
                      </View>
                      :
                      null
                    }
                    <FastImage
                      style={{ height: 45, width: 45, borderRadius: 22.5, backgroundColor: colorTheme.LIGHT_COLOR }}
                      source={cover && cover[0].photoURL ? { uri: cover[0].photoURL } : require('../assets/images/no-image.png')}
                    />
                    <View>
                      {!displayUser.blocked ?
                        (cover && cover[0].visibility === 1) ? (
                          <View style={[styles.accountStatus, styles.offline]}></View>
                        ) : (
                            <View style={[styles.accountStatus, styles.online]}></View>
                          ) : null}
                    </View>
                  </View>
                    <ListItem.Content>
                      <ListItem.Title>
                        <View style={styles.chatHeader}>
                          <View style={styles.label}>
                            <Text style={styles.title}>{(displayUser.birthDate) ? cover && cover[0].firstName + ', ' + moment().diff(displayUser.birthDate, 'years') : cover && cover[0].firstName}</Text>
                            {cover && cover[0] && cover[0].city &&
                              <View style={styles.location}>
                                <Image source={require('../assets/images/icons/pin.png')} style={styles.searchPic, { width: 10, height: 12, tintColor: colorTheme.TEXT_MUTED, marginRight: 3 }} />
                                <Text style={styles.city} numberOfLines={1}>{cover && cover[0].city}, {cover && cover[0].state}</Text>
                              </View>
                            }
                          </View>
                          <Text style={styles.time}>{moment(item.datetime).format("DD/MM")}</Text>
                        </View>
                      </ListItem.Title>
                      <ListItem.Subtitle>
                      <View style={styles.chatBody}>
                        {
                          property === 'guest' && item && item.owner.typing ||
                            property === 'owner' && item && item.guest.typing
                            ?

                            <Text numberOfLines={1} style={styles.writing}>digitando...</Text>
                            :
                            <Text numberOfLines={2} style={styles.subtitle}>{item.lastMessage}</Text>
                        }
                        {(contactUser && contactUser.unread > 0 && contactUser.unread < 100) ? (
                          <View style={styles.unread}><Text style={styles.unreadText}>{contactUser.unread}</Text></View>
                        ) : (contactUser && contactUser.unread >= 100) ? (
                          <View style={styles.unread}><Text style={styles.unreadText}>+99</Text></View>
                        ) : null}
                      </View>
                      </ListItem.Subtitle>
                    </ListItem.Content>
                  </ListItem>
                );
              }}
            />
                
              {/*<ListItem onPress={() => { this.goToChat(displayUser, item.contactId, cover) }}
                friction={90} //
                tension={100} // These props are passed to the parent component (here TouchableScale)
                activeScale={0.95} //
                leftAvatar={
                  <View style={styles.account}>
                    {displayUser.blocked ?
                      <View style={styles.blocked}>
                        <FastImage style={{ height: 20, width: 20 }} source={require('./../assets/images/icons/locked.png')} resizeMode={FastImage.resizeMode.contain} />
                      </View>
                      :
                      null
                    }
                    <FastImage
                      style={{ height: 45, width: 45, borderRadius: 22.5, backgroundColor: colorTheme.LIGHT_COLOR }}
                      source={cover && cover[0].photoURL ? { uri: cover[0].photoURL } : require('../assets/images/no-image.png')}
                    />
                    <View>
                      {!displayUser.blocked ?
                        (cover && cover[0].visibility === 1) ? (
                          <View style={[styles.accountStatus, styles.offline]}></View>
                        ) : (
                            <View style={[styles.accountStatus, styles.online]}></View>
                          ) : null}
                    </View>
                  </View>
                }
                key={item.chatName}
                title={
                  <View style={styles.chatHeader}>
                    <View style={styles.label}>
                      <Text style={styles.title}>{(displayUser.birthDate) ? cover && cover[0].firstName + ', ' + moment().diff(displayUser.birthDate, 'years') : cover && cover[0].firstName}</Text>
                      {cover && cover[0] && cover[0].city &&
                        <View style={styles.location}>
                          <Image source={require('../assets/images/icons/pin.png')} style={styles.searchPic, { width: 10, height: 12, tintColor: colorTheme.TEXT_MUTED, marginRight: 3 }} />
                          <Text style={styles.city} numberOfLines={1}>{cover && cover[0].city}, {cover && cover[0].state}</Text>
                        </View>
                      }
                    </View>
                    <Text style={styles.time}>{moment(item.datetime).format("DD/MM")}</Text>
                  </View>

                }
                subtitle={
                  <View style={styles.chatBody}>
                    {
                      property === 'guest' && item && item.owner.typing ||
                        property === 'owner' && item && item.guest.typing
                        ?

                        <Text numberOfLines={1} style={styles.writing}>digitando...</Text>
                        :
                        <Text numberOfLines={2} style={styles.subtitle}>{item.lastMessage}</Text>
                    }
                    {(contactUser && contactUser.unread > 0 && contactUser.unread < 100) ? (
                      <View style={styles.unread}><Text style={styles.unreadText}>{contactUser.unread}</Text></View>
                    ) : (contactUser && contactUser.unread >= 100) ? (
                      <View style={styles.unread}><Text style={styles.unreadText}>+99</Text></View>
                    ) : null}
                  </View>
                }
                subtitleStyle={styles.subtitle}
                bottomDivider

              />*/}
            </Swipeable>
          </Animated.View>
          )
        })}

      </View>
    );
  }
}


const styles = {
  blocked: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(50,50,50,0.65)',
    height: 45,
    width: 45,
    borderRadius: 35,
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 9,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemList: {
    width: width
  },
  chatHeader: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 5
  },
  label: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    width: width - 130,
    paddingRight: 20
  },
  title: {
    fontWeight: '600',
    fontSize: 15,
    marginRight: 5,
    color: colorTheme.DARK_COLOR
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
    color: colorTheme.TEXT_MUTED,
    textAlign: 'right',
    flexGrow: 1,
    paddingTop: 2
  },

  chatBody: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  writing: {
    flexGrow: 2,
    flexShrink: 1,
    fontWeight: '400',
    fontSize: 14,
    marginRight: 5,
    color: colorTheme.SECONDARY_COLOR
  },
  unread: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colorTheme.PRIMARY_COLOR
  },
  unreadText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  leftSwipeItem: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20
  },
  rightSwipeItem: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 10,
  },
  swipeButtonContent: {
    width: 120
  },
  swipeButtonText: {
    color: '#FFF',
    fontWeight: colorTheme.FONT_WEIGHT_BOLD,
    fontSize: colorTheme.FONT_SIZE_SMALL,
    marginTop: 4,
    textAlign: 'center'
  },


};
/** Redux */
const mapStateToProps = state => {
  return {
    chatCont: state.chats.chatCont,
    activeChat: state.chats.activeChat,
    user: state.userData.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    chatContacts: contacts => {
      dispatch(chatContacts(contacts))
    },
    activeChat: user => {
      dispatch(activeChat(user))
    }
  };
};




export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatContacts);

