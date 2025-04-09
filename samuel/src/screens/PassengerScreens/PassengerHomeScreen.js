import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import UserIcon from '../../components/common/UserIcon';

// Components
import Header from '../../components/common/Header';
import TravelModeSelector from '../../components/home/TravelModeSelector';
import StatusSwitch from '../../components/home/StatusSwitch';
import AlertBox from '../../components/home/AlertBox';
import MapContainer from '../../components/home/MapContainer';
import BottomUserBar from '../../components/home/BottomUserBar';

export default function HomeScreen({ navigation }) {
  const [travelMode, setTravelMode] = useState(null);
  const [isLiberado, setIsLiberado] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingTravelMode, setPendingTravelMode] = useState(null);
  const [isCleanupConfirmation, setIsCleanupConfirmation] = useState(false);

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

  const confirmChange = () => {
    if (isCleanupConfirmation) {
      // Handle cleanup operation - reset travel mode
      setTravelMode(null);
      // Here you would also send this update to your backend
    } else {
      // Update to the pending travel mode
      setTravelMode(pendingTravelMode);
    }
    setModalVisible(false);
  };

  const cancelChange = () => {
    setModalVisible(false);
  };

  // Get the label for the pending travel mode
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Header title="iGO" />
          <View style={styles.userIconWrapper}>
            <UserIcon onPress={handleUserIconPress} userName="John" />
          </View>
        </View>

        <View style={styles.dateCard}>
          <Text style={styles.dayOfWeek}>Segunda-Feira</Text>
          <Text style={styles.date}>27 de Novembro de 2023</Text>
          
          <TravelModeSelector 
            selectedMode={travelMode}
            onSelectMode={handleTravelModeChange}
          />
          
          <TouchableOpacity 
            style={styles.cleanupButton}
            onPress={handleCleanupPress}
          >
            <MaterialIcons name="clear" size={18} color="#fff" />
            <Text style={styles.cleanupButtonText}>Não vou à aula</Text>
          </TouchableOpacity>
        </View>

        <StatusSwitch 
          value={isLiberado}
          onValueChange={setIsLiberado}
          onHelpPress={() => navigation.navigate('Ajuda')}
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
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]} 
                  onPress={cancelChange}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.confirmButton]} 
                  onPress={confirmChange}
                >
                  <Text style={styles.confirmButtonText}>Confirmar</Text>
                </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    margin: 5,
  },
  cancelButton: {
    backgroundColor: '#f1f1f1',
  },
  confirmButton: {
    backgroundColor: '#3f51b5',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});