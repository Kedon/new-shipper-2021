import React, { Component } from 'react';
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    View,
    Text
} from 'react-native';
import { isSignedIn, onSignOut } from '../config/auth'
import { connect } from 'react-redux';
import { userData, loadingAuth, userToken } from '../../redux/actions/userActions';
import api from '../screens/register/auth-service'
import colorTheme from '../config/theme.style'


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
    },
});

class AuthLoadingScreen extends React.Component {
    static KEY_LOGGED_IN_USER = 'loggedInUser';

    constructor(props) {
        super(props);
        this.navigateAsync = this.navigateAsync.bind(this);
        this.navigateAsync();
    }

    componentDidMount() {
      this.navigateAsync()
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
                <ActivityIndicator color={colorTheme.PRIMARY_COLOR} size="large" />
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
  
