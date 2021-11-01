// Setting screen
import React, { Component } from 'react';
//import react in our code.
import { Text, View } from 'react-native';
//import all the components we are going to use.

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          books: [
            {
              id: 1,
              title: 'Harry Potter and the Goblet of Fire',
              author: 'J. K. Rowling',
              thumbnail: 'https://covers.openlibrary.org/w/id/7984916-M.jpg'
            },
            {
              id: 2,
              title: 'The Hobbit',
              author: 'J. R. R. Tolkien',
              thumbnail: 'https://covers.openlibrary.org/w/id/6979861-M.jpg'
            },
            {
              id: 3,
              title: '1984',
              author: 'George Orwell',
              thumbnail: 'https://covers.openlibrary.org/w/id/7222246-M.jpg'
            }
          ]
        }
      }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Register Screen</Text>
      </View>
    );
  }
}
export default RegisterPage;