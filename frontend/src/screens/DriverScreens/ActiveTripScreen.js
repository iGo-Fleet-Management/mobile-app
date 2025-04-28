import React from 'react';
import { View, StyleSheet } from 'react-native';
import DriverMapContainer from '../../components/home/DriverMapContainer';
import { useRoute } from '@react-navigation/native'; 

const ActiveTripScreen = () => {
  const route = useRoute();
  const tripType = route.params?.tripType || 'ida';
  console.log('Trip Type:', tripType); // Log the trip type to verify it's being passed correctly

  return (
    <View style={styles.container}>
      <DriverMapContainer tripType={tripType}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ActiveTripScreen;
