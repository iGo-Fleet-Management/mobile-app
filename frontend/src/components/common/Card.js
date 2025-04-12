import React from 'react';
import { View, StyleSheet } from 'react-native';
import { commonStyles, colors, spacing, shadows } from '../../styles/globalStyles';

const Card = ({ children, style, variant = 'default' }) => {
  return (
    <View style={[
      commonStyles.card,
      variant === 'elevated' && shadows.medium,
      style,
    ]}>
      {children}
    </View>
  );
};

export default Card; 