// Home screen
import React,  { useState, useEffect } from 'react';
//import react in our code.
import { Text, ActivityIndicator, RefreshControl, View, ScrollView, SafeAreaView, StyleSheet, StatusBar, FlatList, Dimensions, Image, TouchableOpacity, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import CustomHeader from '../../components/Header';
import ChatContacts from '../../components/ChatContacts';
import CustomButton from '../../components/CustomButton';
import SearchInput from '../../components/SearchInput';
import colorTheme from '../../config/theme.style'
import { withNavigation } from 'react-navigation';
import { onSignIn, isSignedIn } from '../../config/auth';
//import SocketIOClient from 'socket.io-client'
import { domain } from './../../config/constants'
import api from './services'
import EmptyState from '../../components/EmptyState';
import moment from "moment";
import CustomModalComponent from '../../components/CustomModalComponent'
import { ModalAlert } from '../../components/Utils'
import { noAthorized } from '../../components/Utils'
/***
 * Redux
 */
import { connect } from "react-redux";
import { messageData } from '../../../redux/actions/messages'

//import all the components we are going to use.
const { width } = Dimensions.get('window');
const height = width * 1;
const screenHeight = Dimensions.get('window').height;
const pageinfo = {
  title: "Conversas",
  page: "Chats"
};
function Chats(props)  {
  const styles = {
    container: {
      flex: 1,
      backgroundColor: '#FFF',
      borderColor: '#000',
    },
    scrollContainer: {
  
    },
    profileInfo: {
      height: 100
    }
  }
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [typingText, setTypingText] = useState('')
  const [ refreshing, setRefreshing ] = useState(false)
  const [ arrayholder, setArrayholder ] = useState([])

  useEffect(() => {
    noAthorized(props)
   //socket = SocketIOClient(domain);

    //Listen on new_message
    /*socket.on("new_message", async (newMessage) => {
      updateChatData = this.updateChatMessage(newMessage)

      setMatches(updateChatData)
      setTypingText('')
    })*/

    const unsubscribe = props.navigation.addListener('focus', e => {
      // Prevent default behavior
      e.preventDefault();
      // Do something manually
      // ...
    });
    updateChatMessage = (newMessage) => {
      return this.state.matches.map(chat => {
        if (chat.chatName === newMessage.room) {
          chat.lastChat.date = newMessage.datetime ? newMessage.datetime : ''
          chat.lastChat.message = newMessage.message
        }
        return chat
      })
    }

    /*socket.on('typing', (data) => {
      updateChatData = this.updateChatMessage({ message: 'is typing a message...', room: data.room, datetime: moment(new Date()).format("YYYY-MM-DD HH:mm") })
      setMatches(updateChatData)
      setTypingText('')
    })*/
    getMatches()
    return () => {

      // didFocusListener.remove();
		// didBlurListener.remove();
      // alert('Saindo... para testar')
      // setView(false)
    }
  }, [])
 
  getMatches = async () => {
    //const { navigation } = this.props;
    //const { navigation } = this.props;
    try {
      await isSignedIn().then(async (token) => {
        await api.matches(JSON.parse(token), currentPage, offset)
          .then(async res => {
            if (res.data.matches.length > 0) {
              for (let chat of res.data.matches) {
                chatJoin(chat.chatName)
              }
              await setLoading(false)
              await setHasMore(res.pagination.hasMore)
              await setMatches([...matches, ...res.data.matches])
              await setCurrentPage(res.pagination.next_page !== null ? res.pagination.next_page + 1 : res.pagination.current_page + 1)
              await setOffset(res.pagination.offset)
              await setHasMore(false)
              await setLoadingMore(false)
              await setRefreshing(false)
              await setArrayholder(matches)
            } else {
              await setLoading(false)
              await setHasMore(res.pagination.hasMore)
            }
          })
          .catch(err => noAthorized())
      });
      
    } catch (error) {
      alert(error)
    }
   
  }
   /**
   * Client enter to the chat by chatId (String)
   * Example: "59e1d4a0-6576-11ea-953b-c7c9ce40c9d9"
   */
  chatJoin = (chatid) => {
    //this.socket.emit('room', chatid);
  }
  loadOldChats = () => {}
  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };
  searchFilterFunction = text => {
    const newData = arrayholder.filter(item => {
      const itemData = `${item.receiver.firstName.toUpperCase()} ${item.location.city.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    setMatches(newData)
  };

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  _onRefresh = async () => {
    console.log('refreshing')
    setRefreshing(true);
    getMatches()

  }

    return (
      <SafeAreaView style={[styles.container]}>
        <CustomHeader />
        {(!loading && matches.length > 0) &&
          <View style={styles.container}>
            <View style={styles.profileInfo}>
              <SearchInput
                placeholder={'Buscar'}
                onChangeText={this.searchFilterFunction}
              />
            </View>
            <ScrollView
              style={styles.scrollContainer}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={_onRefresh}
                />
              }
              onScroll={({ nativeEvent }) => {
                if (this.isCloseToBottom(nativeEvent)) {
                  this.loadOldChats();
                }
              }}
            >
              <ChatContacts items={matches} lastMessage={props.message} />
              {(hasMore) &&
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 25 }}>
                  <ActivityIndicator />
                </View>
              }

            </ScrollView>
          </View>
        }
        {(loading) &&
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 25, paddingRight: 25 }}>
            <ActivityIndicator />
          </View>
        }
        {(matches.length <= 0 && !loading) &&
          <EmptyState title={'Nada aqui, por enquanto'} description={'Quando der match, aqui é onde você encontrará todos os seus contatos.'} width={250} height={250} illustration={require('../../assets/images/no_chat.png')} />
        }
      </SafeAreaView>


    );
  }

/** Redux */
const mapStateToProps = state => {
  return {
    message: state.messageData.message
  };
};

const mapDispatchToProps = dispatch => {
  return {
    messageData: message => {
      dispatch(messageData(message))
    }
  };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(Chats));
