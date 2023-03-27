/* eslint-disable prettier/prettier */
import React, { Component } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigators/StackNavigator';



export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    );
  }
}
