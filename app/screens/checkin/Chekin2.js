// Home screen
import React, { Component } from 'react';
//import react in our code.
import { Text, TextInput, Image, TouchableOpacity, View, ScrollView, SafeAreaView, StyleSheet, StatusBar, FlatList, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import CustomHeader from '../../components/Header';
import Partners from '../../components/Partners';
import { withNavigation } from 'react-navigation';
import TimelineAds from '../../components/TimelineAds';
import QrCodeModal from '../../components/QrCodeModal';
import colorTheme from '../../config/theme.style';
import EmptyState from '../../components/EmptyState';
import { onSignIn, isSignedIn } from '../../config/auth'
import api from './services'
import { noAthorized } from '../../components/Utils'
//import all the components we are going to use.
const { width } = Dimensions.get('window');
const height = Dimensions.get('window').height;
export default class Checkin extends Component {
  constructor(props) {
    super(props);
    noAthorized(props)
    this.state = {
      checkins: [],
      found: true,
      newcheckins: [],
      loading: true,
      loadingMore: false,
      current_page: 1,
      refreshing: false,
      offset: 0,
      headerToken: null,
      showQrCode: false,
    }
    this.arrayholder = [];
  }

  async componentDidMount() {
    await isSignedIn().then(async (token) => {
      this.setState({headerToken: JSON.parse(token)})
      // alert(token)
    }).catch(error => noAthorized(error));
    this.getCheckins()
  }

  componentWillUnmount() {   // Lazy loading data for RNN
  //  alert('Appear')
  }

  getCheckins = async (action) => {
    //const { navigation } = this.props;

    this.setState({ hasMore: false, loadingMore: true })
    api.checkins(this.state.headerToken, { current_page: action == 'loadOlds' ? this.state.current_page : 1, offset: action == 'loadOlds' ? this.state.offset : 0 })
      .then(res => {
        if(res.status !== 'OK') {
          this.setState({found: this.state.checkins.length > 0 ? true : false, loading: false, loadingMore: false, refreshing: false})
          return
        }


        if (res.data.companies.length > 0) {
          if (action == 'refresh') {
            this.setState({
              //refreshing: false,
              found: true,
              checkins: res.data.companies,
              current_page: 1,
              offset: res.pagination.offset,
            },
              this.setState({ loadingMore: false, refreshing: false })
            )
          } else {
            this.setState({
              loading: false,
              found: true,
              //hasMore: res.pagination.next_page !== null ? true : false,
              checkins: [...this.state.checkins, ...res.data.companies],
              current_page: res.pagination.next_page,
              offset: res.pagination.offset,
              //cards: [Number(this.state.cards) + Number(res.data.userInfo.length)]
            }, () => { this.setState({ loadingMore: false, refreshing: false }) })
            this.arrayholder = this.state.checkins;
          }
        }

      })
      .catch(function (error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
        // ADD THIS THROW error
        throw error;
      })
  }

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  _onRefresh = async () => {
    this.setState({ refreshing: true });
    this.getCheckins('refresh')
  }


  loadOldCheckins = () => {
    this.setState({ loadingMore: true })
    this.getCheckins('loadOlds')
  }


  /*showQrCode() {
    this.refs.qrcode.open();
  }*/

  searchFilterFunction = text => {
    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.companyName.toUpperCase()} ${item.address.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      checkins: newData,
    });
  };

  showQrCode = () => {
    this.setState({showQrCode: true})
  }

  hideQrCode = () => {
    this.setState({showQrCode: false})
  }





  render() {
    const { checkins, loading, loadingMore, found, showQrCode } = this.state;

    return (
      <SafeAreaView style={[styles.container]}>
        <CustomHeader navigation={this.props.navigation} />
        <View style={styles.container}>
             <View style={styles.searchContainer}>
              <View style={styles.searchInput}>
                <View style={styles.search}>
                  <TextInput
                    style={styles.searchbox}
                    placeholder={'Buscar estabelecimento'}
                    onChangeText={this.searchFilterFunction} />
                  <Image source={require('../../assets/images/icons/search.png')} style={styles.searchPic, { width: 17.5, height: 17.5 }} />
                </View>
              </View>
              <View style={styles.searchIcon}>
                <TouchableOpacity style={styles.qrcode} onPress={this.showQrCode}>
                  <Image source={require('../../assets/images/icons/qr_code.png')} style={{ width: 30, height: 30 }} />
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }
              onScroll={({ nativeEvent }) => {
                if (this.isCloseToBottom(nativeEvent)) {
                  //this.loadOldCheckins(); //opção desativada, por enquanto
                }
              }}
              scrollEventThrottle={400}
              contentContainerStyle={{paddingBottom: 70}}
            >
              {/* {!found ? <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'red', flex: 1}}><EmptyState title={'Nada aqui, por enquanto'} description={'Quando der match, aqui é onde você encontrará todos os seus contatos.'} width={250} height={250} illustration={require('../../assets/images/no_chat.png')} /></View>  : null } */}
              {(!loading && this.state.checkins.length > 0) ?
                <View>
                <Partners items={this.state.checkins}></Partners>
                  {(!loadingMore) &&
                    <TouchableOpacity onPress={() => this.loadOldCheckins()}>
                      <Text style={styles.loadOlds}>Carregar mais</Text>
                    </TouchableOpacity>
                  }
                </View>
                :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 25, paddingRight: 25 }}>
                  <EmptyState title={'Nada aqui, por enquanto'} description={'Arraste a sua tela para baixo para verificar se tem alguma nova informação.'} width={250} height={250} illustration={require('../../assets/images/no_contact.png')}/>
                </View>


              }
              {(loading) &&
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 25, paddingRight: 25 }}>
                  <ActivityIndicator />
                </View>
              }
              {(loadingMore) &&
                <View style={{ padding: 25 }}>
                  <ActivityIndicator />
                </View>
              }
            </ScrollView>
          <QrCodeModal modalQrCodeVisible={showQrCode} onPressClose={(v)=> this.hideQrCode(v)} />
        </View>
      </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },

  searchContainer: {
    flexDirection: "row",
    padding: 10
  },
  searchInput: {
    flexGrow: 1,
    height: 30
  },
  searchIcon: {
    paddingLeft: 10,
  },
  search: {
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    padding: 12,
    borderRadius: 5
  },
  searchbox: {
    flexGrow: 1,
  },

  searchPic: {
    flexGrow: 1,
    width: 20,
    height: 20
  },
  scrollContainer: {
    /*height: height - 250,*/
  },
  qrcode: {
    backgroundColor: colorTheme.PRIMARY_COLOR,
    padding: 7,
    borderRadius: 5
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
