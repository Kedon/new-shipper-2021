// Home screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, ScrollView, SafeAreaView, StyleSheet, StatusBar, FlatList, Dimensions, Image, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import { Button, Slider } from 'react-native-elements';
import RangeSlider from 'rn-range-slider';
import colorTheme from '../../config/theme.style'
import  AppAd  from '../../components/AppAd';
import  Switches  from '../../components/Switches';
import { connect } from 'react-redux';
import { preferencesData } from '../../../redux/actions/preferencesActions'
import { noAthorized } from '../../components/Utils'

import { onSignIn, isSignedIn } from '../../config/auth'
import api from './services'

//import all the components we are going to use.
const { width } = Dimensions.get('window');
const height = width * 1;
const screenHeight = Dimensions.get('window').height;
class Preferences extends Component {
  constructor(props) {
    super(props)
    noAthorized(props)
  }
   state = {
       user: [],
       loading: true,
       minAge: 18,
       maxAge: 99,
       male: null,
       female: null,
       lookingDefault: null,
       distance: 100
   }

   componentDidMount() {
     this.userPreferences()
   }

   componentWillUnmount() {
     const {minAge, maxAge, male, female, distance} = this.state
     this.updateUserPreferences({
       ageRange: minAge+","+maxAge,
       looking: male && female ? 'MALE,FEMALE' : male ? 'MALE' : 'FEMALE',
       distance: distance
       //female: female,
     })
   }

   onchange = (switchId, switchValue) => {
     this.setState({ [switchId]: switchValue }, () => {
       const {male, female, lookingDefault} = this.state
       if(male == false && female == false){
         this.setState({[lookingDefault]: true}, () => {
           this.refs.change.noSelected();
         });
       }
     })
    }


   userPreferences = async (action) => {
       const { preferencesData } = this.props;
       if(this.props.token){
         api.userPreferences(this.props.token)
             .then(res => {
               this.setState({
                 loading: false,
                 user: res.data[0],
                 male: (res.data[0].MALE == 1) ? true : false,
                 female: (res.data[0].FEMALE == 1) ? true : false,
                 minAge: res.data[0].minAge,
                 maxAge: res.data[0].maxAge,
                 distance: res.data[0].distance > 0 ? res.data[0].distance : 100,
                 lookingDefault: res.data[0].lookingDefault,
               }, () => {

               })
             })
             .catch(function(error) {
             console.log('There has been a problem with your fetch operation: ' + error.message);
              // ADD THIS THROW error
               throw error;
             });
         }
   }
   updateUserPreferences = async (params) => {
       const { preferencesData } = this.props;
       if(this.props.token){
        api.updateUserPreferences(this.props.token, params)
             .then(res => {
               preferencesData(params)
             })
             .catch(function(error) {
             console.log('There has been a problem with your fetch operation: ' + error.message);
              // ADD THIS THROW error
               throw error;
             });
         }
   }

  render() {
    const { user, loading, minAge, maxAge, female, male, distance } = this.state;
    if(!loading) {
      return (
        <SafeAreaView style={[styles.container]}>
          <AppAd style={styles.container}>
          </AppAd>
          <View style={styles.switchContainer}>
            <View>
              <View style={styles.label}>
                <Text style={styles.title}>QUERO CONHECER:</Text>
              </View>
              <View style={styles.switchContainer}>
                <Switches
                    switchId={'male'} //same state element name
                    switchValue={male}
                    switchLabel={"Homens"}
                    switchDescription={null}
                    onChange={this.onchange}
                    ref="change"
                />
                <Switches
                    switchId={'female'} //same state element name
                    switchValue={female}
                    switchLabel={"Mulheres"}
                    switchDescription={null}
                    onChange={this.onchange}
                    ref="change"
                />
              </View>
            </View>
            <View>
              <View style={styles.label}>
                <Text style={styles.title}>COM IDADE ENTRE</Text>
                <Text style={styles.highLight}>{minAge}</Text>
                <Text style={styles.title}>E</Text>
                <Text style={styles.highLight}>{maxAge}</Text>
                <Text style={styles.title}>ANOS</Text>
              </View>
              <View style={styles.rangeContainer}>
                <RangeSlider
                    style={ styles.rangeSlider}
                    thumbBorderWidth={.5}
                    gravity={'center'}
                    min={18}
                    max={99}
                    step={1}
                    lineWidth={5}
                    initialLowValue={parseFloat(minAge)}
                    initialHighValue={parseFloat(maxAge)}
                    labelStyle='none'
                    selectionColor={colorTheme.PRIMARY_COLOR_HEX}
                    blankColor="#D1D1D1"
                    onValueChanged={(low, high, fromUser) => {
                        this.setState({minAge: low, maxAge: high})
                    }}/>
              </View>
            </View>
            <View>
              <View style={styles.label}>
                <Text style={styles.title}>DISTÂNCIA MÁXIMA DE </Text>
                <Text style={styles.highLight}>{distance} </Text>
                <Text style={styles.title}>KM</Text>
              </View>
              <View style={styles.rangeContainer}>
                <RangeSlider
                    style={ styles.rangeSlider}
                    thumbBorderWidth={.5}
                    gravity={'center'}
                    rangeEnabled={false}
                    min={50}
                    max={160}
                    step={1}
                    lineWidth={5}
                    initialLowValue={distance}
                    labelStyle='none'
                    selectionColor={colorTheme.PRIMARY_COLOR_HEX}
                    blankColor="#D1D1D1"
                    onValueChanged={(low, high, fromUser) => {
                        this.setState({distance: low})
                    }}/>
              </View>
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
    backgroundColor: '#FFF',
    borderColor: '#000',
  },
  switchContainer: {
    borderTopWidth: 0.5,
    borderTopColor: '#D8D8D8',
  },
  title: {
    color: colorTheme.DARK_COLOR
  },
  label: {
    display: 'flex',
    flexDirection: 'row',
    padding: 15,
    backgroundColor: colorTheme.EXTRA_LIGHT_COLOR,

  },
  highLight:{
    color: colorTheme.PRIMARY_COLOR,
    paddingLeft: 3,
    paddingRight: 3
  },
  rangeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#FDFDFD',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: '#D8D8D8',
    borderBottomColor: '#D8D8D8',


  },

  rangeSlider:{
    width: width - 30,
    height: 50,
    paddingTop: 5,
    paddingBottom: 5
  },
  userInfo: {
    width: '100%',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 45,
    marginBottom: 15,
    borderBottomWidth: 0.2,
    borderBottomColor: colorTheme.TEXT_MUTED
  },
  profileInfo: {
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',

  },
  button: {
    backgroundColor: colorTheme.PRIMARY_COLOR,
    borderRadius: 5,
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
    padding: 12,
    textAlign:'center',
    alignItems: 'center',
    marginTop: -38

  },
  profileItems: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 15
  },
  cover: {
    position: 'relative',
    width: 100,
    height: 100,
    marginBottom: 10
  },
  coverPhoto: {
    width: 100,
    height: 100,
    borderRadius: 100/ 2,
    position: 'absolute'
  },
  coverEdit: {
    width: 32,
    height: 32,
    borderRadius: 32/ 2,
    position: 'absolute',
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorTheme.PRIMARY_COLOR
  },
  userDesc: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  userLocation: {
    fontSize: 13,
    fontWeight: '400',
    color: colorTheme.TEXT_MUTED
  },
  scrollContainer: {
    height: '100%',
    position: 'absolute',
    borderRadius:10,
    overflow:'hidden',
    backgroundColor: 'red',
    borderColor: '#000',
    borderWidth:3
  },
});

/** Redux */
const mapStateToProps = state => {
  return {
    preferences: state.preferencesData.preferences,
    token: state.userData.userToken
  };
};

const mapDispatchToProps = dispatch => {
  return {
    preferencesData: preferences => {
        dispatch(preferencesData(preferences))
      }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Preferences);
