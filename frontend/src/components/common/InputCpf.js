import React, { useState, useEffect } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export function InputCpf({ value, onChangeText, style, placeholder, label, required, error }) {
  const [formattedValue, setFormattedValue] = useState('');

  useEffect(() => {
    // Format the CPF when the value changes externally
    if (value) {
      formatCpf(value);
    } else {
      setFormattedValue('');
    }
  }, [value]);

  const formatCpf = (text) => {
    // Remove non-numeric characters
    let cleaned = text.replace(/\D/g, '');
    
    // Limit to 11 characters
    cleaned = cleaned.substring(0, 11);
    
    // Format as CPF: XXX.XXX.XXX-XX
    let formatted = cleaned;
    if (cleaned.length > 3) {
      formatted = cleaned.substring(0, 3) + '.' + cleaned.substring(3);
    }
    if (cleaned.length > 6) {
      formatted = formatted.substring(0, 7) + '.' + formatted.substring(7);
    }
    if (cleaned.length > 9) {
      formatted = formatted.substring(0, 11) + '-' + formatted.substring(11);
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
          onChangeText={formatCpf}
          placeholder={placeholder || "000.000.000-00"}
          keyboardType="numeric"
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