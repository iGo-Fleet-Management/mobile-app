import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import LogoutConfirmation from '../../components/common/Logout';
import { API_IGO } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ProfileSkeleton from '../../components/common/Skeleton';

const DriverProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      // Get the authentication token from AsyncStorage
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      const response = await fetch(`${API_IGO}/profile`, {
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
      
      // Extract the user data from the nested structure
      if (responseData.success && responseData.data) {
        setUserData(responseData.data);
      } else {
        throw new Error('Invalid data format from API');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { userData });
  };

  const handleAddressesPress = () => {
    navigation.navigate('EditAddresses', { addresses: userData?.addresses || [] });
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setShowLogoutModal(false);
      navigation.navigate('Login');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Render the header (shared between all states)
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <MaterialIcons name="chevron-left" size={30} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}} style={styles.helpButton}>
        <Text style={styles.helpText}>Ajuda</Text>
        <MaterialIcons name="help-outline" size={20} color="#007BFF" />
      </TouchableOpacity>
    </View>
  );

  // Render profile content or error message
  const renderContent = () => {
    if (loading) {
      return <ProfileSkeleton />;
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={60} color="#e53935" />
          <Text style={styles.errorText}>Erro ao carregar perfil: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchUserProfile}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return userData ? (
      <>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <MaterialIcons name="person" size={60} color="black" />
            </View>
          </View>
          <Text style={styles.userName}>{`${userData.name} ${userData.last_name}`}</Text>
          <Text style={styles.userRole}>Motorista</Text>
        </View>

        <View style={styles.infoSection}>
          {userData.phone && (
            <>
              <Text style={styles.infoLabel}>Telefone:</Text>
              <Text style={styles.infoValue}>{userData.phone}</Text>
            </>
          )}
          
          {userData.addresses && userData.addresses.length > 0 && (
            <>
              <Text style={styles.infoLabel}>Endereços:</Text>
              {userData.addresses.map((endereco, index) => (
                <Text key={index} style={styles.addressText}>
                  ({endereco.address_type}) {endereco.street} {endereco.number}, {endereco.neighbourhood}, {endereco.city}
                </Text>
              ))}
            </>
          )}
          
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{userData.email}</Text>
        </View>
      </>
    ) : null;
  };

  // Always show action buttons (Edit and Logout) regardless of content state
  const renderActionButtons = () => (
    <>
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
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderHeader()}
      
      <ScrollView style={styles.content}>
        {renderContent()}
        {renderActionButtons()}
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
  content: {
    flex: 1,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 50,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e53935',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  }
});

export default DriverProfileScreen;