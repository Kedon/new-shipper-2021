import React, { Component } from 'react'
import { View, Switch, StyleSheet, Text, Dimensions } from 'react-native'
import colorTheme from '../config/theme.style'

const { width } = Dimensions.get('window');

export default class Switches extends React.Component {
  state = {
    switchValue: this.props.switchValue
  }

  changeSwitchValue = (switchValue) =>{
    const {switchId} = this.props;
    this.setState({switchValue: switchValue});
    this.props.onChange(switchId, switchValue);
  }

  noSelected = () => {
    this.setState({switchValue: true});
  }

  componentDidUpdate = (prevProps) => {
    if(prevProps.switchValue !== this.props.switchValue){
      this.setState({switchValue: this.props.switchValue});
    }
  }

  render() {
    const switches = this.props
    const switchValue = this.state.switchValue
    return (
      <View style={ styles.switch }>
        <View style={styles.switchLabel}>
          <Text style={styles.switchTitle}>{switches.switchLabel}</Text>
          {(switches.switchDescription) ? (
            <Text style={styles.switchDescription}>{switches.switchDescription}</Text>
          ) : null }
        </View>
         <Switch
           trackColor={{true: colorTheme.PRIMARY_COLOR2, false: '#D9D9D9'}}
           thumbColor={switchValue ? colorTheme.PRIMARY_COLOR : '#D9D9D9'}
           style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }, styles.switchButton}
           onValueChange = {() => {(switchValue === true) ? this.changeSwitchValue(false) : this.changeSwitchValue(true)}}
           value = {switchValue}/>
      </View>

    )
  }
}
const styles = StyleSheet.create ({
  switches: {
    borderBottomWidth: 1,
    borderBottomColor: colorTheme.TEXT_MUTED,
    borderTopWidth: 1,
    borderTopColor: colorTheme.TEXT_MUTED,
    paddingLeft: 10,
    backgroundColor: colorTheme.TEXT_MUTED,
  },
  switchTitle: {
    fontSize:16,
    color: colorTheme.DARK_COLOR
  },
  switchDescription: {
    fontSize:12,
    width: width - 80,
    marginTop: 4,
    color: colorTheme.TEXT_MUTED
  },
  switch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingLeft: 0,
    paddingBottom: 10,
    paddingRight: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: colorTheme.GREY_COLOR,
    paddingLeft: 10,

  },
  switchBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#D8D8D8',
  },


})
