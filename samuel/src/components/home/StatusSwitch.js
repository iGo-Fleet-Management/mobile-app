import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import IconButton from '../common/IconButton';

const StatusSwitch = ({ 
  value, 
  onValueChange, 
  onHelpPress 
}) => {
  return (
    <View style={styles.switchContainer}>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#e0e0e0", true: "#c8e6c9" }}
        thumbColor={value ? "#4caf50" : "#f5f5f5"}
      />
      <Text style={styles.switchLabel}>Liberado</Text>
      <IconButton 
        name="info-outline" 
        onPress={onHelpPress} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    margin: 10,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  switchLabel: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
});

export default StatusSwitch;