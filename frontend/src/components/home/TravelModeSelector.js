import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const TravelModeSelector = ({ 
  selectedMode, 
  onSelectMode 
}) => {
  const modes = [
    { 
      key: 'roundTrip', 
      label: 'Ida e volta', 
      icon: 'sync' 
    },
    { 
      key: 'oneWay', 
      label: 'Apenas ida', 
      icon: 'arrow-forward' 
    },
    { 
      key: 'returnOnly', 
      label: 'Apenas volta', 
      icon: 'arrow-back' 
    }
  ];

  return (
    <View style={styles.optionsContainer}>
      {modes.map((mode) => (
        <View key={mode.key} style={styles.optionRow}>
          <View style={styles.radioButton}>
            {selectedMode === mode.key && <View style={styles.radioButtonInner} />}
          </View>
          <TouchableOpacity 
            style={styles.optionButton} 
            onPress={() => onSelectMode(mode.key)}
          >
            <Text>{mode.label}</Text>
            <MaterialIcons name={mode.icon} size={18} color="black" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    marginTop: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#757575',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioButtonInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#3f51b5',
  },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 8,
  },
});

export default TravelModeSelector;