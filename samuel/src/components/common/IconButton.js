import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const IconButton = ({ 
  name, 
  size = 24, 
  color = 'black', 
  onPress, 
  style 
}) => {
  return (
    <TouchableOpacity 
      style={[styles.iconButton, style]} 
      onPress={onPress}
    >
      <MaterialIcons name={name} size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    padding: 10,
  },
});

export default IconButton;