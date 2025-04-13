import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const UserIcon = ({ userName, onPress }) => {
  // Extract first letter of name for the icon if available
  const firstLetter = userName ? userName.charAt(0).toUpperCase() : '';
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.name} numberOfLines={1}>{userName || 'Usuário'}</Text>
      <View style={styles.iconContainer}>
        {firstLetter ? (
          <Text style={styles.letterText}>{firstLetter}</Text>
        ) : (
          <MaterialIcons name="person" size={24} color="white" />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3f51b5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  letterText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 14,
    color: '#333',
    maxWidth: 100,
  },
});

export default UserIcon;