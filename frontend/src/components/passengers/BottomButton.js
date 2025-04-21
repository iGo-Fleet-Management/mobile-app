import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const AddPassengerButton = ({ text, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.addButton} 
      onPress={onPress}
    >
      <Text style={styles.addButtonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: '#4285F4',
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddPassengerButton;