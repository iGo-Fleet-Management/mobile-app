import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const HelpItem = ({ 
  icon, 
  title, 
  description, 
  iconColor = '#4285F4' 
}) => {
  return (
    <View style={styles.helpItem}>
      <MaterialIcons name={icon} size={24} color={iconColor} />
      <View style={styles.helpTextContainer}>
        <Text style={styles.helpItemTitle}>{title}</Text>
        <Text style={styles.helpItemText}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  helpItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  helpTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  helpItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  helpItemText: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
  },
});

export default HelpItem;