import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const AddPassengerButton = ({ onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.addButton} 
      onPress={onPress}
    >
      <Text style={styles.addButtonText}>Adicionar passageiro</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: '#3f51b5',
    padding: 15,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddPassengerButton;