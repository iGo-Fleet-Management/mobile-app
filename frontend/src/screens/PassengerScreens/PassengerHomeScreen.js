import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Easing, Alert, Dimensions, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { checkAuthAndRedirect, authHeader } from '../../auth/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserIcon from '../../components/common/UserIcon';
import MapContainer from '../../components/home/PassengerMapContainer';
import { API_IGO } from '@env';

import Header from '../../components/common/Header';
import TravelModeSelector from '../../components/home/TravelModeSelector';
import StatusSwitch from '../../components/home/StatusSwitch';
import PassengerLocation from '../../utils/PassengerLocation';
import Button from '../../components/common/Button';

import { colors, spacing, typography, shadows, borders } from '../../styles/globalStyles';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [travelMode, setTravelMode] = useState(null);
  const [isLiberado, setIsLiberado] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingTravelMode, setPendingTravelMode] = useState(null);
  const [isCleanupConfirmation, setIsCleanupConfirmation] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userProfileData, setUserProfileData] = useState(null);
  const [userAddressData, setUserAddressData] = useState([null]);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [selectedGoAddress, setSelectedGoAddress] = useState(null);
  const [confirmedGoAddress, setConfirmedGoAddress] = useState(null);
  const [userId, setUserId] = useState(null);

  // Animation value for the van
  const vanPosition = useRef(new Animated.Value(-50)).current;

  const loadUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        navigation.navigate('Login');
        return;
      }

      const response = await fetch(`${API_IGO}profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const responseData = await response.json();

      if (responseData.success && responseData.data) {
        const { user_id, name, last_name, addresses } = responseData.data;
        const profileData = {
          userId: user_id,
          name: `${name} ${last_name}`.trim()
        };

        const addressData = (addresses || []).map(address => ({
          address_id: address.address_id,
          address_type: address.address_type,
        }));

        
        setUserProfileData(profileData);
        setUserId(user_id);
        setUserAddressData(addressData);

        // After loading user data, check for existing trips
        await checkExistingTrips(user_id);

      } else {
        throw new Error('Invalid data format from API');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Fallback to empty profile if there's an error
      setUserProfileData({ name: 'Passageiro' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
    startVanAnimation();
  }, []);

  const checkExistingTrips = async (userId) => {
    try {
      const formattedDate = formatDateForAPI(currentDate);
      const response = await fetch(`${API_IGO}trips/get-trip-resume?date=${formattedDate}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch trip data');
      }

      const data = await response.json();

      if (data.status === 'success' && data.resume && data.resume.length > 0) {
        const tripData = data.resume[0];

        // Check if user is in any of the trip lists
        if (tripData.users_ida_e_volta && tripData.users_ida_e_volta.some(user => user.user_id === userId)) {
          setTravelMode('roundTrip');
        } else if (tripData.users_somente_ida && tripData.users_somente_ida.some(user => user.user_id === userId)) {
          setTravelMode('oneWay');
        } else if (tripData.users_somente_volta && tripData.users_somente_volta.some(user => user.user_id === userId)) {
          setTravelMode('returnOnly');
        }
      }
    } catch (error) {
      console.error('Error checking existing trips:', error);
    }
  };

  // Function to animate the van (loop animation)
  const startVanAnimation = () => {
    Animated.timing(vanPosition, {
      toValue: screenWidth + 50,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const toggleMapExpanded = () => {
    setTimeout(() => {
      setIsMapExpanded((prev) => !prev);
    }, 100);
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
    setPendingTravelMode(null);
    setIsCleanupConfirmation(true);
    setModalVisible(true);
  };

  const formatDateForAPI = (date) => {
    const offsetInMs = 3 * 60 * 60 * 1000;
    const localDate = new Date(date.getTime() - offsetInMs);

    const year = localDate.getUTCFullYear();
    const month = String(localDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(localDate.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const handleStatusChange = async (value) => {
    const originalValue = isLiberado;
    setIsLiberado(value);
    setIsLoading(true);

    try {
      const formattedDate = formatDateForAPI(currentDate);
      const response = await fetch(`${API_IGO}stops/update-is-released?date=${formattedDate}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`
        },
        body: JSON.stringify({
          is_released: value
        })
      });

      const text = await response.text();
      let data;

      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.error('Failed to parse JSON:', text);
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao atualizar status');
      }

    } catch (error) {
      console.error('Error updating status:', error);
      setIsLiberado(originalValue);
      Alert.alert('Erro', error.message || 'Não foi possível atualizar o status. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const addRoundTrip = async () => {
    setIsLoading(true);
    try {
      if (!userAddressData) {
        throw new Error('Endereço não encontrado. Atualize seu perfil primeiro.');
      }

      const casaAddress = userAddressData.find(addr => addr.address_type === "Casa");

      console.log('selectedGoAddress', selectedGoAddress);
      console.log('confirmedGoAddress', confirmedGoAddress);
      console.log('casaAddress', casaAddress);

      const formattedDate = formatDateForAPI(currentDate);
      const payload = {
        date: formattedDate,
        goStop: {
          address_id: selectedGoAddress,
          stop_date: formattedDate
        },
        backStop: {
          address_id: casaAddress.address_id,
          stop_date: formattedDate
        }
      };

      const response = await fetch(`${API_IGO}stops/add-roundtrip-stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`
        },
        body: JSON.stringify(payload)
      });

      const text = await response.text();
      let data;

      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.error('Failed to parse JSON:', text);
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao adicionar viagem de ida e volta');
      }

      return true;
    } catch (error) {
      console.error('Error adding round trip:', error);
      Alert.alert('Erro', error.message || 'Não foi possível adicionar viagem de ida e volta. Por favor, tente novamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addOneWayTrip = async () => {
    setIsLoading(true);

    try {
      if (!userAddressData) {
        throw new Error('Endereço não encontrado. Atualize seu perfil primeiro.');
      }

      const formattedDate = formatDateForAPI(currentDate);
      const payload = {
        date: formattedDate,
        goStop: {
          address_id: selectedGoAddress,
          stop_date: formattedDate
        }
      };

      const response = await fetch(`${API_IGO}stops/add-onlygotrip-stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`
        },
        body: JSON.stringify(payload)
      });

      const text = await response.text();
      let data;

      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.error('Failed to parse JSON:', text);
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao adicionar viagem de ida');
      }

      return true;
    } catch (error) {
      console.error('Error adding one-way trip:', error);
      Alert.alert('Erro', error.message || 'Não foi possível adicionar viagem de ida. Por favor, tente novamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addReturnOnlyTrip = async () => {
    setIsLoading(true);

    try {
      if (!userAddressData) {
        throw new Error('Endereço não encontrado. Atualize seu perfil primeiro.');
      }

      const casaAddress = userAddressData.find(addr => addr.address_type === "Casa");

      const formattedDate = formatDateForAPI(currentDate);
      const payload = {
        date: formattedDate,
        backStop: {
          address_id: casaAddress.address_id,
          stop_date: formattedDate
        }
      };

      const response = await fetch(`${API_IGO}stops/add-onlybacktrip-stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`
        },
        body: JSON.stringify(payload)
      });

      const text = await response.text();
      let data;

      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.error('Failed to parse JSON:', text);
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao adicionar viagem de volta');
      }

      return true;
    } catch (error) {
      console.error('Error adding return-only trip:', error);
      Alert.alert('Erro', error.message || 'Não foi possível adicionar viagem de volta. Por favor, tente novamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeStops = async () => {
    setIsLoading(true);

    try {
      if (!userAddressData) {
        throw new Error('Endereço não encontrado. Atualize seu perfil primeiro.');
      }

      const casaAddress = userAddressData.find(addr => addr.address_type === "Casa");

      const formattedDate = formatDateForAPI(currentDate);
      const payload = {
        date: formattedDate,
        goStop: {
          address_id: confirmedGoAddress,
          stop_date: formattedDate
        },
        backStop: {
          address_id: casaAddress.address_id,
          stop_date: formattedDate
        }
      };

      const response = await fetch(`${API_IGO}stops/remove-stops`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`
        },
        body: JSON.stringify(payload)
      });

      const text = await response.text();
      let data;

      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.error('Failed to parse JSON:', text);
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao remover viagem');
      }

      return true;
    } catch (error) {
      console.error('Error removing stops:', error);
      Alert.alert('Erro', error.message || 'Não foi possível cancelar sua viagem. Por favor, tente novamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const confirmChange = async () => {
    let success = false;

    try {
      if (isCleanupConfirmation) {
        success = await removeStops();
        if (success) {
          setTravelMode(null);
        }
      } else {
        switch (pendingTravelMode) {
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
          setConfirmedGoAddress(selectedGoAddress);
        }
      }
    } catch (error) {
      console.error('Error in confirmChange:', error);
    } finally {
      setModalVisible(false);
    }
  };

  const cancelChange = () => {
    setModalVisible(false);
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await loadUserData();
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getPendingModeLabel = () => {
    switch (pendingTravelMode) {
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

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Carregando</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {isMapExpanded ? (
        <View style={styles.expandedMapContainer}>
          <MapContainer />
          <TouchableOpacity
            style={styles.collapseButton}
            onPress={toggleMapExpanded}
          >
            <MaterialIcons name="fullscreen-exit" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Animated.View
              style={[
                styles.vanIcon,
                {
                  transform: [{ translateX: vanPosition }]
                }
              ]}
            >
              <FontAwesome5 name="shuttle-van" size={24} color={colors.primary} />
            </Animated.View>

            <Header title="iGO" />
            <View style={styles.userIconWrapper}>
              <UserIcon
                onPress={handleUserIconPress}
                userName={userProfileData?.name || 'Passageiro'}
              />
            </View>
          </View>
          <ScrollView
            contentContainerStyle={[styles.scrollContainer]}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >


            <View style={styles.dateCard}>
              <Text style={styles.dayOfWeek}>{formatDayOfWeek(currentDate)}</Text>
              <Text style={styles.date}>{formatMonthDay(currentDate)}</Text>

              <TravelModeSelector
                selectedMode={travelMode}
                onSelectMode={handleTravelModeChange}
              />

              <TouchableOpacity
                style={[
                  styles.cleanupButton,
                  (!travelMode || isLoading) && styles.disabledButton
                ]}
                onPress={handleCleanupPress}
                disabled={!travelMode || isLoading}
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

            <View style={styles.mapWrapper}>
              <PassengerLocation />
              <TouchableOpacity
                style={styles.expandButton}
                onPress={toggleMapExpanded}
              >
                <MaterialIcons name="fullscreen" size={24} color="#333" />
              </TouchableOpacity>
            </View>
          </ScrollView>

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

                {(pendingTravelMode === 'roundTrip' || pendingTravelMode === 'oneWay') && (
                  <>
                    <Text style={styles.modalLabel}>Escolha o endereço de ida:</Text>
                    <Picker
                      selectedValue={selectedGoAddress}
                      onValueChange={(itemValue) => setSelectedGoAddress(itemValue)}
                      style={styles.picker}
                    >
                      {userAddressData.map((address, index) => (
                        <Picker.Item
                          key={address.address_id}
                          label={`${address.address_type}`}
                          value={address.address_id}
                        />
                      ))}
                    </Picker>
                  </>
                )}
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
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  headerContainer: {
    position: 'relative',
    height: 60,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
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
  disabledButton: {
    opacity: 0.6,
  },
  cleanupButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: '500',
  },
  mapWrapper: {
    flex: 1,
    position: 'relative',
    marginTop: 0,
    margin: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  expandButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  expandedMapContainer: {
    flex: 1,
    position: 'relative',
  },
  collapseButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333333',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#555555',
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 10
  },
  picker: {
    height: 60,
    width: '100%',
    marginBottom: 20,
  }
});