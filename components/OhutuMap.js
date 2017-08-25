import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Button,
  AsyncStorage,
  AlertIOS
} from 'react-native';
import MapView from 'react-native-maps';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

import Header from './Header.js';

export default class OhutuMap extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Map View',
  }

  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      region: null,
      gpsAccuracy: null,
    }
  }

  componentWillMount() {

    //////////////////////////////////////
    // HANDLE LOCATION / WATCH LOCATION //
    //////////////////////////////////////

    this.watchID = navigator.geolocation.watchPosition((position) => {
      let newPos = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.00125,
        longitudeDelta: 0.00125,
      }
      this.onRegionChange(newPos, position.coords.accuracy);
    }, (err) => console.log(err),
    {  enableHighAccuracy: false, timeout: 10000, maximumAge: 0, distanceFilter: 30});

    //////////////////////////////
    // UPDATE OTHER USER'S PINS //
    //////////////////////////////

    this.timerID = setInterval(() => {
      AsyncStorage.getItem('token')
      .then((token) => {
        axios.get('https://5ce92fb3.ngrok.io/markerList', {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          }
        })
        .then((markers) => {
          fetch('https://5ce92fb3.ngrok.io/getUser', {
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

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  createMarker(e) {
    var lat = e.nativeEvent.coordinate.latitude;
    var long = e.nativeEvent.coordinate.longitude;
    // authenticate user and grab user id
    AsyncStorage.getItem('token')
    .then((token) => {
      fetch('https://5ce92fb3.ngrok.io/getUser', {
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
        fetch('https://5ce92fb3.ngrok.io/createMarker', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({
            lat: lat,
            long: long,
            user: data.id
          })
        })
        .then(data => data.json())
        // save new marker to state
        .then(data => {
          var slicedMarkers = [...this.state.markers];
          var newMarker = {
            lat: data.lat,
            long: data.long,
          }
          slicedMarkers.push(newMarker);
          this.setState({
            markers: slicedMarkers
          });
        });
      });
    });
  }

  deleteMarker() {
    var oldMarkers = [...this.state.markers]
    // authenticate user and grab id
    AsyncStorage.getItem('token')
    .then((token) => {
      fetch('https://5ce92fb3.ngrok.io/getUser', {
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
      // delete marker with ref to user in database
      .then(data => {
        function reverse (a) {
          var b = [], counter = 0;
          for (var i = a.length-1; i >= 0; i -= 1) {
            b[counter] = a[i];
            counter += 1;
          }
          return b;
        }
        var markerToDelete;
        var index;
        var reversed = reverse(oldMarkers);
        for (var i = 0; i < reversed.length; i++) {
          if (reversed[i].color === '#57E2E5') {
            markerToDelete = reversed[i];
            index = i;
            break;
          }
        }
        if (index !== -1) {
          fetch('https://5ce92fb3.ngrok.io/deleteMarker', {
            method: 'DELETE',
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
              lat: markerToDelete.lat,
              long: markerToDelete.long,
              user: data.id
            })
          })
          .then(data => {
            oldMarkers.splice(index, 1);
          });
        }
      });
    });

  }

  onRegionChange(region, gpsAccuracy) {
      this.setState({
          region: region,
          gpsAccuracy: gpsAccuracy || this.state.gpsAccuracy
      });
  }


  render() {
    return (
      <View style={styles.container}>
        <Header navOptions={() => this.props.navigation.navigate('DrawerOpen')}/>
        <MapView.Animated
          style={{flex: 1}}
          showsUserLocation={true}
          followUserLocation={true}
          zoomEnabled={true}
          ref='map'
          region={this.state.region}
          onRegionChange={this.onRegionChange.bind(this)}
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
        </MapView.Animated>
        <TouchableOpacity onPress={() => this.deleteMarker()}>
          <View style={styles.undoButton}>
            <Icon name='undo' size={20} color='#E08DAC'/>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  undoButton: {
    position: 'absolute',
    right: 25,
    bottom: 25,
    height: 60,
    width: 60,
    backgroundColor: '#DCEDFF',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
