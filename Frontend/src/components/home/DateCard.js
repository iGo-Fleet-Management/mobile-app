import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TravelModeSelector from './TravelModeSelector';

const DateCard = ({ 
  dayOfWeek, 
  date, 
  selectedMode, 
  onSelectMode 
}) => {
  return (
    <View style={styles.dateCard}>
      <Text style={styles.dayOfWeek}>{dayOfWeek}</Text>
      <Text style={styles.date}>{date}</Text>
      
      <TravelModeSelector 
        selectedMode={selectedMode}
        onSelectMode={onSelectMode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dateCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dayOfWeek: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  date: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 15,
  },
});

export default DateCard;