import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { API_IGO } from '@env';
import { checkAuthAndRedirect, authHeader } from '../../auth/AuthService';
import { InputCep } from '../../components/common/InputCep';

export default function EditAddressesScreen({ navigation }) {
  const [addressType, setAddressType] = useState('Casa');
  const [allAddresses, setAllAddresses] = useState([]);
  const [formData, setFormData] = useState({
    addressData: [{
      address_type: 'Casa',
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighbourhood: '',
      city: '',
      state: ''
    }]
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
    if (!initialLoad && allAddresses.length > 0) {
      updateFormDataByAddressType(addressType);
    }
  }, [allAddresses]);

  useEffect(() => {
    if (allAddresses.length === 0) return;
  
    const existing = allAddresses.find(a => a.address_type === addressType);
  
    setFormData({
      addressData: [{
        // se existir, usa; senão, mantém um “template” em branco
        ...(existing ?? { 
          address_type: addressType,
          cep: '',
          street: '',
          number: '',
          complement: '',
          neighbourhood: '',
          city: '',
          state: ''
        }),
        address_id: existing?.address_id
      }]
    });
  }, [addressType, allAddresses]);

  const fetchAddressData = async () => {
    setLoading(true);
    try {
      const headers = await authHeader();
      
      const response = await fetch(`${API_IGO}profile`, {
        method: 'GET',
        headers
      });
  
      if (response.status === 404) {
        console.log('No address found, user will create a new one');
        setFormData({
          addressData: [{
            address_type: addressType, // Maintain the current address type
            cep: '',
            street: '',
            number: '',
            complement: '',
            neighbourhood: '',
            city: '',
            state: ''
          }]
        });
        setLoading(false);
        setInitialLoad(false);
        return;
      }
      const responseData = await response.json();
      if (response.ok && responseData.success) {
        
        const addressesData = responseData.data.addresses;
        
          // Set the address type from the first address
          if (addressesData && addressesData.length > 0) {
            // Armazenar todos os endereços formatados
            const formattedAddresses = addressesData.map(address => ({
              address_id: address.address_id || undefined,
              address_type: address.address_type || 'Casa',
              cep: address.cep || '',
              street: address.street || '',
              // Converte o número para string
              number: address.number ? String(address.number) : '',
              complement: address.complement || '',
              neighbourhood: address.neighbourhood || '',
              city: address.city || '',
              state: address.state || ''
            }));

            // Armazenar todos os endereços em um estado para referência posterior
            setAllAddresses(formattedAddresses);
            
            // Definir o tipo de endereço padrão como 'Casa' ou o primeiro tipo encontrado
            const defaultType = formattedAddresses.find(a => a.address_type === 'Casa')
              ? 'Casa'
              : formattedAddresses[0].address_type;

            setAddressType(defaultType);

          }
      } else {
        if (response.status === 401) {
          checkAuthAndRedirect(navigation);
        } else {
          Alert.alert('Erro', responseData.message || 'Erro ao carregar endereço.');
        }
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      if (error.message && error.message.includes('Network request failed')) {
        Alert.alert('Erro de Conexão', 'Verifique sua conexão com a internet e tente novamente.');
      } else if (error.message && error.message.includes('non-JSON response')) {
        Alert.alert('Erro de Servidor', 'O servidor retornou uma resposta inválida. Por favor, tente novamente mais tarde.');
      } else {
        Alert.alert('Erro', 'Ocorreu um problema ao carregar os dados do endereço.');
      }
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  // Função para atualizar os dados do formulário com base no tipo de endereço
  const updateFormDataByAddressType = (type) => {
    // Encontra o endereço correspondente ao tipo no allAddresses
    const existingAddress = allAddresses.find(addr => addr.address_type === type);
  
    if (existingAddress) {
      // Se encontrou o endereço do tipo solicitado, use-o
      setFormData({
        addressData: [{ ...existingAddress }]
      });
    } else {
      setFormData(prev => ({
        addressData: [{
          ...(existingAddress || { // Mantém os dados existentes ou cria novo
            address_type: type,
            cep: '',
            street: '',
            number: '',
            complement: '',
            neighbourhood: '',
            city: '',
            state: ''
          }),
          // Mantém o address_id apenas se existir
          address_id: existingAddress ? existingAddress.address_id : undefined
        }]
      }));
    }
  };

  const handleChange = (field, value) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
    
    setFormData(prev => {
      const updatedAddressData = [...prev.addressData];
      // Update the first address in the array
      updatedAddressData[0] = { ...updatedAddressData[0], [field]: value };
      return { ...prev, addressData: updatedAddressData };
    });
    
  };

  const searchCEP = async () => {
    if (!formData.addressData[0].cep || formData.addressData[0].cep.length < 8) {
      Alert.alert('Erro', 'Por favor, digite um CEP válido.');
      return;
    }
  
    const cleanCEP = formData.addressData[0].cep.replace(/\D/g, '');
    
    try {
      setLoading(true);
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const cepData = await response.json();
  
      if (cepData.erro) {
        Alert.alert('Erro', 'CEP não encontrado.');
        return;
      }
  
      setFormData(prev => {
        const updatedAddressData = [...prev.addressData];
        updatedAddressData[0] = { 
          ...updatedAddressData[0],
          street: cepData.logradouro || '',
          neighbourhood: cepData.bairro || '',
          city: cepData.localidade || '',
          state: cepData.uf || ''
        };
        return { ...prev, addressData: updatedAddressData };
      });
    } catch (error) {
      console.error('Error searching CEP:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao buscar o CEP.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const address = formData.addressData[0];
    
    if (!address.cep || address.cep.length < 8) {
      newErrors.cep = 'CEP é obrigatório';
    }
    
    if (!address.street.trim()) {
      newErrors.street = 'Logradouro é obrigatório';
    }
    
    if (!address.number.trim()) {
      newErrors.number = 'Número é obrigatório';
    }
    
    if (!address.neighbourhood.trim()) {
      newErrors.neighbourhood = 'Bairro é obrigatório';
    }
    
    if (!address.city.trim()) {
      newErrors.city = 'Cidade é obrigatória';
    }
    
    if (!address.state.trim()) {
      newErrors.state = 'Estado é obrigatório';
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

      const payload = {
        addressData: formData.addressData.map(address => ({
          // Filtra campos undefined e mantém apenas o necessário
          ...(address.address_id && { address_id: address.address_id }),
          address_type: address.address_type,
          cep: address.cep,
          street: address.street,
          number: address.number,
          complement: address.complement,
          neighbourhood: address.neighbourhood,
          city: address.city,
          state: address.state
        }))
      };
      
      const response = await fetch(`${API_IGO}profile/update-address`, {
        method: 'PUT',
        headers: { ...await authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      // Check for non-JSON response first
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        // Handle HTML error responses from server
        const errorText = await response.text();
        console.error('Server returned non-JSON response:', errorText);
        throw new Error("Server returned non-JSON response");
      }
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert(
          'Sucesso',
          'Endereço atualizado com sucesso!',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        if (response.status === 401) {
          checkAuthAndRedirect(navigation);
        } else {
          Alert.alert('Erro', data.message || 'Erro ao atualizar endereço.');
        }
      }
    } catch (error) {
      console.error('Error updating address:', error);
      if (error.message && error.message.includes('non-JSON response')) {
        Alert.alert('Erro de Servidor', 'O servidor retornou uma resposta inválida. Por favor, tente novamente mais tarde.');
      } else {
        Alert.alert('Erro', 'Ocorreu um problema ao atualizar os dados do endereço.');
      }
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
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
    >
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
                {/* Botão para Casa */}
                <TouchableOpacity 
                  style={[
                    styles.addressTypeButton,
                    addressType === 'Casa' && styles.addressTypeSelected
                  ]}
                  onPress={() => {
                    setAddressType('Casa');
                  }}
                >
                  <Text style={styles.addressTypeText}>Casa</Text>
                </TouchableOpacity>

                {/* Botão para Outro */}
                <TouchableOpacity 
                  style={[
                    styles.addressTypeButton,
                    addressType === 'Outro' && styles.addressTypeSelected
                  ]}
                  onPress={() => {
                    setAddressType('Outro');
                  }}
                >
                  <Text style={styles.addressTypeText}>Outro</Text>
                </TouchableOpacity>
              </View>

            <InputCep
              label="CEP *"
              value={formData.addressData[0].cep}
              onChangeText={(text) => handleChange('cep', text)}
              placeholder="00000-000"
              error={errors.cep}
              onSearch={searchCEP}
              loading={loading}
              required
            />

            <Text style={styles.fieldLabel}>Logradouro *</Text>
            <View style={[styles.inputContainer, errors.street && styles.inputError]}>
              <TextInput
                style={styles.input}
                value={formData.addressData[0].street}
                onChangeText={(text) => handleChange('street', text)}
                placeholder="Rua, Avenida, etc."
              />
              {errors.street && (
                <MaterialIcons name="error-outline" size={20} color="#FF3B30" style={styles.errorIcon} />
              )}
            </View>
            {errors.street && <Text style={styles.errorText}>{errors.street}</Text>}

            <Text style={styles.fieldLabel}>Número *</Text>
            <View style={[styles.inputContainer, errors.number && styles.inputError]}>
              <TextInput
                style={styles.input}
                value={formData.addressData[0].number}
                onChangeText={(text) => handleChange('number', text)}
                keyboardType="numeric"
                placeholder="123"
              />
              {errors.number && (
                <MaterialIcons name="error-outline" size={20} color="#FF3B30" style={styles.errorIcon} />
              )}
            </View>
            {errors.number && <Text style={styles.errorText}>{errors.number}</Text>}

            <Text style={styles.fieldLabel}>Complemento</Text>
            <View style={[styles.inputContainer, errors.complement && styles.inputError]}>
              <TextInput
                style={styles.input}
                value={formData.addressData[0].complement}
                onChangeText={(text) => handleChange('complement', text)}
                placeholder="Apto, Bloco, etc."
              />
              {errors.complement && (
                <MaterialIcons name="error-outline" size={20} color="#FF3B30" style={styles.errorIcon} />
              )}
            </View>
            {errors.complement && <Text style={styles.errorText}>{errors.complement}</Text>}

            <Text style={styles.fieldLabel}>Bairro *</Text>
            <View style={[styles.inputContainer, errors.neighbourhood && styles.inputError]}>
              <TextInput
                style={styles.input}
                value={formData.addressData[0].neighbourhood}
                onChangeText={(text) => handleChange('neighbourhood', text)}
                placeholder="Nome do bairro"
              />
              {errors.neighbourhood && (
                <MaterialIcons name="error-outline" size={20} color="#FF3B30" style={styles.errorIcon} />
              )}
            </View>
            {errors.neighbourhood && <Text style={styles.errorText}>{errors.neighbourhood}</Text>}

            <Text style={styles.fieldLabel}>Cidade *</Text>
            <View style={[styles.inputContainer, errors.city && styles.inputError]}>
              <TextInput
                style={styles.input}
                value={formData.addressData[0].city}
                onChangeText={(text) => handleChange('city', text)}
                placeholder="Nome da cidade"
              />
              {errors.city && (
                <MaterialIcons name="error-outline" size={20} color="#FF3B30" style={styles.errorIcon} />
              )}
            </View>
            {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}

            <Text style={styles.fieldLabel}>Estado *</Text>
            <View style={[styles.inputContainer, errors.state && styles.inputError]}>
              <TextInput
                style={styles.input}
                value={formData.addressData[0].state}
                onChangeText={(text) => handleChange('state', text)}
                placeholder="UF"
                maxLength={2}
                autoCapitalize="characters"
              />
              {errors.state && (
                <MaterialIcons name="error-outline" size={20} color="#FF3B30" style={styles.errorIcon} />
              )}
            </View>
            {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}

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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#fff',
  },
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