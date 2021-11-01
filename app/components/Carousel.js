import React, { Component } from 'react';
import { View, ScrollView, Image, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const height = width * 0.8;

export default class Carousel extends Component {
  render() {
    const { images } = this.props;
    if (images && images.length) {
      return (
        <View
          style={styles.scrollContainer}
        >
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          >
            {images.map(image => (
                <View>
   <Image style={styles.image} source={{uri: image}} />

                </View>
           
            ))}
          </ScrollView>
        </View>
      );
    }
    console.log('Please provide images');
    return null;    
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    height: '100%',
    position: 'absolute',
    borderRadius:10,
    overflow:'hidden'
  },
  image: {
    width: Dimensions.get('window').width - 40,
    height: '100%',
  },
});