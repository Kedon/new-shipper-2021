// Setting screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View, Image, TouchableOpacity, Animated, StyleSheet, Dimensions, ScrollView, FlatList, SafeAreaView } from 'react-native';
import { List, ListItem, Avatar } from 'react-native-elements';
import { whileStatement } from '@babel/types';
const { width } = Dimensions.get('window');
import colorTheme from '../config/theme.style'
import moment from "moment";
import FastImage, { FastImageProps } from 'react-native-fast-image'

//import all the components we are going to use.

class CouponsCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.items
    }
    console.warn(this.props.items)
  }

    render() {
        const { navigation, items } = this.props;
        return (
            <FlatList style={styles.itemList}
              data={items}
              keyExtractor={item => item.couponId}
              renderItem={({ item }) => {
                return (
                  /*<ListItem onPress={() => this.props.navigation.navigate('CouponsDetails', {couponId: item.couponId, backScreen: this.props.backScreen})}
                    friction={90}
                    tension={100}
                    activeScale={0.95} //
                    leftAvatar={
                      <View style={{borderRadius: 5, overflow: 'hidden', borderColor: '#F1F1F1', borderWidth: 1}}>
                      <FastImage
                          style={styles.avatarStyle}
                          source={item.banner && { uri: item.banner }}
                        />
                        </View>
                    }
                    key={item.id}
                    title={
                      <View>
                        <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
                      </View>
                    }
                    titleStyle={styles.title}
                    subtitle={
                      <View>
                        <View style={styles.subtitleView}>
                          <Text style={styles.subtitle} numberOfLines={2}>{item.description}</Text>
                        </View>
                        {
                          (item.activated) ? (
                            <View style={styles.subtitleView}>
                              <Text style={styles.expiration}>Ativado em {moment(item.activated).format("DD/MM/YYYY")}</Text>
                            </View>
                          ) : (item.used) ? (
                            <View style={styles.subtitleView}>
                              <Text style={styles.expiration}>Utilizado em {moment(item.activated).format("DD/MM/YYYY")}</Text>
                            </View>
                          ) : (
                            <View style={styles.subtitleView}>
                              <Text style={styles.expiration}>Expira em {moment(item.expiration).format("DD/MM/YYYY")}</Text>
                            </View>
                          )

                        }
                      </View>
                    }
                    subtitleStyle={styles.subtitle}
                    bottomDivider

                  />*/
                  <ListItem key={item.id} bottomDivider onPress={() => navigation.navigate('CouponsDetails', {couponId: item.couponId, backScreen: this.props.backScreen, title: item.name}) }>
                  <View style={{borderRadius: 5, overflow: 'hidden', borderColor: '#F1F1F1', borderWidth: 1}}>
                    <FastImage
                        style={styles.avatarStyle}
                        source={item.banner && { uri: item.banner }}
                      />
                  </View>
                  <ListItem.Content>
                    <ListItem.Title>
                      <View>
                        <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
                      </View>
                    </ListItem.Title>
                    <ListItem.Subtitle>
                      <View>
                          <View style={styles.subtitleView}>
                            <Text style={styles.subtitle} numberOfLines={2}>{item.description}</Text>
                          </View>
                          {
                            (item.activated) ? (
                              <View style={styles.subtitleView}>
                                <Text style={styles.expiration}>Ativado em {moment(item.activated).format("DD/MM/YYYY")}</Text>
                              </View>
                            ) : (item.used) ? (
                              <View style={styles.subtitleView}>
                                <Text style={styles.expiration}>Utilizado em {moment(item.activated).format("DD/MM/YYYY")}</Text>
                              </View>
                            ) : (
                              <View style={styles.subtitleView}>
                                <Text style={styles.expiration}>Expira em {moment(item.expiration).format("DD/MM/YYYY")}</Text>
                              </View>
                            )

                          }
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
      fontWeight: '600',
      fontSize: 17,
      marginBottom: 3,
      color: colorTheme.DARK_COLOR,
      width: width - 140
    },
    avatarContainer: {
      backgroundColor: '#FFF',
    },
    avatarStyle: {
      backgroundColor: '#EDEDED',
      width: 90,
      height: 90,
      borderRadius: 10
    },
    subtitle: {
      fontSize: 14,
      color: colorTheme.TEXT_MUTED,
      marginBottom: 8,
      width: width - 145

    },
    expiration: {
      fontSize: 14,
      color: colorTheme.TEXT_MUTED,
      fontWeight: '600'
    }
};

export default (CouponsCard);
