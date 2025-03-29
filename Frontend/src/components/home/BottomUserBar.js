import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import UserIcon from '../common/UserIcon';

const BottomUserBar = ({ userName }) => {
  return (
    <View style={styles.bottomBar}>
      <Text style={styles.bottomText}>Próximo a embarcar:</Text>
      <View style={styles.userContainer}>
        <View style={styles.userIconContainer}>
          <MaterialIcons name="person" size={24} color="black" />
        </View>
        <Text style={styles.userName}>{userName}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  bottomText: {
    fontSize: 14,
    marginRight: 10,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default BottomUserBar;