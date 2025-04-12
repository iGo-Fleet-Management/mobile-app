import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { API_IGO } from '@env';
import { checkAuthAndRedirect, authHeader } from '../../auth/AuthService';
import InputCep from '../../components/common/InputCep';

export default function EditAddressesScreen({ navigation }) {
  const [addressType, setAddressType] = useState('Casa');
  const [addressData, setAddressData] = useState({
    type: 'Casa',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: ''
  });
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const checkAuthAndFetchAddress = async () => {
      const isAuth = await checkAuthAndRedirect(navigation);
      if (isAuth) {
        fetchAddressData();
      }
    };
    
    checkAuthAndFetchAddress();
  }, []);

  useEffect(() => {
    // Update the address type in the address data when it changes
    setAddressData(prev => ({ ...prev, type: addressType }));
  }, [addressType]);

  const fetchAddressData = async () => {
    setLoading(true);
    try {
      const headers = await authHeader();
      
      const response = await fetch(`${API_IGO}profile/address`, {
        method: 'GET',
        headers
      });
  
      // Handle 404 (no address) as a valid scenario, not an error
      if (response.status === 404) {
        console.log('No address found, user will create a new one');
        // Set default values for a new address
        setAddressData({
          type: 'Casa',
          cep: '',
          logradouro: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: ''
        });
        setLoading(false);
        setInitialLoad(false);
        return;
      }
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Address data retrieved successfully');
        
        // If there's an address, populate the form
        if (data && data.type) {
          setAddressType(data.type);
          
          setAddressData({
            type: data.type || 'Casa',
            cep: data.cep || '',
            logradouro: data.logradouro || '',
            numero: data.numero || '',
            complemento: data.complemento || '',
            bairro: data.bairro || '',
            cidade: data.cidade || ''
          });
        }
      } else {
        if (response.status === 401) {
          // Token expired or invalid
          checkAuthAndRedirect(navigation);
        } else {
          Alert.alert('Erro', data.message || 'Erro ao carregar endereço.');
        }
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      if (error.message && error.message.includes('Network request failed')) {
        Alert.alert('Erro de Conexão', 'Verifique sua conexão com a internet e tente novamente.');
      } else {
        console.log('Continuing with empty address form');
        // Set default values instead of showing an error
        setAddressData({
          type: 'Casa',
          cep: '',
          logradouro: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: ''
        });
      }
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  const handleChange = (field, value) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
    
    setAddressData(prev => ({ ...prev, [field]: value }));
    console.log(`Address field ${field} updated to:`, value); // Debug log
  };

  const searchCEP = async () => {
    if (!addressData.cep || addressData.cep.length < 8) {
      Alert.alert('Erro', 'Por favor, digite um CEP válido.');
      return;
    }

    const cleanCEP = addressData.cep.replace(/\D/g, '');
    
    try {
      setLoading(true);
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();

      if (data.erro) {
        Alert.alert('Erro', 'CEP não encontrado.');
        return;
      }

      setAddressData(prev => ({
        ...prev,
        logradouro: data.logradouro || prev.logradouro,
        bairro: data.bairro || prev.bairro,
        cidade: data.localidade || prev.cidade,
      }));
    } catch (error) {
      console.error('Error searching CEP:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao buscar o CEP.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!addressData.cep || addressData.cep.length < 8) {
      newErrors.cep = 'CEP é obrigatório';
    }
    
    if (!addressData.logradouro.trim()) {
      newErrors.logradouro = 'Logradouro é obrigatório';
    }
    
    if (!addressData.numero.trim()) {
      newErrors.numero = 'Número é obrigatório';
    }
    
    if (!addressData.bairro.trim()) {
      newErrors.bairro = 'Bairro é obrigatório';
    }
    
    if (!addressData.cidade.trim()) {
      newErrors.cidade = 'Cidade é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }
  
    setLoading(true);
    try {
      const headers = await authHeader();
      
      // Check if address exists to determine if it should update or create
      const checkResponse = await fetch(`${API_IGO}profile/address`, {
        method: 'GET',
        headers
      });
      
      // Determine if we're creating a new address or updating an existing one
      const method = checkResponse.status === 404 ? 'POST' : 'PUT';
      const endpoint = method === 'POST' ? 'profile/create-address' : 'profile/update-address';
      
      console.log('Sending address data:', JSON.stringify(addressData, null, 2));
      console.log(`Using method ${method} to endpoint ${endpoint}`);
      
      const response = await fetch(`${API_IGO}${endpoint}`, {
        method,
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addressData)
      });
  
      const data = await response.json();
      console.log('API response:', data);
  
      if (response.ok) {
        Alert.alert(
          'Sucesso', 
          method === 'POST' ? 'Endereço criado com sucesso!' : 'Endereço atualizado com sucesso!',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        if (response.status === 401) {
          // Token expired or invalid
          checkAuthAndRedirect(navigation);
        } else {
          Alert.alert('Erro', data.message || 'Erro ao atualizar endereço.');
        }
      }
    } catch (error) {
      console.error('Error updating address:', error);
      Alert.alert('Erro', 'Ocorreu um problema ao atualizar os dados do endereço.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Carregando dados do endereço...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="chevron-left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Endereços</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.fieldLabel}>Tipo de Endereço:</Text>
          <View style={styles.addressTypeContainer}>
            <TouchableOpacity 
              style={[
                styles.addressTypeButton,
                addressType === 'Casa' && styles.addressTypeSelected
              ]}
              onPress={() => setAddressType('Casa')}
            >
              <Text style={styles.addressTypeText}>Casa</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.addressTypeButton,
                addressType === 'Outro' && styles.addressTypeSelected
              ]}
              onPress={() => setAddressType('Outro')}
            >
              <Text style={styles.addressTypeText}>Outro</Text>
            </TouchableOpacity>
          </View>

          <InputCep
            label="CEP *"
            value={addressData.cep}
            onChangeText={(text) => handleChange('cep', text)}
            placeholder="00000-000"
            error={errors.cep}
            onSearch={searchCEP}
            loading={loading}
            required
          />

          <Text style={styles.fieldLabel}>Logradouro *</Text>
          <View style={[styles.inputContainer, errors.logradouro && styles.inputError]}>
            <TextInput
              style={styles.input}
              value={addressData.logradouro}
              onChangeText={(text) => handleChange('logradouro', text)}
              placeholder="Rua, Avenida, etc."
            />
            {errors.logradouro && (
              <MaterialIcons name="error-outline" size={20} color="#FF3B30" style={styles.errorIcon} />
            )}
          </View>
          {errors.logradouro && <Text style={styles.errorText}>{errors.logradouro}</Text>}

          <Text style={styles.fieldLabel}>Número *</Text>
          <View style={[styles.inputContainer, errors.numero && styles.inputError]}>
            <TextInput
              style={styles.input}
              value={addressData.numero}
              onChangeText={(text) => handleChange('numero', text)}
              keyboardType="numeric"
              placeholder="123"
            />
            {errors.numero && (
              <MaterialIcons name="error-outline" size={20} color="#FF3B30" style={styles.errorIcon} />
            )}
          </View>
          {errors.numero && <Text style={styles.errorText}>{errors.numero}</Text>}

          <Text style={styles.fieldLabel}>Complemento</Text>
          <TextInput
            style={styles.input}
            value={addressData.complemento}
            onChangeText={(text) => handleChange('complemento', text)}
            placeholder="Apto, Bloco, etc."
          />

          <Text style={styles.fieldLabel}>Bairro *</Text>
          <View style={[styles.inputContainer, errors.bairro && styles.inputError]}>
            <TextInput
              style={styles.input}
              value={addressData.bairro}
              onChangeText={(text) => handleChange('bairro', text)}
              placeholder="Nome do bairro"
            />
            {errors.bairro && (
              <MaterialIcons name="error-outline" size={20} color="#FF3B30" style={styles.errorIcon} />
            )}
          </View>
          {errors.bairro && <Text style={styles.errorText}>{errors.bairro}</Text>}

          <Text style={styles.fieldLabel}>Cidade *</Text>
          <View style={[styles.inputContainer, errors.cidade && styles.inputError]}>
            <TextInput
              style={styles.input}
              value={addressData.cidade}
              onChangeText={(text) => handleChange('cidade', text)}
              placeholder="Nome da cidade"
            />
            {errors.cidade && (
              <MaterialIcons name="error-outline" size={20} color="#FF3B30" style={styles.errorIcon} />
            )}
          </View>
          {errors.cidade && <Text style={styles.errorText}>{errors.cidade}</Text>}

          <Text style={styles.noteText}>* Campos obrigatórios</Text>

          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.disabledButton]} 
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Salvando...' : 'Salvar Endereço'}
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
  addressTypeContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  addressTypeButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addressTypeSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#4285F4',
  },
  addressTypeText: {
    fontSize: 16,
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
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  inputFlex: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    height: 48,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  infoIcon: {
    padding: 10,
  },
  searchButton: {
    backgroundColor: '#4285F4',
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 10,
  },
  noteText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#4285F4',
    borderRadius: 25,
    paddingVertical: 12,
    marginTop: 20,
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