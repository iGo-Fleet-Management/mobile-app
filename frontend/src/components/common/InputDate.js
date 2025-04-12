import React, { useState, useEffect } from 'react';
import { TextInput, View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export function InputDate({ value, onChangeText, style, placeholder, label, required, error }) {
  const [formattedValue, setFormattedValue] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    // Format the date when the value changes externally
    if (value) {
      if (typeof value === 'string') {
        setFormattedValue(value);
        // Try to parse the date string to set internal date state
        const parts = value.split('/');
        if (parts.length === 3) {
          const newDate = new Date(
            parseInt(parts[2]), // year
            parseInt(parts[1]) - 1, // month (0-indexed)
            parseInt(parts[0]) // day
          );
          if (!isNaN(newDate.getTime())) {
            setDate(newDate);
          }
        }
      } else if (value instanceof Date) {
        const day = value.getDate().toString().padStart(2, '0');
        const month = (value.getMonth() + 1).toString().padStart(2, '0');
        const year = value.getFullYear();
        const formatted = `${day}/${month}/${year}`;
        setFormattedValue(formatted);
        setDate(value);
      }
    } else {
      setFormattedValue('');
    }
  }, [value]);

  const formatDate = (text) => {
    // Remove non-numeric characters and limit to 8 characters
    let cleaned = text.replace(/\D/g, '').substring(0, 8);
    
    // Format as DD/MM/YYYY
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2);
    }
    if (cleaned.length > 4) {
      formatted = formatted.substring(0, 5) + '/' + formatted.substring(5);
    }
    
    setFormattedValue(formatted);
    
    // Try to create a Date object
    if (cleaned.length === 8) {
      const day = parseInt(cleaned.substring(0, 2));
      const month = parseInt(cleaned.substring(2, 4)) - 1; // JavaScript months are 0-indexed
      const year = parseInt(cleaned.substring(4, 8));
      
      const newDate = new Date(year, month, day);
      
      // Check if date is valid
      if (!isNaN(newDate.getTime())) {
        setDate(newDate);
      }
    }
    
    // Call the original onChangeText with the formatted value
    onChangeText(formatted);
  };

  const onDateChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios');
    
    if (selectedDate) {
      setDate(selectedDate);
      
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.getFullYear();
      
      const formatted = `${day}/${month}/${year}`;
      setFormattedValue(formatted);
      
      // Call the original onChangeText with the formatted value
      onChangeText(formatted);
    }
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      <TouchableOpacity 
        onPress={() => setShowPicker(true)} 
        activeOpacity={0.8}
      >
        <View style={[styles.inputContainer, error && styles.inputError, style]}>
          <TextInput
            style={styles.input}
            value={formattedValue}
            onChangeText={formatDate}
            placeholder={placeholder || "DD/MM/AAAA"}
            keyboardType="numeric"
            onFocus={() => {
              // On some devices, we might want to show the picker instead
              if (Platform.OS === 'ios') {
                setShowPicker(true);
              }
            }}
          />
          <MaterialIcons 
            name="calendar-today" 
            size={20} 
            color="#777" 
            style={styles.calendarIcon} 
          />
          {error && (
            <MaterialIcons name="error-outline" size={20} color="#FF3B30" style={styles.errorIcon} />
          )}
        </View>
      </TouchableOpacity>
      
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}
      
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