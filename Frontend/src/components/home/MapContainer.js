import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const MapContainer = ({ source }) => {
  return (
    <View style={styles.mapContainer}>
      <Image 
        source={source}
        style={styles.mapImage}
        resizeMode="cover"
      />
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
  mapImage: {
    width: '100%',
    height: '100%',
  },
});

export default MapContainer;