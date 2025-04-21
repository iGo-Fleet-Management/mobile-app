import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ToggleVisibility = ({ isVisible, onToggle }) => {
  return (
    <TouchableOpacity
      onPress={onToggle}
      style={{
        position: 'absolute',
        right: 12,
        top: '50%',
        transform: [{ translateY: -8 }],
        padding: 4,
        zIndex: 10
      }}
    >
      <Ionicons name={isVisible ? 'eye-off' : 'eye'} size={24} color="#999" />
    </TouchableOpacity>
  );
};

export default ToggleVisibility;