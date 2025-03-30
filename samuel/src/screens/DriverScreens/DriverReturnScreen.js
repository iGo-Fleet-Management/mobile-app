import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const DriverReturnScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [selectedTrip, setSelectedTrip] = useState('volta');
  
  // Dados de exemplo
  const companyName = "Minions Vans";
  const date = new Date();
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  const totalPassengers = 5;
  const returnOnly = 1;
  const releasedPassengers = 3;
  const driverName = "Roni Cristian";
  
  const handleTripSelect = (tripType) => {
    if (tripType === 'ida') {
      navigation.navigate('DriverHomeScreen');
    } else {
      setSelectedTrip(tripType);
    }
  };
  
  const handleStartTrip = () => {
    // Navegação para a tela de trajeto ativo
    navigation.navigate('ActiveTrip');
  };
  
  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>iGO</Text>
        <View style={styles.profileContainer}>
          <Text style={styles.driverName}>{driverName}</Text>
          <TouchableOpacity style={styles.profileIcon}>
            <MaterialIcons name="person" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Company Name */}
      <Text style={styles.companyName}>{companyName}</Text>
      
      {/* Trip Type Selection */}
      <View style={styles.tripTypeContainer}>
        <TouchableOpacity
          style={[
            styles.tripTypeButton,
            selectedTrip === 'ida' && styles.selectedTripButton
          ]}
          onPress={() => handleTripSelect('ida')}
        >
          <Text style={[
            styles.tripTypeText,
            selectedTrip === 'ida' && styles.selectedTripText
          ]}>Ida</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tripTypeButton,
            selectedTrip === 'volta' && styles.selectedTripButton
          ]}
          onPress={() => handleTripSelect('volta')}
        >
          <Text style={[
            styles.tripTypeText,
            selectedTrip === 'volta' && styles.selectedTripText
          ]}>Volta</Text>
        </TouchableOpacity>
      </View>
      
      {/* Daily Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Resumo do Dia</Text>
        <Text style={styles.summaryDate}>{formattedDate}</Text>
        
        <View style={styles.summaryItemContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalPassengers}</Text>
            <Text style={styles.summaryLabel}>Passageiros</Text>
            <MaterialIcons name="people" size={16} color="#777" />
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{returnOnly}</Text>
            <Text style={styles.summaryLabel}>Somente volta</Text>
            <Ionicons name="arrow-back" size={16} color="#777" />
          </View>
        </View>

        <View style={[styles.summaryItemContainer, { marginTop: 10 }]}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{releasedPassengers}</Text>
            <Text style={styles.summaryLabel}>Liberados</Text>
            <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
          </View>
        </View>
      </View>
      
      {/* Start Trip Button */}
      <TouchableOpacity 
        style={styles.startTripButton}
        onPress={handleStartTrip}
      >
        <Text style={styles.startTripText}>Trajeto</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverName: {
    marginRight: 8,
    fontSize: 14,
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  tripTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  tripTypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginHorizontal: 5,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedTripButton: {
    backgroundColor: '#4285F4',
    borderColor: '#4285F4',
  },
  tripTypeText: {
    fontSize: 16,
    color: '#000',
  },
  selectedTripText: {
    color: '#fff',
  },
  summaryContainer: {
    marginHorizontal: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryDate: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  summaryItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#777',
    marginRight: 5,
  },
  startTripButton: {
    backgroundColor: '#4285F4',
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  startTripText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DriverReturnScreen; 