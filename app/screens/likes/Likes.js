// Home screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, ScrollView, RefreshControl, SafeAreaView, StyleSheet, StatusBar, FlatList, Dimensions, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import  CustomHeader  from '../../components/Header'
import  LikeContacts  from '../../components/LikeContacts';
import  EmptyState  from '../../components/EmptyState';
import  CustomButton  from '../../components/CustomButton';
import  SearchInput  from '../../components/SearchInput';
import colorTheme from '../../config/theme.style'

import api from './services'

import { connect } from 'react-redux';
import { noAthorized } from '../../components/Utils'
//import all the components we are going to use.
const { width } = Dimensions.get('window');
const height = width * 1;
const screenHeight = Dimensions.get('window').height;
const pageinfo = {
    title: "Me curtiu",
    page: "Chats"
};
class Likes extends Component {
  constructor(props) {
    super(props);
    noAthorized(props)
    this.state = {
      likes: [],
      loading: true,
      loadingMore: false,
      current_page: 1,
      refreshing: false,
      hasMore: true,
      offset: 0,
      cards: 0,
    }
  }

  componentDidMount() {
    this.getLikes()
  }

  _onRefresh = async () => {
    console.log('refreshing')
   this.setState({refreshing: true});
   this.getLikes()

  }

  isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  loadOldLikes = () => {
    this.setState({ loadingMore: true })
    this.getLikes('loadOlds')
  }



  getLikes = async (action) => {
      //const { navigation } = this.props;
  
      if(this.props.token){
        this.setState({hasMore: false, loadingMore: true})
        api.likes(this.props.token, {offset: this.state.offset})
            .then(res => {
              console.warn(res);
              if(res.status !== 'OK') {
                this.setState({found: this.state.likes.length > 0 ? true : false, loading: false, loadingMore: false, refreshing: false})
                return
              }

              if(res.data.userInfo.length > 0){
                //console.warn(res)
                  this.setState({
                    loading: false,
                    likes: [...this.state.likes, ...res.data.userInfo],
                    offset: this.state.offset + res.data.userInfo.length,
                  }, () => {this.setState({loadingMore: false, refreshing: false})})

              } else {
                this.setState({
                  loading: false,
                  hasMore: false,
                }, () => this.setState({loadingMore: false, refreshing: false}))
              }
            })
            .catch(err => alert(err))
        }
  }



  render() {
    const { likes, loading, loadingMore } = this.state;
    const { user } = this.props;

    if (!loading){
      return (
        <SafeAreaView style={[styles.container]}>
          <CustomHeader navigation={this.props.navigation} />

            <View style={[styles.container]}>
              <View style={styles.likes}>
                <Text style={styles.likesText}>
                  {likes.length > 1 ? likes.length + ' Curtidas' : likes.length == 0 ? 'Sem novidades por aqui' :'1 Curtida'}
                </Text>
              </View>
              <View style={styles.container}>
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
                      //this.loadOldLikes(); //REMOVIDO POR ENQUANTO
                    }
                  }}

                  >
                  {likes.length > 0 ?
                  <View>
                  {(user && user.packages && user.packages.level < 2 || user && user.packages && user.packages.level == null) ?
                    <Text style={styles.premium}>Faça upgrade para um perfil Vip e veja quem curtiu o seu perfil.</Text> :
                    <View style={{marginTop: 10}}></View>
                    }
                    <LikeContacts items={this.state.likes}/>
                    {(!loadingMore) &&
                      <TouchableOpacity onPress={() => this.loadOldLikes()}>
                        <Text style={styles.loadOlds}>Carregar mais</Text>
                      </TouchableOpacity>
                    }

                  </View>
                  :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 25, paddingRight: 25, height: screenHeight - 180 }}>
                      <EmptyState title={'Nada aqui, por enquanto'} description={'Como usuário Vip, você poderá ver aqui as pessoas que curtiram o seu perfil.'} width={250} height={250} illustration={require('../../assets/images/no_contact.png')}/>
                    </View>
                  }
                  {(loadingMore) &&
                    <View style={{ padding: 25 }}>
                      <ActivityIndicator />
                    </View>
                  }

                </ScrollView>
              </View>
            </View>
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={[styles.container]}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 25, paddingRight: 25 }}>
            <ActivityIndicator color={colorTheme.PRIMARY_COLOR} />
          </View>
        </SafeAreaView>
      )
    }
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    height: screenHeight
  },
  scrollContainer: {

  },
  likes: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    width: width,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e9e9e9',
    padding: 10,
  },
  likesText: {
    fontSize: 15,
    fontWeight: '600',
  },
  premium: {
    fontSize: 15,
    fontWeight: '600',
    padding: 10,
    color: colorTheme.TEXT_MUTED,
    lineHeight: 19,
    textAlign: 'center'
  },
  loadOlds: {
    padding: 15,
    color: colorTheme.DARK_COLOR,
    textAlign: 'center',
    backgroundColor: colorTheme.GREY_LIGHT_COLOR,
    borderRadius: 25,
    fontWeight: colorTheme.FONT_WEIGHT_MEDIUM,
    fontSize: colorTheme.FONT_SIZE_MEDIUM,
    margin: 15,
  }

});

/** Redux */
const mapStateToProps = state => {
  return {
    user: state.userData.user,
    token: state.userData.userToken
  };
};


export default (connect(
  mapStateToProps,
)(Likes))
