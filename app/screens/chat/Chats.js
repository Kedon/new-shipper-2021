// Home screen
import React, { Component } from 'react';
//import react in our code.
import { Text, ActivityIndicator, RefreshControl, View, ScrollView, SafeAreaView, StyleSheet, StatusBar, FlatList, Dimensions, Image, TouchableOpacity, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import  CustomHeader  from '../../components/Header';
import  Contacts  from '../../components/ChatContacts';
import  CustomButton  from '../../components/CustomButton';
import  SearchInput  from '../../components/SearchInput';
import colorTheme from '../../config/theme.style'
import { withNavigation } from 'react-navigation';
import { onSignIn, isSignedIn } from '../../config/auth';
import { domain } from './../../config/constants'
import api from './services'
import  EmptyState  from '../../components/EmptyState';
import moment from "moment";
import { connect } from 'react-redux';
import { chatSearch } from '../../../redux/actions/chatsActions'



//import all the components we are going to use.
const { width } = Dimensions.get('window');
const height = width * 1;
const screenHeight = Dimensions.get('window').height;
const pageinfo = {
    title: "Conversas",
    page: "Chats"
};
class Chats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: [],
      loading: false,
      loadingMore: false,
      current_page: 1,
      offset: 0,
      hasMore: true,
      refreshing: false,
      chatCont: this.props.chatCont,
      filteredContacts: [],
      value: '',
    }
    this.arrayholder = [];

  }

  searchFilterFunction = text => {
    //this.props.chatSearch(text)
    this.setState({ value: text })
    const newData = this.props.chatCont.filter(item => {
      const itemData = this.props.user.userId === item.owner.userId ? item.guest.firstName.toUpperCase() : item.owner.firstName.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      filteredContacts: newData,
    });
  };

  isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  

  render() {
    const { matches, loading, hasMore, filteredContacts, value } = this.state;
    const { chatCont } = this.props;
    const chatCount = chatCont && chatCont.map((m, i, a) => {
        if(this.props.user.userId === m.owner.userId){
          //return m.owner.unread ? m.owner.unread : 0
        } else {
          //return  m.guest.unread ? m.guest.unread : 0
        }
        
    })

    
    
    return (
      <SafeAreaView style={[styles.container]}>
        <CustomHeader />
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
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
            onScroll={({nativeEvent}) => {
              if (this.isCloseToBottom(nativeEvent)) {
                //this.loadOldChats();
              }
            }}
            >
              
              <View>
                {(value && value.length > 0 && filteredContacts.length === 0) ?
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 25, paddingRight: 25, paddingTop: 50 }}>
                      <Text>Nenhum resultado</Text>
                  </View>
                  :
                  <View>
                  <Contacts items={value && value.length > 0 ? filteredContacts/*.filter( f => (!f.guest.blocked || !f.owner.blocked) )*/ : chatCont/*.filter( f => (!f.guest.blocked && !f.owner.blocked) )*/} lastMessage={this.props.message} filterContacts={this.filterContacts}/>
                  </View>
                }
                {(loading) &&
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 25, paddingRight: 25 }}>
                    <ActivityIndicator />
                  </View>
                }
                {((chatCont && chatCont/*.filter( f => (!f.guest.blocked && !f.owner.blocked) )*/.length <= 0 || !chatCont)  && !loading) &&
                  <EmptyState title={'Nenhum match por enquanto'} description={'Quando você fizer match, seus contatos aparecerão aqui.'} width={250} height={250} illustration={require('../../assets/images/no_chat.png')}/>
                }

              </View>

            </ScrollView>
          </View>
      </SafeAreaView>


    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    borderColor: '#000',
  },
  scrollContainer: {

  },
});


/** Redux */
const mapStateToProps = state => {
  return {
    chatCont: state.chats.chatCont,
    activeChat: state.chats.activeChat,
    user: state.userData.user,
    filteredContacts: state.chats.filteredContacts,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    chatContacts: contacts => {
          dispatch(chatContacts(contacts))
      },
      chatSearch: term => {
        dispatch(chatSearch(term))
    }
  };
};




export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(Chats));
