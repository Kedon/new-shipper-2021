import React, { Component } from 'react';
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    View,
    Text,
    Image
} from 'react-native';
import { isSignedIn, onSignOut, onSignIn } from '../config/auth'
import { connect } from 'react-redux';
import { userData, loadingAuth, userToken } from '../../redux/actions/userActions';
import api from '../screens/register/auth-service'
import colorTheme from '../config/theme.style'
import { Profile } from "react-native-fbsdk-next";
import OneSignal from 'react-native-onesignal';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: colorTheme.PRIMARY_COLOR
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
    },
    gradientContainer: {
      flex: 1,
      height: '100%',
      width: '100%',
      position: 'absolute',
      justifyContent: 'center', alignItems: 'center'
    }
  
});

class AuthLoadingScreen extends React.Component {
    static KEY_LOGGED_IN_USER = 'loggedInUser';

    constructor(props) {
        super(props);
        this.navigateAsync = this.navigateAsync.bind(this);
        this.navigateAsync();
    }

    componentDidMount = async () => {
      const currentProfile = await this.getFacebookUserData()
      if(typeof currentProfile !== 'undefined'){
        const fb = await api.newAuthenticationFB(currentProfile.userID).then( res => {
          this.appSignIn(res.data)
          this.setState({ loading: false })
        }).catch( err => {
          console.log(err && err.response && err.response.status)
          if(err && err.response && err.response.status === 404){
            this.setState({ loading: false })
            navigation.navigate('EmailPage', { data: {
              facebookName: currentProfile.name,
              facebookId:  currentProfile.userID,
              facebookImage: currentProfile.imageURL ? `${currentProfile.imageURL.replace('height=100','height=700').replace('width=100','width=700')}`: null
            } })
          }
        })
      } else {
        this.navigateAsync()
      }
    }

    appSignIn = async (data) => {
      userDataSave(data.user)
      this.getUserInfo(data.token)
      OneSignal.setExternalUserId(user.userId);
      OneSignal.sendTag("USER", user.userId);
      try {
        await onSignIn(data.token)
        //
      } catch (error) {
        console.warn(error)
      }
  
  
    }

    getFacebookUserData = async () => {
      return await Profile.getCurrentProfile().then(
        async (currentProfile) => {
          console.log(JSON.stringify(currentProfile))
          if (currentProfile) {
            console.log("The current logged user is: " +
              currentProfile.name
              + ". His profile id is: " +
              currentProfile.userID
            );
            return currentProfile
          }
        })
    }

    navigateAsync =  () => {
      const { userData, loadingAuth, userToken } = this.props;

        //loadingAuth(true)
        isSignedIn().then(async (token) => {
            await api.getUserInfo(JSON.parse(token))
            .then(res => {
              userData(res.data[0].data)
              loadingAuth(false)
              userToken(JSON.parse(token))
              //this.props.navigation.navigate('App');
              console.warn('logged')
            })
            .catch((error) => {
              console.log('There has been a problem with your fetch operation: ' + error.message);
              // ADD THIS THROW error
              throw error;
            });
        }, () => {
            //this.props.navigation.navigate('Auth');
            loadingAuth(false)
        }).catch( err => console.log(err));

        //this.props.navigation.navigate('Auth');
    }


    render() {
        const { user, loadingAuth } = this.props.user
        return (
            <View style={styles.container}>
                <ActivityIndicator color={colorTheme.WHITE} size="large" />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}


/** Redux */
const mapStateToProps = state => {
    return {
      user: state.userData,
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
      userData: user => {
        dispatch(userData(user))
      },
      loadingAuth: toggle => {
        dispatch(loadingAuth(toggle))
      },
      userToken: token => {
        dispatch(userToken(token))
      }
    };
  };
  
  export default (connect(
    mapStateToProps,
    mapDispatchToProps
  )(AuthLoadingScreen));
  
