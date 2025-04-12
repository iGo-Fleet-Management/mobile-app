import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { API_IGO } from '@env';
import { checkAuthAndRedirect, authHeader, getToken } from '../../auth/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InputCpf } from '../../components/common/InputCpf';
import { InputPhone } from '../../components/common/InputPhone';
import { InputDate } from '../../components/common/InputDate';

export default function EditProfileScreen({ navigation, route }) {
  const [formData, setFormData] = useState({
    userData: {
      name: '',
      last_name: '',
      cpf: '',
      birthdate: '',
      email: '',
      phone: '',
    }
  });
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      const token = await getToken();
      
      const isAuth = await checkAuthAndRedirect(navigation);
      if (isAuth) {
        fetchUserProfile();
      }
    };
    
    checkAuthAndFetchProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const headers = await authHeader();
      
      const response = await fetch(`${API_IGO}profile`, {
        method: 'GET',
        headers
      });
      
      const responseData = await response.json();
      
      if (response.ok && responseData.success) {
        const userData = responseData.data;
        
        setFormData({
          userData: {
            name: userData.name || '',
            last_name: userData.last_name || '',
            cpf: userData.cpf || '',
            birthdate: userData.birthdate || '',
            email: userData.email || '',
            phone: userData.phone || '',
          }
        });
      } else {
        console.error('Error fetching profile - Status:', response.status);
        
        if (response.status === 401) {
          // Try to read token again to see if it's still there
          const token = await AsyncStorage.getItem('userToken');
          console.log('Token check after 401:', token ? 'Token exists' : 'No token');
          
          // Token expired or invalid
          checkAuthAndRedirect(navigation);
        } else {
          Alert.alert('Erro', responseData.message || 'Erro ao carregar perfil.');
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Erro', 'Ocorreu um problema ao carregar os dados do perfil.');
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  const handleChange = (field, value) => {
    // Clear the error for this field when the user makes changes
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
    
    // Atualiza o campo dentro do objeto userData
    setFormData(prev => ({
      userData: {
        ...prev.userData,
        [field]: value
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const { userData } = formData; 
    
    if (!userData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!userData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (userData.cpf && userData.cpf.length !== 11) {
      newErrors.cpf = 'CPF inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Erro', 'Por favor, corrija os erros no formulário.');
      return;
    }
    
    setLoading(true);
    try {
      const headers = await authHeader();
      
      // Create a copy of the form data to ensure not undefined values
      const dataToSend = {
        userData: Object.fromEntries(
          Object.entries(formData.userData).filter(([_, v]) => v !== undefined)
        )
      };
      
      const response = await fetch(`${API_IGO}profile/update-profile`, {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          'Sucesso', 
          'Perfil atualizado com sucesso!',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        if (response.status === 401) {
          // Token expired or invalid
          console.log('401 error when updating profile');
          
          // Try to read token again to see if it's still there
          const token = await AsyncStorage.getItem('userToken');
          console.log('Token check after 401:', token ? 'Token exists' : 'No token');
          
          checkAuthAndRedirect(navigation);
        } else {
          Alert.alert('Erro', data.message || 'Erro ao atualizar perfil.');
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Erro', 'Ocorreu um problema ao atualizar os dados do perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressesPress = () => {
    navigation.navigate('EditAddresses');
  };

  if (initialLoad) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Carregando dados do perfil...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="chevron-left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.fieldLabel}>Nome *</Text>
          <View style={[styles.inputContainer, errors.name && styles.inputError]}>
            <TextInput
              style={styles.input}
              value={formData.userData.name}
              onChangeText={(text) => handleChange('name', text)}
              placeholder="Digite seu nome"
            />
            {errors.name && (
              <MaterialIcons name="error-outline" size={20} color="#FF3B30" style={styles.errorIcon} />
            )}
          </View>
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          <Text style={styles.fieldLabel}>Sobrenome</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={formData.userData.last_name}
              onChangeText={(text) => handleChange('last_name', text)}
              placeholder="Digite seu sobrenome"
            />
          </View>

          <InputCpf
            label="CPF"
            value={formData.userData.cpf}
            onChangeText={(text) => handleChange('cpf', text)}
            placeholder="123.456.789-10"
            error={errors.cpf}
          />

          <InputDate
            label="Data de Nascimento"
            value={formData.userData.birthdate}
            onChangeText={(text) => handleChange('birthdate', text)}
            placeholder="DD/MM/AAAA"
            error={errors.birthdate}
          />

          <Text style={styles.fieldLabel}>E-mail *</Text>
          <View style={[styles.inputContainer, errors.email && styles.inputError]}>
            <TextInput
              style={styles.input}
              value={formData.userData.email}
              onChangeText={(text) => handleChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="seuemail@exemplo.com"
            />
            {errors.email && (
              <MaterialIcons name="error-outline" size={20} color="#FF3B30" style={styles.errorIcon} />
            )}
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <InputPhone
            label="Telefone"
            value={formData.userData.phone}
            onChangeText={(text) => handleChange('phone', text)}
            placeholder="(00) 00000-0000"
            error={errors.phone}
          />

          <Text style={styles.noteText}>* Campos obrigatórios</Text>

          <TouchableOpacity 
            style={styles.addressesButton} 
            onPress={handleAddressesPress}
          >
            <Text style={styles.addressesButtonText}>Endereços</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.disabledButton]} 
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Salvando...' : 'Salvar Perfil'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  fieldLabel: {
    fontSize: 15,
    marginBottom: 5,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    height: 48,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 15,
  },
  errorIcon: {
    marginLeft: 10,
  },
  noteText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
  },
  addressesButton: {
    backgroundColor: '#4285F4',
    borderRadius: 25,
    paddingVertical: 12,
    marginVertical: 20,
    alignItems: 'center',
  },
  addressesButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4285F4',
    borderRadius: 25,
    paddingVertical: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#a0c4ff',
  },
});