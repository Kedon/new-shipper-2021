// Home screen
import React, { Component } from 'react';
//import react in our code.
import { Platform, Modal, Text, View, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-community/picker'
import { Input } from 'react-native-elements';
const { width } = Dimensions.get('window');
import colorTheme from '../config/theme.style'

//import all the components we are going to use.
export default class Select extends Component {
  state = {
    option: this.props.selected,
    optionLabel: 'Masculino',
    modalVisible: false,
  }

  updateOption = (option, index) => {
    this.setState({ option: option, optionLabel: index })
  }


  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  done = (visible, option) => {
    const { selectId } = this.props;
    this.setState({
      modalVisible: false,
      selectedOption: this.state.option
    });
    this.props.onChange(selectId, this.state.option)
  }

  render() {
    const { show, date, mode, datepickerHide } = this.state;
    const { options, showGenreList, clickShowGenresList, selected, selectGenre } = this.props;
    console.warn(options);
    return (
      <View style={{position:'relative'}}>

        {/* <Picker
          selectedValue={this.state.option} onValueChange={this.updateOption}>
          {this.props.options.map((item, index) => {
            return (<Picker.Item label={item.label} value={item.value} key={index} />)
          })}
        </Picker> */}

        <TouchableOpacity onPress={() => clickShowGenresList()}>
          <View style={styles.rowContainer}>
            <Text style={styles.text}>{this.props.label}</Text>
            <View style={styles.textInput} >
              <Input
                editable={false}
                pointerEvents="none"
                inputContainerStyle={styles.inputContainer}
                value={this.state.selectedOption}
                inputStyle={styles.input}
                placeholder={this.props.placeholder}
                defaultValue={this.props.value}
                rightIcon={
                  <Image style={{ width: 15, height: 15, marginTop:15, tintColor: colorTheme.PRIMARY_COLOR, marginRight: 10 }} source={require('../assets/images/icons/downIcon.png')} resizeMode="contain" />
                }
              />
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.genreList}>
          {showGenreList ? this.props.options.map((item, index) => <TouchableOpacity key={index} onPress={()=>selectGenre(item.value)} style={{height: 50,  justifyContent: 'center'}}><Text style={[styles.listText, {color: selected === item.value ? colorTheme.PRIMARY_COLOR: ''}]}>{item.label}</Text></TouchableOpacity>) : null}
        </View>

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
  genreList: {
    // position:'absolute',
    flex: 1,
    // top: 49,
    zIndex: 1,
    width: '100%'
  },
  listText: {
    flex:1,
    padding: 10,
    fontSize:18,
    backgroundColor:'#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2'
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
    backgroundColor: 'white',
    borderRadius: 10
  },
  rowContainer: {
    width: width,
    flexDirection: "row",
    alignItems: "center",
    fontSize: 18,
    lineHeight: 23,
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#D8D8D8',
    paddingLeft: 10,
    backgroundColor: '#FDFDFD',
  },
  text: {
    fontSize: 16,
    color: colorTheme.DARK_COLOR
  },
  textInput: {
    alignSelf: 'flex-start',
    flexGrow: 1,
    padding: 0

  },
  inputContainer: {
    borderBottomWidth: 0,
    paddingVertical:7,
    marginTop: -10
  },
  input: {
    textAlign: 'right',
    backgroundColor: 'transparent',
    marginBottom: -3,
    paddingBottom: 0,
    color: '#777',
    fontSize: 15,
  }
});
