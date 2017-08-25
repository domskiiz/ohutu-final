import React from 'react';
/************************
// THIS IS THE FINAL MAP
************************/
import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  StyleSheet,
  Button,
  AsyncStorage,
  Modal
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
      modalVisible: false,
      // conditionVar: true,
      // actuallyStarting: true,
      markerLocation: 0,
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
              if (marker.description) {
                var newMarker = {
                  lat: marker.lat,
                  long: marker.long,
                  color: color,
                  description: marker.description,
                  createdAt: marker.createdAt
                }}
                else {
                  var newMarker = {
                    lat: marker.lat,
                    long: marker.long,
                    color: color,
                    createdAt: marker.createdAt
                  }
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

  setModalVisible(visible) {
  this.setState({modalVisible: visible});
}

  createMarker(e) {
    var daColor = '#57E2E5'
    if (this.state.markers.length > 0) {
      for (var k = 0; k < this.state.markers.length; k++) {
        if (e.nativeEvent.coordinate.latitude === this.state.markers[k].lat) {
          if (e.nativeEvent.coordinate.longitude === this.state.markers[k].long) {
            if (this.state.markers[k].color === daColor) {
              if (Object.keys(this.state.markers[k]).length > 4) {
                console.log(Object.keys(this.state.markers[k]).length)
                return;
              }
              else {
                console.log(Object.keys(this.state.markers[k]))
                this.setState({markerLocation: k})
                console.log('HEY')
                this.setModalVisible(true)
                return;
              }
            }

          }
        }
      }
    }
    var lat = e.nativeEvent.coordinate.latitude;
    var long = e.nativeEvent.coordinate.longitude;
    var date = Date.now()
    console.log('this is the date rn:' + date)
    // authenticate user and grab user id
    var kms = 0;
    for (var k = 0; k < this.state.markers.length; k++) {
      if (lat === this.state.markers[k].lat) {
        if (long === this.state.markers[k].long) {
          kms = kms + 1;
        }
      }
    }
    if (kms === 0) {
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
              createdAt: date
            }
            slicedMarkers.push(newMarker);
            this.setState({
              markers: slicedMarkers
            });

          });
        });
      });
    }
  }


  render() {
    console.log("****", this.state.markers)

    return (
      <View style={styles.container}>
        <Header navOptions={() => this.props.navigation.navigate('DrawerOpen')}/>
        <Modal
            animationType={"slide"}
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {alert("Modal has been closed.")}}
            >
              <View style={{marginTop: 250}}>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={{textAlign: 'center'}}>
                    Write a few words/short sentence on why you dropped the pin for other users to see! (Max character limit: 40)
                  </Text>
                  <TextInput style={{marginTop: 40}}
                    placeholder="Description"
                    maxLength= {40}
                    onChangeText={(text) => {
                      if (this.state.markers.length === 0) {
                        alert('Need to drop a pin first!')
                      }
                      else {
                        var slicedMarker = [...this.state.markers];
                        //console.log("saving this: ", slicedMarker[this.state.markerLocation]);
                        var updatingMarker = Object.assign({}, slicedMarker[this.state.markerLocation], {description: text});
                      //slicedMarker[this.state.markerLocation].description = text
                      console.log("updae ted: ", updatingMarker);
                      slicedMarker[this.state.markerLocation] = updatingMarker;
                      var lastDesc = slicedMarker[this.state.markerLocation].description

                      this.setState({
                        markers: slicedMarker
                      })}
                      fetch('https://b9d8d4b2.ngrok.io/markerDesc', {
                        method: 'POST',
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          lat: slicedMarker[this.state.markerLocation].lat,
                          long: slicedMarker[this.state.markerLocation].long,
                          description: lastDesc
                        })
                      })
                      .then(data => console.log(data))
                      .catch((err) => console.log("error fetching", err))
                    }}
                  />
                  <TouchableHighlight onPress={() => {
                    this.setModalVisible(!this.state.modalVisible)
                  }}>
                  <Text>Done</Text>
                </TouchableHighlight>

              </View>
            </View>
          </Modal>
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
              <MapView.Marker key={i}
                coordinate={{latitude: parseFloat(marker.lat),
                longitude: parseFloat(marker.long)}}
                pinColor={marker.color}
                title={marker.description}
                // description={marker.description}
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
