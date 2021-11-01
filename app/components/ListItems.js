// Setting screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, Image, TouchableOpacity, Animated, StyleSheet, Dimensions, ScrollView, FlatList, SafeAreaView } from 'react-native';
import { List, ListItem, Avatar } from 'react-native-elements';
import { whileStatement } from '@babel/types';
const { width } = Dimensions.get('window');
import colorTheme from '../config/theme.style';
import FastImage, { FastImageProps } from 'react-native-fast-image'

//import all the components we are going to use.

class ListItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.items
    }
  }

    render() {
        const { navigation } = this.props;
        return (
            <FlatList style={styles.itemList}
              data={this.state.items}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                return (
                  /*<ListItem onPress={() => navigation.navigate(item.destination)}
                    friction={90} //
                    tension={100} // These props are passed to the parent component (here TouchableScale)
                    activeScale={0.95} //
                    leftAvatar={
                      <FastImage
                          style={styles.avatarStyle}
                          source={item.icon && item.icon }
                        />
                    }
                    key={item.id}
                    title={item.title}
                    titleStyle={styles.title}
                    subtitle={
                      <View style={styles.subtitleView}>
                        <Text style={styles.subtitle}>{item.subtitle}</Text>
                      </View>
                    }
                    subtitleStyle={styles.subtitle}
                    bottomDivider

                  />*/
                  <ListItem key={item.id} bottomDivider onPress={() => this.props.onPress(item.destination)}>
                    <FastImage
                      style={styles.avatarStyle}
                      source={item.icon && item.icon }
                    />

                    <ListItem.Content>
                      <ListItem.Title>{item.title}</ListItem.Title>
                      <ListItem.Subtitle>
                        <View style={styles.subtitleView}>
                          <Text style={styles.subtitle}>{item.subtitle}</Text>
                        </View>
                      </ListItem.Subtitle>
                    </ListItem.Content>
                  </ListItem>
                );
              }}
            />
        );
    }
}


const styles = {
    itemList: {
      width: width
    },
    title: {
      fontWeight: '400',
      fontSize: 17,
      marginBottom: 3,
      color: colorTheme.DARK_COLOR
    },
    avatarContainer: {
      backgroundColor: '#FFF',
    },
    avatarStyle: {
      backgroundColor: '#FFF',
      width: 29,
      height: 29
    },
    subtitle: {
      fontWeight: '400',
      fontSize: 15,
      color: colorTheme.TEXT_MUTED
    }
};

export default (ListItems);
