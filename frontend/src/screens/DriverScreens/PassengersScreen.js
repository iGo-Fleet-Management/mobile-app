import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  KeyboardAvoidingView, 
  TouchableWithoutFeedback, 
  Keyboard, 
  Modal,
  Alert,
  Platform,
  StatusBar
} from 'react-native';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPassenger, setSelectedPassenger] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchPassengersList = async () => {
        const headers = await authHeader();
  
        try {
          const response = await fetch(`${API_IGO}users/get-all-users`, {
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
  
      return () => {
        // Cleanup if needed
      };
    }, [])
  );

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      navigation.setOptions({
        tabBarStyle: { display: 'none' }
      });
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      navigation.setOptions({
        tabBarStyle: { display: 'flex' }
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

  const openPassengerModal = (passageiro) => {
    console.log("Abrindo modal para:", passageiro.name);
    setSelectedPassenger(passageiro);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPassenger(null);
  };

  const handleRemovePassenger = (passageiroId) => {
    Alert.alert(
      "Remover Passageiro",
      `Deseja remover este passageiro?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              // Chamada para a API para excluir o usuário
              const response = await fetch(`https://backend-igo.onrender.com/api/users/delete-user/${passageiroId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                }
              });
              
              const data = await response.json();
              
              if (data.success) {
                // Se a exclusão for bem-sucedida, atualiza a lista local
                const novaLista = passageiros.filter(p => p.id !== passageiroId);
                setPassageiros(novaLista);
                closeModal();
                // Você pode adicionar uma notificação de sucesso aqui
                Alert.alert("Sucesso", data.message);
              } else {
                // Se houver erro na resposta da API
                Alert.alert("Erro", data.message || "Erro ao excluir usuário");
              }
            } catch (error) {
              // Tratamento de erro na chamada da API
              console.error("Erro ao excluir usuário:", error);
              Alert.alert("Erro", "Ocorreu um erro ao tentar excluir o usuário. Tente novamente.");
            }
          }
        }
      ]
    );
  };

  const renderPassengerItem = (passageiro) => {
    return (
      <View key={passageiro.id} style={styles.passengerCard}>
        <TouchableOpacity onPress={() => openPassengerModal(passageiro)} style={{flex: 1}}>
          <View style={styles.passengerInfo}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                <MaterialIcons name="person" size={20} color="#000" />
              </View>
            </View>
            <View style={styles.passengerDetails}>
              <Text style={styles.passengerName}>{passageiro.name}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#888" />
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <KeyboardAvoidingView 
      style={styles.keyboardAvoidingView} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container} edges={['top']}>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          
          {/* Fixed Header Structure */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Passageiros</Text>
            <View style={styles.headerRightPlaceholder} />
          </View>
  
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

          {/* Main content container with flex layout */}
          <View style={styles.contentContainer}>
            <ScrollView 
              style={styles.passengersContainer}
              contentContainerStyle={styles.passengersContentContainer}
            >
              {filteredPassageiros.map(passageiro => renderPassengerItem(passageiro))}
              
              {/* This empty view provides space at the bottom */}
              <View style={styles.scrollPadding} />
            </ScrollView>
            
            {/* Button container fixed at bottom */}
            {!keyboardVisible && (
              <View style={styles.bottomButtonContainer}>
                <BottomButton
                  text="Adicionar Passageiro"
                  onPress={() => navigation.navigate('AddPassenger')}
                />
              </View>
            )}
          </View>
          
          {/* Modal for passenger details */}
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={closeModal}
          >
            <TouchableWithoutFeedback onPress={closeModal}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
                  <View style={styles.modalContent}>
                    {selectedPassenger ? (
                      <>
                        <Text style={styles.modalTitle}>Detalhes do Passageiro</Text>
                        <Text style={styles.modalName}>{selectedPassenger.name}</Text>
                        <Text style={styles.modalInfo}>ID: {selectedPassenger.id}</Text>
                        {selectedPassenger.phone && 
                          <Text style={styles.modalInfo}>Telefone: {selectedPassenger.phone}</Text>
                        }
                        
                        <TouchableOpacity 
                          onPress={() => handleRemovePassenger(selectedPassenger.id)} 
                          style={styles.removeButton}>
                          <Text style={styles.removeText}>Remover Passageiro</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <Text style={styles.modalTitle}>Carregando detalhes...</Text>
                    )}
                    
                    <TouchableOpacity
                      onPress={closeModal}
                      style={styles.closeButton}
                    >
                      <Text style={styles.closeButtonText}>Fechar</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: -1,
  },
  headerRightPlaceholder: {
    width: 24,
  },
  searchContainer: {
    marginVertical: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 8,
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  passengersScroll: {
    flex: 1,
  },
  passengersContent: {
    paddingBottom: 80,
  },
  passengersContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  passengersContentContainer: {
    paddingTop: 5,
  },
  // Add bottom padding to ensure content is visible above the button
  scrollPadding: {
    height: 80, // Match the height of your bottom button area
  },
  // Container for the bottom button with absolute positioning
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 55,
  },
  passengerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bottomSpacer: {
    height: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  passengerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    marginLeft: 8,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'flex-start',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  modalName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  modalInfo: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  removeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  removeText: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'center',
    padding: 10,
  },
  closeButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  avatarContainer: {
    marginRight: 12,
  },
  passengerPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default PassengersScreen;