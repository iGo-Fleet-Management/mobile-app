import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const AlertBox = ({ 
  message, 
  onEditPress 
}) => {
  return (
    <View style={styles.alertBox}>
      <View style={styles.alertIconContainer}>
        <MaterialIcons name="error-outline" size={24} color="red" />
      </View>
      <Text style={styles.alertText}>{message}</Text>
      {onEditPress && (
        <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
          <MaterialIcons name="edit" size={20} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 12,
    margin: 10,
    marginTop: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  alertIconContainer: {
    marginRight: 10,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
  },
  editButton: {
    padding: 5,
  },
});

export default AlertBox;