import React, { Component } from 'react';
import { Image } from 'react-native';
import { View, Text } from 'react-native-animatable';
import { connect } from 'react-redux';
import { chatContacts } from '../../redux/actions/chatsActions'

class ChatBadgeIcon extends Component {

    render() {
        const { chatCont } = this.props
        const chatCount = chatCont && chatCont.filter( f => {
            if(this.props.user.userId === f.owner.userId){
              return !f.owner.blocked
            } else {
              return !f.guest.blocked
            }
          }).map((m, i, a) => {
            if(this.props.user.userId === m.owner.userId){
                return m.owner.unread ? m.owner.unread : 0
            } else {
                return  m.guest.unread ? m.guest.unread : 0
            }
        }).reduce((sum, x) => sum + x, 0)
            
        
        
        console.warn(chatCont)

        return (
            <View style={styles.container}>
                {chatCount > 0 &&
                <View style={styles.badge}>
                    <Text style={styles.text}>{chatCount > 100 ? '+99' : chatCount === 100 ? '100' : chatCount}</Text>
                </View>
                }
                <Image style={{ height: 22, width: 22,  tintColor: this.props.tintColor}} source={require('../assets/images/matches-tab.png')}/>
            </View>
        );
    }
}

const styles = {
    container: {
        position: 'relative'
    },
    text: {
        color: '#FFF',
        fontSize: 8,
        fontWeight: '700',
    },
    badge: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      backgroundColor: 'red',
      minWidth: 16,
      paddingRight: 3,
      paddingLeft: 3,
      height: 16,
      borderRadius: 9,
      position: 'absolute',
      zIndex: 9,
      right: -10,
      top: -5
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
        }
    };
  };
  
  
  
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(ChatBadgeIcon);
  