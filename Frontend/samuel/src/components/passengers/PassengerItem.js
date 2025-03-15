import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const PassengerItem = ({ 
  name, 
  avatar, 
  onPress 
}) => {
  return (
    <TouchableOpacity style={styles.passengerItem} onPress={onPress}>
      <View style={styles.avatarContainer}>
        {avatar ? (
          <Image source={avatar} style={styles.avatar} />
        ) : (
          <MaterialIcons name="person" size={24} color="black" />
        )}
      </View>
      <Text style={styles.passengerName}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  passengerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  passengerName: {
    fontSize: 16,
  },
});

export default PassengerItem;