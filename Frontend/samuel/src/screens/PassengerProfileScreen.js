import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import LogoutConfirmation from '../components/common/Logout';

const PassengerProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({
    nome: 'John',
    sobrenome: 'Doe',
    cpf: '123.456.789-10',
    dataNascimento: '02/09/2003',
    email: 'johndoe@gmail.com',
    telefone: '(31) 9 1234-5678',
    enderecos: [
      { tipo: 'Casa', logradouro: 'R.', numero: '12', bairro: 'Bairro 1', cidade: 'Ipatinga', cep: '35123-000' },
      { tipo: 'Trabalho', logradouro: 'R.', numero: '72', bairro: 'Bairro 4', cidade: 'Ipatinga', cep: '35123-000' }
    ]
  });

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleAddressesPress = () => {
    navigation.navigate('EditAddresses');
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    navigation.navigate('Login');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="chevron-left" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={styles.helpButton}>
          <Text style={styles.helpText}>Ajuda</Text>
          <MaterialIcons name="help-outline" size={20} color="#007BFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <MaterialIcons name="person" size={60} color="black" />
            </View>
          </View>
          <Text style={styles.userName}>{`${userData.nome} ${userData.sobrenome}`}</Text>
          <Text style={styles.userRole}>Passageiro</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Idade:</Text>
          <Text style={styles.infoValue}>20</Text>
          
          <Text style={styles.infoLabel}>Telefone:</Text>
          <Text style={styles.infoValue}>{userData.telefone}</Text>
          
          <Text style={styles.infoLabel}>Endereços:</Text>
          {userData.enderecos.map((endereco, index) => (
            <Text key={index} style={styles.addressText}>
              ({endereco.tipo}) {endereco.logradouro} {endereco.numero}, {endereco.bairro}, {endereco.cidade}
            </Text>
          ))}
          
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{userData.email}</Text>
        </View>

        <TouchableOpacity 
          style={styles.editButton} 
          onPress={handleEditProfile}
        >
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>

      <LogoutConfirmation
        visible={showLogoutModal}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
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
    paddingHorizontal: 15,
    height: 50,
  },
  backButton: {
    padding: 5,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpText: {
    color: '#007BFF',
    marginRight: 5,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  userRole: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  addressText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  editButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 50,
    marginBottom: 15,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 50,
    marginBottom: 30,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
});

export default PassengerProfileScreen;