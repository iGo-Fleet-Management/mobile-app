import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authHeader } from '../../auth/AuthService';
import { API_IGO } from '@env';

//component imports
import BottomButton from '../../components/passengers/BottomButton';

const DriverHomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [selectedTrip, setSelectedTrip] = useState('ida');
  const [driverName, setDriverName] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [totalPassengersIda, setTotalPassengersIda] = useState(0);
  const [totalPassengersVolta, setTotalPassengersVolta] = useState(0);
  const [oneWayOnly, setOneWayOnly] = useState(0);
  const [returnOnly, setReturnOnly] = useState(0);
  const [releasedPassengers, setReleasedPassengers] = useState(0);

  // Dados de exemplo
  const companyName = "Minions Vans";
  const date = new Date();
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  
  useEffect(() => {
    const fetchDriverName = async () => {
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
          const { name, last_name } = responseData.data;
          setDriverName(`${name} ${last_name}`.trim());
        } else {
          throw new Error('Invalid data format from API');
        }
      } catch (error) {
        console.error('Error fetching driver profile:', error);
        // Fallback to empty name if there's an error
        setDriverName('Motorista');
      } finally {
        setLoading(false);
      }
    };

    fetchDriverName();
  }, []);
  
  const fetchTripResume = async () => {
    try {
      const headers = await authHeader();
      const date = '2025-04-28'
      //const date = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

      const response = await fetch(`${API_IGO}trips/get-trip-resume?date=${date}`, {
        method: 'GET',
        headers
      });
      
      const data = await response.json();

      if (data.status === "success") {
        if (data.resume.length > 0) {
          const resume = data.resume[0];
          const idaEVolta = parseInt(resume.ida_e_volta) || 0;
          const somenteIda = parseInt(resume.somente_ida) || 0;
          const somenteVolta = parseInt(resume.somente_volta) || 0;
          
          const totalIda = idaEVolta + somenteIda;
          const totalVolta = idaEVolta + somenteVolta;
          
          setTotalPassengersIda(totalIda);
          setTotalPassengersVolta(totalVolta);
          setOneWayOnly(somenteIda);
          setReturnOnly(somenteVolta);
        } else {
          // Quando não há resumo, zere os valores
          setTotalPassengersIda(0);
          setTotalPassengersVolta(0);
          setOneWayOnly(0);
          setReturnOnly(0);
        }
        
        const releasedResponse = await fetch(`${API_IGO}trips/get-trip-released-users?date=${date}`, {
          method: 'GET',
          headers
        });

        const releasedData = await releasedResponse.json()

        if (releasedData.status === "success") {
          setReleasedPassengers(releasedData.data.length);
        } else {
          setReleasedPassengers(0);
        }

      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching trip resume:', error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTripResume();
  } , []);

  const handleTripSelect = (tripType) => {
    setSelectedTrip(tripType);
  };
  
  const handleStartTrip = () => {
    // Navegação para a tela de rota sugerida
    navigation.navigate('SuggestedRoute');
  };
  
  const handleProfilePress = () => {
    // Navegação para o perfil do motorista
    navigation.navigate('DriverProfile');
  };
  
  // Renderiza o conteúdo do resumo do dia com base no tipo de viagem selecionado
  const renderSummaryContent = () => {
    if (selectedTrip === 'ida') {
      return (
        <>
          <View style={styles.summaryItemContainer}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{totalPassengersIda}</Text>
              <Text style={styles.summaryLabel}>Passageiros</Text>
              <MaterialIcons name="people" size={16} color="#777" />
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{oneWayOnly}</Text>
              <Text style={styles.summaryLabel}>Somente ida</Text>
              <Ionicons name="arrow-forward" size={16} color="#777" />
            </View>
          </View>
        </>
      );
    } else {
      return (
        <>
          <View style={styles.summaryItemContainer}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{totalPassengersVolta}</Text>
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
        </>
      );
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchTripResume();
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4285F4" />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>iGO</Text>
          <View style={styles.profileContainer}>
            <TouchableOpacity onPress={handleProfilePress}>
              <Text style={styles.driverName}>{driverName}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileIcon} onPress={handleProfilePress}>
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
          
          {renderSummaryContent()}
        </View>
        </ScrollView>
        
        {/* Start Trip Button */}
        <BottomButton
          text = "Trajeto"
          onPress={handleStartTrip}
        />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
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
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
  startTripText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DriverHomeScreen;