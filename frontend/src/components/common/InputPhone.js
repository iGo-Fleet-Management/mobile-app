import React, { useState, useEffect } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export function InputPhone({ value, onChangeText, style, placeholder, label, required, error }) {
  const [formattedValue, setFormattedValue] = useState('');

  useEffect(() => {
    // Format the phone when the value changes externally
    if (value) {
      formatPhone(value);
    } else {
      setFormattedValue('');
    }
  }, [value]);

  const formatPhone = (text) => {
    // Remove non-numeric characters
    let cleaned = text.replace(/\D/g, '');
    
    // Limit to 11 characters (including DDD)
    cleaned = cleaned.substring(0, 11);
    
    // Format as Phone: (XX) XXXXX-XXXX or (XX) XXXX-XXXX
    let formatted = cleaned;
    if (cleaned.length > 0) {
      formatted = '(' + cleaned.substring(0, 2);
    }
    if (cleaned.length > 2) {
      formatted += ') ' + cleaned.substring(2);
    }
    if (cleaned.length > 7) {
      // Mobile number (11 digits)
      formatted = formatted.substring(0, 10) + '-' + formatted.substring(10);
    } else if (cleaned.length > 6) {
      // Landline (10 digits)
      formatted = formatted.substring(0, 9) + '-' + formatted.substring(9);
    }
    
    setFormattedValue(formatted);
    
    // Call the original onChangeText with the raw value
    onChangeText(cleaned);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      <View style={[styles.inputContainer, error && styles.inputError, style]}>
        <TextInput
          style={styles.input}
          value={formattedValue}
          onChangeText={formatPhone}
          placeholder={placeholder || "(00) 00000-0000"}
          keyboardType="phone-pad"
        />
        {error && (
          <MaterialIcons name="error-outline" size={20} color="#FF3B30" style={styles.errorIcon} />
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      marginBottom: 15,
    },
    label: {
      fontSize: 15,
      marginBottom: 5,
      color: '#333',
    },
    required: {
      color: '#FF3B30',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      height: 48,
      paddingHorizontal: 10,
    },
    inputContainerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 5,
    },
    inputError: {
      borderColor: '#FF3B30',
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: '#333',
      height: '100%',
    },
    inputFlex: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      height: 48,
      paddingHorizontal: 10,
      fontSize: 16,
    },
    errorText: {
      color: '#FF3B30',
      fontSize: 12,
      marginTop: 5,
    },
    errorIcon: {
      marginLeft: 10,
    },
    calendarIcon: {
      padding: 5,
    },
    searchButton: {
      backgroundColor: '#4285F4',
      height: 48,
      width: 48,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      marginLeft: 10,
    },
    disabledButton: {
      backgroundColor: '#a0c4ff',
    },
  });