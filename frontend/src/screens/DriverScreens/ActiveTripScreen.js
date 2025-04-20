import React from 'react';
import { View, StyleSheet } from 'react-native';
import DriverMapContainer from '../../components/home/DriverMapContainer';

const ActiveTripScreen = () => {
  return (
    <View style={styles.container}>
      <DriverMapContainer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ActiveTripScreen;
