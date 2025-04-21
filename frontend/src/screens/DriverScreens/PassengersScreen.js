import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authHeader } from '../../auth/AuthService';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { API_IGO } from '@env';

//components import
import BottomButton from '../../components/passengers/BottomButton';

const PassengersScreen = ({ navigation, route }) => {
  const [search, setSearch] = useState('');
  const [passageiros, setPassageiros] = useState([]);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchPassengersList = async () => {
        const headers = await authHeader();
  
        try {
          const response = await fetch(`${API_IGO}/users/get-all-users`, {
            method: 'GET',
            headers
          });

          const data = await response.json();

          const transformedPassengers = data.data.map(p => ({
            id: p.user_id, // <- UUID vindo do backend
            name: `${p.name} ${p.last_name}`,
            avatar: null,
            phone: p.phone
          })).sort((a, b) => a.name.localeCompare(b.name));
          
          setPassageiros(transformedPassengers);
        } catch (error) {
          console.error('Erro ao buscar passageiros:', error);
        }
      };
  
      fetchPassengersList();
  
      // return opcional, usado se quiser limpar algo ao sair da tela
      return () => {
        // Ex: cancelar requisições ou limpar estado
      };
    }, []) // sem dependências: só roda quando a tela ganha foco
  );

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      navigation.setOptions({
        tabBarStyle: { display: 'none' } // Escondendo a bottom bar
      });
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      navigation.setOptions({
        tabBarStyle: { display: 'flex' } // Mostrando a bottom bar novamente
      });
    });
  
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [navigation]);

  const filteredPassageiros = passageiros.filter(passageiro => 
    passageiro.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleGoBack = () => {
    navigation.goBack();
  };

  const clearSearch = () => {
    setSearch('');
  };

  const renderPassengerItem = (passageiro) => {
    return (
      <View key={passageiro.id} style={styles.passengerCard}>
        <View style={styles.passengerInfo}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <MaterialIcons name="person" size={20} color="#000" />
            </View>
          </View>
          <View style={styles.passengerDetails}>
            <Text style={styles.passengerName}>{passageiro.name}</Text>
          </View>
        </View>
      </View>
    );
  };
  
return (
  <KeyboardAvoidingView style={{ flex: 1 }}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <Text style={styles.headerTitle}>Passageiros</Text>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Procurar passageiro"
              placeholderTextColor="#888"
              value={search}
              onChangeText={setSearch}
            />
            {search ? (
              <TouchableOpacity onPress={clearSearch}>
                <MaterialIcons name="close" size={20} color="#888" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <ScrollView style={styles.passengersContainer}>
          {filteredPassageiros.map(passageiro => renderPassengerItem(passageiro))}
        </ScrollView>

        {/* Botão fora do ScrollView e dentro da estrutura que evita o teclado */}
        {!keyboardVisible && (
          <BottomButton
            text="Adicionar Passageiro"
            onPress={() => navigation.navigate('AddPassenger')}
          />
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
);
}

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
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 24,
    fontSize: 14,
    padding: 0,
    color: '#000',
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
});

export default PassengersScreen;
