import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const SuggestedRouteScreen = () => {
  const navigation = useNavigation();
  const [tripType, setTripType] = useState('ida'); // 'ida' or 'volta'
  const [selectedPassengers, setSelectedPassengers] = useState([1, 2, 5]); // IDs of selected passengers
  const [passengersReleased, setPassengersReleased] = useState(true);
  
  // Mock passenger data with trip type information
  const passengerList = [
    { id: 1, name: 'Hugo de Melo', tripType: 'round' }, // Vai e volta
    { id: 2, name: 'Lucas Barcelos', tripType: 'ida' }, // Só ida
    { id: 3, name: 'Paulo Henrique', tripType: 'round' }, // Vai e volta
    { id: 4, name: 'Samuel Andrade', tripType: 'volta' }, // Só volta
    { id: 5, name: 'Rafael Galinari', tripType: 'round' }, // Vai e volta
  ];

  const handleStartTrip = () => {
    // Navigate to active trip screen
    navigation.navigate('ActiveTrip');
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const toggleTripType = (type) => {
    setTripType(type);
  };

  const togglePassengerSelection = (passengerId) => {
    setSelectedPassengers(prevSelected => {
      if (prevSelected.includes(passengerId)) {
        return prevSelected.filter(id => id !== passengerId);
      } else {
        return [...prevSelected, passengerId];
      }
    });
  };

  const togglePassengersReleased = () => {
    setPassengersReleased(!passengersReleased);
  };

  // Get direction icon based on passenger trip type
  const getDirectionIcon = (passenger) => {
    if (passenger.tripType === 'ida') {
      return <Ionicons name="arrow-forward" size={20} color="#4285F4" />;
    } else if (passenger.tripType === 'volta') {
      return <Ionicons name="arrow-back" size={20} color="#4285F4" />;
    } else if (passenger.tripType === 'round') {
      return <Ionicons name="swap-horizontal" size={20} color="#4285F4" />;
    }
    return null;
  };

  const renderPassengerItem = (passenger) => {
    const isSelected = selectedPassengers.includes(passenger.id);
    
    return (
      <View key={passenger.id} style={styles.passengerCard}>
        <View style={styles.passengerInfo}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <MaterialIcons name="person" size={20} color="#000" />
            </View>
          </View>
          <View style={styles.passengerDetails}>
            <Text style={styles.passengerName}>{passenger.name}</Text>
          </View>
        </View>
        
        {/* Show direction icon for Ida tab, checkbox for Volta tab */}
        <View style={styles.actionContainer}>
          {tripType === 'ida' ? (
            <View style={styles.directionContainer}>
              {getDirectionIcon(passenger)}
            </View>
          ) : (
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => togglePassengerSelection(passenger.id)}
            >
              <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                {isSelected && <MaterialIcons name="check" size={16} color="#fff" />}
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.tripTypeContainer}>
        <TouchableOpacity
          style={[styles.tripTypeButton, tripType === 'ida' && styles.selectedTripButton]}
          onPress={() => toggleTripType('ida')}
        >
          <Text style={[styles.tripTypeText, tripType === 'ida' && styles.selectedTripText]}>Ida</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tripTypeButton, tripType === 'volta' && styles.selectedTripButton]}
          onPress={() => toggleTripType('volta')}
        >
          <Text style={[styles.tripTypeText, tripType === 'volta' && styles.selectedTripText]}>Volta</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.headerTitle}>Rota Sugerida</Text>

      <ScrollView style={styles.passengersContainer}>
        {passengerList.map(passenger => renderPassengerItem(passenger))}

        {tripType === 'volta' && (
          <TouchableOpacity 
            style={styles.releasedContainer}
            onPress={togglePassengersReleased}
          >
            <View style={styles.releasedCheckboxContainer}>
              <View style={[styles.checkbox, passengersReleased && styles.checkboxSelected]}>
                {passengersReleased && <MaterialIcons name="check" size={16} color="#fff" />}
              </View>
              <Text style={styles.releasedText}>Passageiros liberados</Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.startButton} onPress={handleStartTrip}>
        <Text style={styles.startButtonText}>Iniciar</Text>
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  tripTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  tripTypeButton: {
    paddingVertical: 10,
    flex: 1,
    alignItems: 'center',
  },
  selectedTripButton: {
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tripTypeText: {
    fontSize: 16,
    color: '#888',
    fontWeight: 'normal',
  },
  selectedTripText: {
    color: '#000',
    fontWeight: 'bold',
  },
  passengersContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  passengerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 56, // Garante altura consistente para todos os cartões
  },
  passengerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passengerDetails: {
    flex: 1,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionContainer: {
    width: 40, // Largura fixa para os ícones/checkboxes
    alignItems: 'center',
    justifyContent: 'center',
  },
  directionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxSelected: {
    backgroundColor: '#4285F4',
  },
  releasedContainer: {
    paddingVertical: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  releasedCheckboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  releasedText: {
    marginLeft: 8,
    fontSize: 14,
  },
  startButton: {
    backgroundColor: '#4285F4',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SuggestedRouteScreen; 