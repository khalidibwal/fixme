// import React, { useState, useEffect } from "react";
// import { View, StyleSheet } from "react-native";
// import MapView, { PROVIDER_GOOGLE, AnimatedRegion } from "react-native-maps";
// import MapCard from "../../Component/Card/MapCard";
// import axios from "axios";


// export default function Tracker() {
//   const [location, setLocation] = useState(null);
//   const [errorMsg, setErrorMsg] = useState(null);

//   useEffect(() => {
//     (async () => {
      
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         setErrorMsg('Permission to access location was denied');
//         return;
//       }

//       let location = await Location.getCurrentPositionAsync({});
//       // setLocation(JSON.stringify(location));
//       console.warn(JSON.stringify(location))
//     })();
//   }, []);

//   return (
//     <View style={Styles.container}>
//       <MapView
//         style={Styles.map}
//         provider={PROVIDER_GOOGLE}
//         showsUserLocation
//         initialRegion={location}
//         followUserLocation={true}
//       />
//       <MapCard />
//     </View>
//   );
// }

// const Styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   map: {
//     width: "100%",
//     height: "100%",
//   },
// });

import React, { useEffect, useState } from "react"
import { StyleSheet, Text, View, Button, ActivityIndicator } from "react-native"
import * as TaskManager from "expo-task-manager"
import * as Location from "expo-location"
import MapView, { PROVIDER_GOOGLE, AnimatedRegion } from "react-native-maps";
import MapCard from "../../Component/Card/MapCard";

const LOCATION_TASK_NAME = "LOCATION_TASK_NAME"
let foregroundSubscription = null

// Define the background task for location tracking
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error(error)
    return
  }
  if (data) {
    // Extract location coordinates from data
    const { locations } = data
    const location = locations[0]
    if (location) {
      console.log("Location in background", location.coords)
    }
  }
})

export default function Tracker() {
  // Define position state: {latitude: number, longitude: number}
  let latlng = {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0
  }
  const [loading, setLoading] = useState(false)
  const [position, setPosition] = useState(null)
  const [mapRegion, setmapRegion] = useState(latlng);


  // Request permissions right after starting the app
  useEffect(() => {
    setLoading(true)
    const requestPermissions = async () => {
      const foreground = await Location.requestForegroundPermissionsAsync()
      if (foreground.granted) await Location.requestBackgroundPermissionsAsync()
    }
    requestPermissions();
    startForegroundUpdate();
  }, [])

  // Start location tracking in foreground
  const startForegroundUpdate = async () => {
    // Check if foreground permission is granted
    const { granted } = await Location.getForegroundPermissionsAsync()
    if (!granted) {
      console.log("location tracking denied")
      return
    }

    // Make sure that foreground location tracking is not running
    foregroundSubscription?.remove()

    // Start watching position in real-time
    foregroundSubscription = await Location.watchPositionAsync(
      {
        // For better logs, we set the accuracy to the most sensitive option
        accuracy: Location.Accuracy.BestForNavigation,
      },
      location => {
        setLoading(false)
        setPosition(location.coords)
        let latlng = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0041,
          longitudeDelta: 0.0021
        }
        setmapRegion(latlng)
      }
    )
  }

  // Stop location tracking in foreground
  const stopForegroundUpdate = () => {
    foregroundSubscription?.remove()
    setPosition(null)
  }

  // Start location tracking in background
  const startBackgroundUpdate = async () => {
    // Don't track position if permission is not granted
    const { granted } = await Location.getBackgroundPermissionsAsync()
    if (!granted) {
      console.log("location tracking denied")
      return
    }

    // Make sure the task is defined otherwise do not start tracking
    const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME)
    if (!isTaskDefined) {
      console.log("Task is not defined")
      return
    }

    // Don't track if it is already running in background
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    )
    if (hasStarted) {
      console.log("Already started")
      return
    }

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      // For better logs, we set the accuracy to the most sensitive option
      accuracy: Location.Accuracy.BestForNavigation,
      // Make sure to enable this notification if you want to consistently track in the background
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "Location",
        notificationBody: "Location tracking in background",
        notificationColor: "#fff",
      },
    })
  }

  // Stop location tracking in background
  const stopBackgroundUpdate = async () => {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    )
    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME)
      console.log("Location tacking stopped")
    }
  }

  return (
    <View style={styles.container}>
      {loading ?
      <>
      <ActivityIndicator size="large"/>
      <Text>Please wait...</Text>
      </> 
       : 
      <MapView
      showsUserLocation 
      style={{ alignSelf: 'stretch', height: '100%' }}
      region={mapRegion}
      followUserLocation={true}/>  }
      <MapCard />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    marginTop: 15,
  },
  separator: {
    marginVertical: 18,
    marginBottom:20
  },
})
