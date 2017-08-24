import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Button,
  AsyncStorage
} from 'react-native';

import SignedOut from './Navigators.js';

export default class Logout extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Logout'
  }

  async _onLogout() {
    try {
      await AsyncStorage.removeItem('token')
      .then(() => this.props.navigation.navigate('SignedOut'))
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          onPress={() => this.props.navigation.navigate('DrawerOpen')}
          title="Navigate"
        />
        <TouchableOpacity onPress={() => this._onLogout()}>
          <Text style={styles.registerText}>Logout</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCEDFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerText: {
    fontFamily: 'Hind-Light',
    fontSize: 25,
    color: '#2191FB'
  },
});
