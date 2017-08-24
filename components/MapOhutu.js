import React from 'react';
import {
  AsyncStorage,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableHighlight,
  TextInput
} from 'react-native';
import MapView from 'react-native-maps';

// class Map extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       lat: '',
//       long: '',
//       latitudeDelta: 0.00125,
//       longitudeDelta: 0.00125,
//       marker: [],
//       fontLoaded: false,
//       modalVisible: false,
//       conditionVar: true,
//       actuallyStarting: true,
//       markerLocation: 0
//     }
//   }
//
//   setModalVisible(visible) {
//     this.setState({modalVisible: visible});
//   }
//   componentDidMount() {
//     this.setState({
//       fontLoaded: true
//     })
//   }
//   // async componentDidMount() {
//   //   await Font.loadAsync({
//   //     'OswaldBold': require('./assets/fonts/Oswald-Bold.ttf')
//   //   });
//   //   await Font.loadAsync({
//   //     'glyph': require('./assets/fonts/glyph.ttf')
//   //   });
//   //   this.setState({
//   //     fontLoaded: true
//   //   })
//   // }
//   zoomOut() {
//     var updatedLatDelta = this.state.latitudeDelta + 0.001;
//     var updatedLongDelta = this.state.longitudeDelta + 0.001;
//     this.setState({
//       latitudeDelta: updatedLatDelta,
//       longitudeDelta: updatedLongDelta
//     })
//   }
//   zoomIn() {
//     if (parseFloat(this.state.latitudeDelta.toFixed(5)) <= 0.00025) {
//       this.setState({
//         latitudeDelta: this.state.latitudeDelta,
//         longitudeDelta: this.state.longitudeDelta
//       })
//     }
//     else {
//       var updatedLatDelta = this.state.latitudeDelta - 0.001;
//       var updatedLongDelta = this.state.longitudeDelta - 0.001;
//       this.setState({
//         latitudeDelta: updatedLatDelta,
//         longitudeDelta: updatedLongDelta
//       })
//     }
//   }
//   deleteMarker() {
//     var oldMarkers = [...this.state.marker]
//     var lastLat = oldMarkers[oldMarkers.length -1].lat
//     var lastLong = oldMarkers[oldMarkers.length-1].long
//     fetch('http://localhost:3000/markerDelete', {
//       method: 'DELETE',
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         lat: lastLat,
//         long: lastLong
//       })
//     })
//     .then(data => console.log(data))
//     .catch((err) => console.log("error fetching", err))
//     oldMarkers.pop();
//     this.setState({
//       marker: oldMarkers
//     })
//   }
//   clearEm() {
//     var oldMarkers = [...this.state.marker]
//     for (var k = 0; k < oldMarkers.length; k++) {
//       var lastLat = oldMarkers[k].lat;
//       var lastLong = oldMarkers[k].long
//
//       fetch('http://localhost:3000/markerDelete', {
//         method: 'DELETE',
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           lat: lastLat,
//           long: lastLong
//         })
//       })
//       .then(data => console.log(data))
//       .catch((err) => console.log("error fetching", err))
//     }
//     oldMarkers = [];
//
//     this.setState({
//       marker: oldMarkers,
//       actuallyStarting: false
//     })
//   }
//
//   render() {
//     if (this.state.fontLoaded) {
//       return (
//         <View style={styles.container}>
          // <View style={{flex: 0.125, backgroundColor: 'skyblue', justifyContent: 'center'}}>
          //   <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
          //     onPress={() => {
          //       if (this.state.actuallyStarting) {
          //         this.clearEm()
          //       }
          //       navigator.geolocation.getCurrentPosition(
          //         (success) => {
          //           this.setState({
          //               lat: success.coords.latitude,
          //               long: success.coords.longitude
          //           });
          //         }
          //       )
          //     }}>
          //     <Text></Text>
          //     <Text style={{fontSize: 18,}}> OHUTU! </Text>
          //     <Text> Click me to find your current location! </Text>
          //   </TouchableOpacity>
          // </View>
//           <MapView style={{flex:1}}
//             showsUserLocation={true}
//             followUserLocation={true}
//             zoomEnabled={true}
//             ref='map'
//             onPress={(e) => {
//               if (this.state.marker.length > 0) {
//                 for (var k = 0; k < this.state.marker.length; k++) {
//                   if (e.nativeEvent.coordinate.latitude === this.state.marker[k].lat) {
//                     if (e.nativeEvent.coordinate.longitude === this.state.marker[k].long) {
//                       // save k as a state
//
//                       if (Object.keys(this.state.marker[k]).length > 2) {
//                         // alert('Pin already placed here!')
//                         return;
//                       }
//                       else {
//                         this.setState({markerLocation: k})
//                         this.setModalVisible(true)
//                         return;
//                       }
//                     }
//                   }
//                 }
//                 var slicedMarker = [...this.state.marker];
//                 //this.state.pinsYet = true
//                 var newMarker = {
//                   lat: e.nativeEvent.coordinate.latitude,
//                   long: e.nativeEvent.coordinate.longitude,
//                 }
//                 slicedMarker.push(newMarker);
//                 this.setState({
//                   marker: slicedMarker,
//                 })
//
//                 fetch('http://localhost:3000/markerCoords', {
//                   method: 'POST',
//                   headers: {
//                     "Content-Type": "application/json",
//                   },
//                   body: JSON.stringify({
//                     lat: e.nativeEvent.coordinate.latitude,
//                     long: e.nativeEvent.coordinate.longitude
//                   })
//                 })
//                 .then(data => (data))
//                 .catch((err) => console.log("error fetching", err))
//               }
//               else {
//                 var slicedMarker = [...this.state.marker];
//                 //this.state.pinsYet = true
//                 var newMarker = {
//                   lat: e.nativeEvent.coordinate.latitude,
//                   long: e.nativeEvent.coordinate.longitude,
//                 }
//                 fetch('http://localhost:3000/markerCoords', {
//                   method: 'POST',
//                   headers: {
//                     "Content-Type": "application/json",
//                   },
//                   body: JSON.stringify({
//                     lat: e.nativeEvent.coordinate.latitude,
//                     long: e.nativeEvent.coordinate.longitude
//                   })
//                 })
//                 .then(data => (data))
//                 .catch((err) => console.log("error fetching", err))
//                 slicedMarker.push(newMarker);
//                 this.setState({
//                   marker: slicedMarker,
//                 })
//               }
//
//             }}
//             initialRegion={{
//               latitude: 37.777078,
//               longitude: -122.407733,
//               latitudeDelta: 0.00125,
//               longitudeDelta: 0.00125
//             }}
//             region={{
//               latitude: parseFloat(this.state.lat),
//               longitude: parseFloat(this.state.long),
//               latitudeDelta: parseFloat(this.state.latitudeDelta),
//               longitudeDelta: parseFloat(this.state.longitudeDelta)
//             }}
//             onRegionChangeComplete={(region) => this.setState({
//               lat: region.latitude,
//               long: region.longitude,
//             })}
//             >
//               <Modal
//                 animationType={"slide"}
//                 transparent={false}
//                 visible={this.state.modalVisible}
//                 onRequestClose={() => {alert("Modal has been closed.")}}
//                 >
//                   <View style={{marginTop: 250}}>
//                     <View style={{alignItems: 'center', justifyContent: 'center'}}>
//                       <Text style={{textAlign: 'center', fontFamily: 'OswaldBold'}}>
//                         Write a few words/short sentence on why you dropped the pin for other users to see!
//                       </Text>
//                       <TextInput style={{marginTop: 40}}
//                         placeholder="Description"
//                         onChangeText={(text) => {
//                           if (this.state.marker.length === 0) {
//                             alert('Need to drop a pin first!')
//                           }
//                           else {var slicedMarker = [...this.state.marker];
//                           slicedMarker[this.state.markerLocation].description= text
//                           var lastDesc = slicedMarker[this.state.markerLocation].description
//
//                           this.setState({
//                             marker: slicedMarker
//                           })}
//                           fetch('http://localhost:3000/markerDesc', {
//                             method: 'POST',
//                             headers: {
//                               "Content-Type": "application/json",
//                             },
//                             body: JSON.stringify({
//                               lat: slicedMarker[this.state.markerLocation].lat,
//                               long: slicedMarker[this.state.markerLocation].long,
//                               description: lastDesc
//                             })
//                           })
//                           .then(data => console.log(data))
//                           .catch((err) => console.log("error fetching", err))
//                         }}
//                       />
//                       <TouchableHighlight onPress={() => {
//                         this.setModalVisible(!this.state.modalVisible)
//                       }}>
//                       <Text style>Done</Text>
//                     </TouchableHighlight>
//
//                   </View>
//                 </View>
//               </Modal>
//               {this.state.marker.map((marker, i) => (
//                 <MapView.Marker key={i} draggable
//                   coordinate={{latitude: parseFloat(marker.lat),
//                   longitude: parseFloat(marker.long)}}
//                   onDragEnd={(e) => {
//                     //console.log('e coord', e.nativeEvent.coordinate);
//                     this.setState({coordinate: e.nativeEvent.coordinate})
//                   }}
//                   pinColor={'black'}
//                   title={"Sketchy Area!"}
//                   description={marker.description}
//                 />
//               ))}
//           </MapView>
//             <View style={{flex: 0.125, flexDirection: 'row', backgroundColor: 'skyblue'}}>
//             <TouchableOpacity
//               style={{flex: 1,
//                 borderWidth: 1,
//                 alignItems: 'center',
//                 justifyContent: 'center'}}
//               onPress={() => this.zoomOut()}
//             >
//               <Text style={{fontSize: 22}}>&#xe016;</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={{flex: 1,
//                 borderWidth: 1,
//                 alignItems: 'center',
//                 justifyContent: 'center'}}
//               onPress={() => this.zoomIn()}
//               >
//                 <Text style={{fontSize: 22}}>&#xe015;</Text>
//             </TouchableOpacity>
//
//             <TouchableOpacity
//               style={{flex: 1,
//                 borderWidth: 1,
//                 alignItems: 'center',
//                 justifyContent: 'center'}}
//               onPress={() => {
//                 if (this.state.marker.length !== 0)
//                   this.deleteMarker()
//               }}
//               >
//                 <Text> Undo last pin drop </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       );
//     }
//     else {
//       return (<View><Text> Loading... </Text></View>)
//     }
//   }
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Map;
