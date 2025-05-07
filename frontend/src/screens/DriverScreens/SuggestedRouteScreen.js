import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  StatusBar,
  Modal,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { authHeader } from '../../auth/AuthService';
import { API_IGO } from '@env';

const SuggestedRouteScreen = () => {
  const navigation = useNavigation();
  const [tripType, setTripType] = useState('ida');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passengerList, setPassengerList] = useState([]);
  const [releasedUsers, setReleasedUsers] = useState([]);

  useEffect(() => {
    const fetchTripData = async () => {
      const headers = await authHeader();
      setLoading(true);

      try {
        //const date = "2025-04-28";
        const today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // +1 porque janeiro = 0
        const day = String(today.getDate()).padStart(2, '0');

        const localDate = `${year}-${month}-${day}`;

        const response = await fetch(`${API_IGO}trips/get-trip-resume?date=${localDate}`, {
          method: 'GET',
          headers
        });

        const data = await response.json();

        // ADICIONADO: Buscar usuários liberados
        const releasedResponse = await fetch(`${API_IGO}trips/get-trip-released-users?date=${localDate}`, {
          method: 'GET',
          headers
        });

        const releasedData = await releasedResponse.json();
        
        // ADICIONADO: Armazenar IDs dos usuários liberados
        if (releasedData.status === "success") {
          setReleasedUsers(releasedData.data.map(user => user.user_id));
        }

        if (data.status === "success") {
          // Transformar os dados da API em uma lista de passageiros
          const transformedPassengers = [];
          
          // Passageiros ida e volta
          if (data.resume[0].users_ida_e_volta) {
            data.resume[0].users_ida_e_volta.forEach(userObj => {
              transformedPassengers.push({
                id: userObj.user_id,
                name: userObj.full_name,
                tripType: 'round'
              });
            });
          }
          
          // Passageiros somente ida
          if (data.resume[0].users_somente_ida && data.resume[0].users_somente_ida !== null) {
            data.resume[0].users_somente_ida.forEach(userObj => {  // Use "userObj" em vez de "user"
              transformedPassengers.push({
                id: userObj.user_id,
                name: userObj.full_name,
                tripType: 'ida'
              });
            });
          }
          
          // Passageiros somente volta
          if (data.resume[0].users_somente_volta && data.resume[0].users_somente_volta !== null) {
            data.resume[0].users_somente_volta.forEach(userObj => {  // Use "userObj" em vez de "user"
              transformedPassengers.push({
                id: userObj.user_id,
                name: userObj.full_name,
                tripType: 'volta'
              });
            });
          }
          
          setPassengerList(transformedPassengers);
        }

      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Falha ao carregar dados da viagem');
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [])

  const handleStartTrip = () => {
    navigation.navigate('ActiveTrip', { tripType });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const toggleTripType = (type) => {
    setTripType(type);
  };

  const isPassengerReleased = (passenger) => {
    return releasedUsers.includes(passenger.id);
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
    const isReleased = isPassengerReleased(passenger);
    
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
        
        <View style={styles.actionContainer}>

          <View style={styles.actionsWrapper}>
            {tripType === 'volta' && isReleased && (
              <View style={styles.releasedIndicator}>
                <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
              </View>
            )}
          </View>
          
          <View style={styles.directionIconContainer}>
            {getDirectionIcon(passenger)}
          </View>

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
      
      <Text style={styles.headerTitle}>Passageiros do dia</Text>

      <ScrollView style={styles.passengersContainer}>
      {passengerList
        .filter(passenger => {
          // Exibir apenas passageiros com o tripType correspondente
          return passenger.tripType === tripType || passenger.tripType === 'round';
        })
        .map(passenger => renderPassengerItem(passenger))}

        {tripType === 'volta' && (
          <View style={styles.releasedInfoContainer}>
            <View style={styles.releasedStatusLegend}>
              <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
              <Text style={styles.releasedInfoText}>Passageiros liberados</Text>
            </View>
          </View>
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
    flexDirection: 'row',
    width: 60, // Mais largo para acomodar os dois ícones lado a lado
    justifyContent: 'flex-end', // Centraliza quando há apenas um ícone
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  actionsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  directionIconContainer: {
    width: 24, // Largura fixa
    alignItems: 'center',
  },
  releasedIndicator: {
    marginRight: 10,
  },
  releasedInfoContainer: {
    paddingVertical: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  releasedStatusLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
  },
  releasedInfoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
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