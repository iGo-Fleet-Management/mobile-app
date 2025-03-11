import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ContactSection = ({ onContactPress }) => {
  return (
    <View style={styles.contactContainer}>
      <Text style={styles.contactTitle}>Precisa de mais ajuda?</Text>
      <TouchableOpacity 
        style={styles.contactButton} 
        onPress={onContactPress}
      >
        <Text style={styles.contactButtonText}>Contatar Suporte</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  contactContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  contactButton: {
    backgroundColor: '#3f51b5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  contactButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
});

export default ContactSection;