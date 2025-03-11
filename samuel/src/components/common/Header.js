import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Header = ({ 
  title, 
  onMenuPress, 
  rightIcon, 
  onRightIconPress,
  style 
}) => {
  return (
    <View style={[styles.header, style]}>
      {onMenuPress && (
        <TouchableOpacity onPress={onMenuPress}>
          <MaterialIcons name="menu" size={28} color="black" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      {rightIcon && onRightIconPress && (
        <TouchableOpacity onPress={onRightIconPress}>
          <MaterialIcons name={rightIcon} size={24} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
});

export default Header;