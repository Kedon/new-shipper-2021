// Home screen
import React, { Component } from 'react';
//import react in our code.
import { Platform, TextInput, Modal, TouchableHighlight, Alert, Text, View, Fragment, Button, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Input } from 'react-native-elements';
const { width } = Dimensions.get('window');
import moment from 'moment'
import colorTheme from '../config/theme.style'

//import all the components we are going to use.
export default class DateTime extends Component {

  state = {
    date: new Date(moment(this.props.value).format('YYYY/M/DD')),
    selecteDate: this.props.value,
    mode: 'date',
    show: false,
    modalVisible: false,
  }

  setModalVisible(visible, date) {
    this.setState({modalVisible: visible});
  }

  done = (visible, date) => {
    date = this.state.date//return today
    const {dateTimeId} = this.props

    this.setState({
      modalVisible: false,
      selecteDate: date
    });
    this.props.onChange(dateTimeId, moment(date).format('YYYY-MM-DD'))
  }

  setDate = (event, date) => {
    date = date || this.state.date;
    // this.setState({
    //   show: Platform.OS === 'ios' ? true : false,
    //   date,
    // });
    if(event.type === 'dismissed') {
      this.props.onCancel()
     
    } else {
      this.props.setDate(date)
      this.setState({selecteDate: date })
       console.warn(date);
    }
    event.stopPropagation()
  }

  render() {
    const { show, date, mode, datepickerHide } = this.state;
    const {dateTimeId, showModal, onPress} = this.props;

    return (
      <View>
      {/* <Modal
        style={{marginTop: 22}}
        animationType="slide"
        transparent={false}
        visible={this.state.modalVisible}> */}
        {showModal ? <View style={{position:'absolute'}}>
          <View style={styles.container} onPress={datepickerHide}>
            <View style={styles.component}>
              {Platform.OS === 'ios' && (
                <View style={styles.header}>
                  <TouchableOpacity onPress={this.setDate}>
                    <Text onPress={this.done}>Done</Text>
                  </TouchableOpacity>
                </View>
              )}
              <DateTimePicker
                value={date}
                dis
                style ={{backgroundColor: "blue"}}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={this.setDate}
             />
            </View>
         </View>

        </View>: null}
      {/* </Modal> */}
      <TouchableOpacity onPress={() => onPress()}>
        <View style={styles.rowContainer}>
          <Text style={styles.text}>{this.props.label}</Text>
          <View style={styles.textInput} >
            <TextInput
             pointerEvents="none"
             editable={false}
             value={moment(this.state.selecteDate).format('DD/MM/YYYY')}
             inputContainerStyle={styles.inputContainer}
             style={styles.input}
             placeholder={this.props.placeholder}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: Platform.OS === 'ios' ? '#00000066' : 'transparent',
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    width: '100%',
    padding: 16,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderColor: 'grey',
  },
  component: {
    justifyContent: 'center',
    width: '100%',
    height: 'auto',
    backgroundColor: 'white',
    borderRadius: 10
  },
  datetime: {
    height: 300,
    //  backgroundColor: 'yellow',
    marginBottom: 0,
    paddingBottom: 0
  },
  rowContainer: {
    //flex: 1,
    width: width,
    flexDirection: "row",
    //display: 'flex',
    //justifyContent: "space-between",
    alignItems: "center",
    //flex: 1,
    fontSize: 18,
    lineHeight: 23,
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#D8D8D8',
    paddingLeft: 10,
    backgroundColor: '#FDFDFD',

    //flex: 1,

  },
  text: {
    //flex: 1
    //width: '50%'
    fontSize: 16,
    color: colorTheme.DARK_COLOR
  },
  textInput: {
    alignSelf: 'flex-start',
    flexGrow: 1,
    color: colorTheme.TEXT_MUTED

  },
  inputContainer: {
    borderBottomWidth:0,
  },
  input: {
    textAlign: 'right',
    backgroundColor: 'transparent',
    marginBottom: -3,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,

    color: '#777',
    fontSize: 15,  }
});
