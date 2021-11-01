import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-elements';
import FastImage, { FastImageProps } from 'react-native-fast-image'
const { width } = Dimensions.get('window');


export default class ImagesUser extends Component {
  constructor(props) {
      super(props);
      this.state = {
        page: 0
      }
    }

    nextImage = (page)=> {
      const { spacing } = this.props;
        /*this.setState({
            page:  this.state.page < this.props.images.length-1 ?  this.state.page +1 : 0
        })*/
        this.setState({
            page:  this.state.page < this.props.images.length-1 ?  this.state.page + 1 : 0 }, () => {
            this.scroll.scrollTo({x: (width - spacing) * this.state.page, y: 0, animated: true});
        })
        //this.scrollView.scrollTo({x: 0, y: this.state.position, animated: true})
    }
    prevImage = ()=> {
      const { spacing } = this.props;
      this.setState({
          page:  this.state.page === 0 ? this.props.images.length-1 : this.state.page - 1 }, () => {
          this.scroll.scrollTo({x: (width - spacing) * this.state.page, y: 0, animated: true});
      })

    }


    render() {
        const { images, index, radius, spacing, bullets } = this.props;

        if (images && (images.length > 1)) {
            return (
              <View style={[styles.imageContent, {borderRadius: radius}]}>
                <ScrollView
                contentContainerStyle={styles.scrollContainer}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={200}
                decelerationRate="fast"
                pagingEnabled
                ref={(c) => {this.scroll = c}}
                >
                {images.sort((a, b) => a.photoType && a.photoType.localeCompare(b.photoType && b.photoType)).sort((a, b) => a.photoOrder - b.photoOrder).map((image, index) =>
                  <View style={{width: width - spacing, height: '100%'}} key={`image_${index}`}>
                      <FastImage key={image.photoId} style={{borderRadius: radius, width: width - spacing, height: '100%'}, styles.image} source={{ uri: image.photoUrl }}   PlaceholderContent={<ActivityIndicator />}/>
                  </View>
                )}
                </ScrollView>
                <View style={styles.imageNav}>
                    <TouchableOpacity style={styles.prevImage} onPress={this.prevImage}>
                    

                        <FastImage style={styles.navigator, { width: 12, height: 18, tintColor: '#fff', opacity: 0.65 }} source={require('../assets/images/icons/prev.png')} />
                    </TouchableOpacity>
                    <View style={[styles.indicators, bullets == 'top' ? styles.indicatorsTop : styles.indicatorsBottom ]}>
                        {images && images.map((image, index) =><View style={[styles.bullet, index === this.state.page && styles.bulletActive ]} key={index}></View>)}
                    </View>

                    <TouchableOpacity style={styles.nextImage} onPress={this.nextImage}>
                        <FastImage style={styles.navigator, { width: 12, height: 18, tintColor: '#fff', opacity: 0.65 }} source={require('../assets/images/icons/next.png')} />
                    </TouchableOpacity>
                </View>
              </View>
            );
        } else {
          return (
            <View style={[styles.imageContent, {borderRadius: radius}]}>
              <View style={[styles.scrollContainer], {borderRadius: radius, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgb(222,222,222)', height: '100%'}}>
                <View style={{paddingBottom: 100}}>
                  <FastImage style={{width: 100, height: 100,}} source={{uri: 'https://www.openpediatrics.org/sites/default/files/defaultUser.jpg'}} PlaceholderContent={<ActivityIndicator />} />
                </View>
              </View>
            </View>
          )
        }
        //console.warn(this.props)
        return null;
    }
}

const styles = StyleSheet.create({
    scrollContainer: {
        height: '100%',
        overflow: 'hidden',
    },
    imageContent: {
        flex: 1,
        width: '100%',
        height: "100%",
        position: 'absolute',
        overflow: 'hidden',
        backgroundColor: 'rgb(222,222,222)',

    },
    imageNav: {
        flex: 1,
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        bottom: 0,
        position: 'absolute',
        zIndex: 999999
    },
    nextImage: {
      position: 'relative',
      width: '50%',
      paddingRight: 25,
      height: '100%',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    prevImage: {
      position: 'relative',
      width: '50%',
      height: '100%',
      paddingLeft: 25,
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    indicator: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        height: 25,
    },
    indicators: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      flexDirection: 'row',
      height: 25,
      position: 'absolute',
      zIndex: -1
    },
    indicatorsTop: {
      top: 25,
    },
    indicatorsBottom: {
      bottom: 25,
    },


    bullet: {
        width: 10,
        height: 10,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "#fff",
        opacity: 0.7,
        marginLeft:3,
        marginRight: 3
    },
    bulletActive: {
        backgroundColor: '#fff'
    },
    image: {
        width: Dimensions.get('window').width,
        height: '100%',
    },
});
