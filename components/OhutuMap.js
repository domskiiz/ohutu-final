import React from 'react';
/************************
// THIS IS THE FINAL MAP
************************/
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Button,
  AsyncStorage
} from 'react-native';
import MapView from 'react-native-maps';
import axios from 'axios';

import Header from './Header.js';

export default class OhutuMap extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Map View',
  }

  constructor(props) {
    super(props);
    this.state = {
      lat: null,
      long: null,
      markers: [],
      // modalVisible: false,
      // conditionVar: true,
      // actuallyStarting: true,
      // markerLocation: 0,
      // pending: true,
      initialPosition: {},
      lastPosition: {}
    }
  }

  componentWillMount() {
    //////////////////////////////
    // UPDATE OTHER USER'S PINS //
    //////////////////////////////

    this.timerID = setInterval(() => {
      AsyncStorage.getItem('token')
      .then((token) => {
        axios.get('https://b9d8d4b2.ngrok.io/markerList', {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          }
        })
        .then((markers) => {
          fetch('https://b9d8d4b2.ngrok.io/getUser', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
              token: token
            })
          })
          .then((data) => data.json())
          .then((user) => {
            var newMarkers = [];
            markers.data.forEach((marker) => {
              let color = '#57E2E5'
              if (user.id !== marker.user) {
                color = 'black'
              }
              var newMarker = {
                lat: marker.lat,
                long: marker.long,
                color: color
              }
              newMarkers.push(newMarker);
            });
            this.setState({ markers: newMarkers})
          })
        })
      })
    }, 5000);
  }

  componentDidMount() {

    /////////////////////////////////////
    // HANDLE LOCATION, WATCH LOCATION //
    /////////////////////////////////////

    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position, 'GETTING CURRENT POSITION');
      this.setState({initialPosition: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.00125,
        longitudeDelta: 0.00125,
      }}, console.log(this.state.currentRegion, 'GET CURR POS STATE REGION'));
    },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );

    this.watchID = navigator.geolocation.watchPosition((position) => {
      console.log(position, 'WATCHING POSITION');
      let newPos = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.00125,
        longitudeDelta: 0.00125,
      }
      this.setState({lastPosition: newPos}, console.log(this.state.lastPosition, 'CURRENT REGION STATE'));
    },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 0, distanceFilter: 10}
    );

  }

  componentWillUnmount() {
    clearInterval(this.timerID);
    navigator.geolocation.clearWatch(this.watchID);
  }

  createMarker(e) {
    var lat = e.nativeEvent.coordinate.latitude;
    var long = e.nativeEvent.coordinate.longitude;
    var date = Date.now()
    console.log('this is the date rn:' + date)
    // authenticate user and grab user id
    AsyncStorage.getItem('token')
    .then((token) => {
      fetch('https://b9d8d4b2.ngrok.io/getUser', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          token: token
        })
      })
      .then((data) => data.json())
      // save marker with ref to user
      .then(data => {
        fetch('https://b9d8d4b2.ngrok.io/createMarker', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({
            lat: lat,
            long: long,
            user: data.id,
            createdAt: date
          })
        })
        .then(data => data.json())
        // save new marker to state
        .then(data => {
          var slicedMarkers = [...this.state.markers];
          var newMarker = {
            lat: data.lat,
            long: data.long,
            time: date
          }
          slicedMarkers.push(newMarker);
          this.setState({
            markers: slicedMarkers
          });
        });
      });
    });
  }


  render() {
    return (
      <View style={styles.container}>
        <Header navOptions={() => this.props.navigation.navigate('DrawerOpen')}/>
        <MapView
          style={{flex: 1}}
          showsUserLocation={true}
          followUserLocation={true}
          zoomEnabled={true}
          ref='map'
          initialRegion={this.state.lastPosition}
          onPress={(e) => this.createMarker(e)}
          >
            {this.state.markers.map((marker, i) => (
              <MapView.Marker key={i} draggable
                coordinate={{latitude: parseFloat(marker.lat),
                longitude: parseFloat(marker.long)}}
                pinColor={marker.color}
                title={"Sketchy Area!"}
                description={marker.description}
              />
            ))}
        </MapView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
