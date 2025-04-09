import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const MapContainer = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showMap, setShowMap] = useState(false);
  
  // Default region (Boston coordinates)
  const [region, setRegion] = useState({
    latitude: 42.3601,
    longitude: -71.0589,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  // Sample route coordinates
  const routeCoordinates = [
    { latitude: 42.3541, longitude: -71.0683 },
    { latitude: 42.3530, longitude: -71.0635 },
    { latitude: 42.3561, longitude: -71.0589 },
    { latitude: 42.3601, longitude: -71.0569 },
  ];

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setShowMap(false);
          return;
        }

        let userLocation = await Location.getCurrentPositionAsync({});
        setLocation(userLocation);
        setShowMap(true);
        
        if (userLocation) {
          setRegion({
            latitude: userLocation.coords.latitude,
            longitude: userLocation.coords.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          });
        }
      } catch (error) {
        console.error("Error setting up location:", error);
        setShowMap(false);
      }
    })();
  }, []);

  return (
    <View style={styles.mapContainer}>
      {showMap ? (
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
          // Remove PROVIDER_GOOGLE to use the default map provider
        >
          <Marker
            coordinate={{ latitude: 42.3601, longitude: -71.0569 }}
            title="City Hall Plaza"
            description="Destination"
            pinColor="red"
          />
          
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#000"
            strokeWidth={3}
          />
        </MapView>
      ) : (
        // Fallback image when map can't be shown
        <Image
          source={require('../../../assets/images/google-map-example-blog.png')}
          style={styles.fallbackImage}
          resizeMode="cover"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    margin: 10,
    marginTop: 5,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  fallbackImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  }
});

export default MapContainer;