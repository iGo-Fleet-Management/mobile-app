import React from 'react';
import { View, StyleSheet } from 'react-native';
import DriverMapContainer from '../../components/home/DriverMapContainer';
import { useRoute, useNavigation } from '@react-navigation/native'; 

const ActiveTripScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const tripType = route.params?.tripType || 'ida';

  return (
    <View style={styles.container}>
      <DriverMapContainer tripType={tripType} navigation={navigation}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ActiveTripScreen;
