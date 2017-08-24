import React, { Component } from 'react';
import {
  Text,
  View,
  AsyncStorage
} from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';

import Home from './Home.js';
import Login from './Login.js';
import Register from './Register.js';
import OhutuMap from './OhutuMap.js';
import Page2 from './Page2.js';
import MapOhutu from './MapOhutu.js';

export const SignedOut = StackNavigator({
  Home: { screen: Home },
  Login: { screen: Login },
  Register: { screen: Register },
})

export const SignedIn = DrawerNavigator({
  Map: { screen: OhutuMap },
  Page2: { screen: Page2 }
})
