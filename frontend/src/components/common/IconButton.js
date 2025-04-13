import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function IconButton ({ 
  iconName,
  size = 24,
  color = 'black',
  onPress,
  style
}) {
  return (
    <TouchableOpacity 
      style={[styles.iconButton, style]} 
      onPress={onPress}
    >
      <MaterialIcons name={iconName} size={size} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    padding: 10
  },
});