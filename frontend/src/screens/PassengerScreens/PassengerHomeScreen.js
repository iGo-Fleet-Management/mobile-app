import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Easing, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserIcon from '../../components/common/UserIcon';
import { API_IGO } from '@env';

import Header from '../../components/common/Header';
import TravelModeSelector from '../../components/home/TravelModeSelector';
import StatusSwitch from '../../components/home/StatusSwitch';
import AlertBox from '../../components/home/AlertBox';
import MapContainer from '../../components/home/MapContainer';
import BottomUserBar from '../../components/home/BottomUserBar';
import Button from '../../components/common/Button';

import { colors, spacing, typography, shadows, borders } from '../../styles/globalStyles';

export default function HomeScreen({ navigation }) {
  const [travelMode, setTravelMode] = useState(null);
  const [isLiberado, setIsLiberado] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingTravelMode, setPendingTravelMode] = useState(null);
  const [isCleanupConfirmation, setIsCleanupConfirmation] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  
  const vanPosition = useRef(new Animated.Value(-50)).current;
  
  // Start van animation on component mount
  useEffect(() => {
    startVanAnimation();
  }, []);
  
  // Function to animate the van
  const startVanAnimation = () => {
    Animated.loop(
      Animated.timing(vanPosition, {
        toValue: 400, // End position (adjust based on screen width)
        duration: 5000, // Animation duration in ms
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };
  
  const handleUserIconPress = () => {
    navigation.navigate('Profile');
  };

  const handleTravelModeChange = (mode) => {
    if (mode === travelMode) return;
    
    setPendingTravelMode(mode);
    setIsCleanupConfirmation(false);
    setModalVisible(true);
  };

  const handleCleanupPress = () => {
    setIsCleanupConfirmation(true);
    setModalVisible(true);
  };

  const formatDateForDisplay = (date) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('pt-BR', options);
  };
  
  const formatDateForAPI = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  const handleStatusChange = async (value) => {
    setIsLiberado(value);
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_IGO}update-is-released`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`
        },
        body: JSON.stringify({
          date: formatDateForAPI(currentDate),
          is_released: value
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao atualizar status');
      }
      
      console.log('Status updated:', data);
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o status. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const addRoundTrip = async () => {
    setIsLoading(true);
    
    try {
      const userData = JSON.parse(await AsyncStorage.getItem('userData'));
      const addressId = userData?.address_id || "bd448190-c549-4997-ab14-b3085caaa78f";
      
      const response = await fetch(`${API_IGO}add-round-trip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`
        },
        body: JSON.stringify({
          date: formatDateForAPI(currentDate),
          goStop: {
            address_id: addressId,
            stop_date: formatDateForAPI(currentDate)
          },
          backStop: {
            address_id: addressId,
            stop_date: formatDateForAPI(currentDate)
          }
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao adicionar viagem de ida e volta');
      }
      
      console.log('Round trip added:', data);
      return true;
    } catch (error) {
      console.error('Error adding round trip:', error);
      Alert.alert('Erro', 'Não foi possível adicionar viagem de ida e volta. Por favor, tente novamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addOneWayTrip = async () => {
    setIsLoading(true);
    
    try {
      const userData = JSON.parse(await AsyncStorage.getItem('userData'));
      const addressId = userData?.address_id || "bf7151bf-0a87-426e-a274-e25e60f07375";
      
      const response = await fetch(`${API_IGO}add-onlygotrip-stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`
        },
        body: JSON.stringify({
          date: formatDateForAPI(currentDate),
          goStop: {
            address_id: addressId,
            stop_date: formatDateForAPI(currentDate)
          }
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao adicionar viagem de ida');
      }
      
      console.log('One-way trip added:', data);
      return true;
    } catch (error) {
      console.error('Error adding one-way trip:', error);
      Alert.alert('Erro', 'Não foi possível adicionar viagem de ida. Por favor, tente novamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const addReturnOnlyTrip = async () => {
    setIsLoading(true);
    
    try {
      const userData = JSON.parse(await AsyncStorage.getItem('userData'));
      const addressId = userData?.address_id || "bf7151bf-0a87-426e-a274-e25e60f07375";
      
      const response = await fetch(`${API_IGO}add-onlybacktrip-stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`
        },
        body: JSON.stringify({
          date: formatDateForAPI(currentDate),
          backStop: {
            address_id: addressId,
            stop_date: formatDateForAPI(currentDate)
          }
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao adicionar viagem de volta');
      }
      
      console.log('Return-only trip added:', data);
      return true;
    } catch (error) {
      console.error('Error adding return-only trip:', error);
      Alert.alert('Erro', 'Não foi possível adicionar viagem de volta. Por favor, tente novamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeStops = async () => {
    setIsLoading(true);
    
    try {
      const userData = JSON.parse(await AsyncStorage.getItem('userData'));
      const addressId = userData?.address_id || "e8e7b776-3f2a-41db-9791-57cabedfc190";
      
      const response = await fetch(`${API_IGO}remove-stops`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`
        },
        body: JSON.stringify({
          date: formatDateForAPI(currentDate),
          goStop: {
            address_id: addressId,
            stop_date: formatDateForAPI(currentDate)
          },
          backStop: {
            address_id: addressId,
            stop_date: formatDateForAPI(currentDate)
          }
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao remover viagem');
      }
      
      console.log('Stops removed:', data);
      return true;
    } catch (error) {
      console.error('Error removing stops:', error);
      Alert.alert('Erro', 'Não foi possível cancelar sua viagem. Por favor, tente novamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const confirmChange = async () => {
    let success = false;
    
    if (isCleanupConfirmation) {
      success = await removeStops();
      if (success) {
        setTravelMode(null);
      }
    } else {
      switch(pendingTravelMode) {
        case 'roundTrip':
          success = await addRoundTrip();
          break;
        case 'oneWay':
          success = await addOneWayTrip();
          break;
        case 'returnOnly':
          success = await addReturnOnlyTrip();
          break;
        default:
          break;
      }
      
      if (success) {
        setTravelMode(pendingTravelMode);
      }
    }
    
    setModalVisible(false);
  };

  const cancelChange = () => {
    setModalVisible(false);
  };

  const getPendingModeLabel = () => {
    switch(pendingTravelMode) {
      case 'roundTrip':
        return 'Ida e volta';
      case 'oneWay':
        return 'Apenas ida';
      case 'returnOnly':
        return 'Apenas volta';
      default:
        return '';
    }
  };
  
  const formatDayOfWeek = (date) => {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    return days[date.getDay()];
  };
  
  const formatMonthDay = (date) => {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          {/* Animated Van Icon */}
          <Animated.View
            style={[
              styles.vanIcon,
              {
                transform: [{ translateX: vanPosition }]
              }
            ]}
          >
            <FontAwesome5 name="shuttle-van" size={24} color="#333" />
          </Animated.View>
          
          <Header title="iGO" />
          <View style={styles.userIconWrapper}>
            <UserIcon onPress={handleUserIconPress} userName="John" />
          </View>
        </View>

        <View style={styles.dateCard}>
          <Text style={styles.dayOfWeek}>{formatDayOfWeek(currentDate)}</Text>
          <Text style={styles.date}>{formatMonthDay(currentDate)}</Text>
          
          <TravelModeSelector 
            selectedMode={travelMode}
            onSelectMode={handleTravelModeChange}
          />
          
          <TouchableOpacity 
            style={styles.cleanupButton}
            onPress={handleCleanupPress}
            disabled={isLoading}
          >
            <MaterialIcons name="clear" size={18} color="#fff" />
            <Text style={styles.cleanupButtonText}>Não vou à aula</Text>
          </TouchableOpacity>
        </View>

        <StatusSwitch 
          value={isLiberado}
          onValueChange={handleStatusChange}
          onHelpPress={() => navigation.navigate('Ajuda')}
          disabled={isLoading}
        />

        <AlertBox 
          message="Seu motorista já iniciou o trajeto. Fique atento!"
          onEditPress={() => {/* Handle edit */}}
        />

        <MapContainer />

        <BottomUserBar userName="John Doe" />

        {/* Confirmation Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {isCleanupConfirmation 
                  ? "Confirmar cancelamento" 
                  : "Confirmar alteração"}
              </Text>
              <Text style={styles.modalMessage}>
                {isCleanupConfirmation
                  ? "Você tem certeza que deseja cancelar sua viagem? Esta ação notificará o motorista que você não irá à aula hoje."
                  : `Você tem certeza que deseja alterar seu tipo de viagem para "${getPendingModeLabel()}"?`
                }
              </Text>
              
              <View style={styles.modalButtons}>
                <Button 
                  title="Cancelar"
                  variant="outline"
                  onPress={cancelChange}
                  style={styles.modalButton}
                  disabled={isLoading}
                />
                
                <Button 
                  title={isLoading ? "Processando..." : "Confirmar"}
                  variant="primary"
                  onPress={confirmChange}
                  style={styles.modalButton}
                  disabled={isLoading}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    position: 'relative',
    height: 60,
  },
  vanIcon: {
    position: 'absolute',
    top: 18,
    zIndex: 10,
  },
  userIconWrapper: {
    position: 'absolute',
    right: 15,
    top: 0,
    height: 60,
    justifyContent: 'center',
  },
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
  cleanupButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginTop: 10,
  },
  cleanupButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.modalBackground,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: borders.radius.lg,
    padding: spacing.lg,
    width: '90%',
    maxWidth: 400,
    ...shadows.lg,
  },
  modalTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  modalMessage: {
    ...typography.body1,
    marginBottom: spacing.lg,
    textAlign: 'center',
    color: colors.gray[700],
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
});