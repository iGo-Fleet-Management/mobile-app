import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Skeleton from '../../components/common/Skeleton';
import { API_IGO } from '@env';

const FirstLoginAddressInfoScreen = () => {
  const navigation = useNavigation();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [addressType, setAddressType] = useState('Casa');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [addressLoading, setAddressLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [addressTypeOptions] = useState(['Casa', 'Outro']);
  const [addressTypeModalVisible, setAddressTypeModalVisible] = useState(false);

  // This API call is optional since we're updating a new address
  // but we could fetch existing addresses if needed
  useEffect(() => {
    const fetchUserAddresses = async () => {
      try {
        setIsLoading(true);
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          navigation.navigate('Login');
          return;
        }
        
        const response = await fetch(`${API_IGO}profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        
        const responseData = await response.json();
        const userData = responseData.data;
        
        if (userData.addresses && userData.addresses.length > 0) {
          const primaryAddress = userData.addresses[0];
          setAddressType(primaryAddress.type || 'Casa');
          setCep(primaryAddress.zip_code || '');
          setLogradouro(primaryAddress.street || '');
          setNumero(primaryAddress.number || '');
          setComplemento(primaryAddress.complement || '');
          setBairro(primaryAddress.neighborhood || '');
          setCidade(primaryAddress.city || '');
          setEstado(primaryAddress.state || '');
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserAddresses();
  }, []);

  const formatCEP = (value) => {
    value = value.replace(/\D/g, '');
    value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    setCep(value);
    
    // Busca automática de CEP quando completo
    if (value.length === 9) {
      fetchAddressByCEP(value);
    } else if (value.length < 9) {
      // Limpar os campos de endereço se o CEP for alterado/incompleto
      setLogradouro('');
      setBairro('');
      setCidade('');
      setEstado('');
    }
  };

  const fetchAddressByCEP = async (cep) => {
    try {
      setAddressLoading(true);
      const cleanCEP = cep.replace(/\D/g, '');
      
      if (cleanCEP.length !== 8) {
        Alert.alert('CEP Inválido', 'Por favor, digite um CEP válido com 8 dígitos.');
        setAddressLoading(false);
        return;
      }
      
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        Alert.alert('CEP não encontrado', 'O CEP informado não foi encontrado.');
        return;
      }
      
      setLogradouro(data.logradouro || '');
      setBairro(data.bairro || '');
      setCidade(data.localidade || '');
      setEstado(data.uf || '');
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
      Alert.alert('Erro', 'Não foi possível recuperar o endereço para este CEP.');
    } finally {
      setAddressLoading(false);
    }
  };

  const selectAddressType = (type) => {
    setAddressType(type);
    setAddressTypeModalVisible(false);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!cep.trim() || cep.length < 9) {
      newErrors.cep = 'CEP inválido';
    }
    
    if (!logradouro.trim()) {
      newErrors.logradouro = 'Logradouro é obrigatório';
    }
    
    if (!numero.trim()) {
      newErrors.numero = 'Número é obrigatório';
    }
    
    if (!bairro.trim()) {
      newErrors.bairro = 'Bairro é obrigatório';
    }
    
    if (!cidade.trim()) {
      newErrors.cidade = 'Cidade é obrigatória';
    }
    
    if (!estado.trim()) {
      newErrors.estado = 'Estado é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async () => {
    if (validateForm()) {
      try {
        setIsSaving(true);
        const token = await AsyncStorage.getItem('userToken');
        
        const response = await fetch(`${API_IGO}profile/update-address`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            addressData:[{
              address_type: addressType,
              cep: cep.replace(/\D/g, ''),
              street: logradouro,
              number: numero,
              complement: complemento,
              neighbourhood: bairro,
              city: cidade,
              state: estado,
            }]
          })
        });

        const responseText = await response.text();
        console.log('Status:', response.status);
        console.log('Response:', responseText);
        
        if (!response.ok) {
          throw new Error('Failed to update address');
        }
        
        Alert.alert(
          "Cadastro Concluído",
          "Seu cadastro foi concluído com sucesso!",
          [
            { 
              text: "OK", 
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'PassengerHomeScreen' }],
                });
              }
            }
          ]
        );
      } catch (error) {
        console.error('Error updating address:', error);
        Alert.alert('Erro', 'Não foi possível salvar seu endereço. Por favor, tente novamente.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content}>
          <Text style={styles.headerTitle}>Complete as informações abaixo para finalizarmos seu cadastro!</Text>
          
          {isLoading ? (
            <>
              <Skeleton width="100%" height={50} marginBottom={15} />
              <Skeleton width="100%" height={60} marginBottom={15} />
              <Skeleton width="100%" height={60} marginBottom={15} />
              <Skeleton width="100%" height={60} marginBottom={15} />
              <Skeleton width="100%" height={60} marginBottom={15} />
              <Skeleton width="100%" height={60} marginBottom={15} />
              <Skeleton width="100%" height={60} marginBottom={15} />
            </>
          ) : (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Endereço(s):</Text>
                <TouchableOpacity 
                  style={styles.dropdownSelector}
                  onPress={() => setAddressTypeModalVisible(true)}
                >
                  <Text style={styles.dropdownText}>{addressType}</Text>
                  <MaterialIcons name="arrow-drop-down" size={24} color="#4285F4" />
                </TouchableOpacity>
              </View>
              
              <Modal
                transparent={true}
                visible={addressTypeModalVisible}
                animationType="fade"
                onRequestClose={() => setAddressTypeModalVisible(false)}
              >
                <TouchableWithoutFeedback onPress={() => setAddressTypeModalVisible(false)}>
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                      {addressTypeOptions.map((type) => (
                        <TouchableOpacity
                          key={type}
                          style={[
                            styles.modalOption,
                            addressType === type && styles.selectedOption
                          ]}
                          onPress={() => selectAddressType(type)}
                        >
                          <Text 
                            style={[
                              styles.modalOptionText,
                              addressType === type && styles.selectedOptionText
                            ]}
                          >
                            {type}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
              
              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>CEP</Text>
                  <View style={styles.cepContainer}>
                    <TextInput
                      style={[
                        styles.input, 
                        styles.cepInput,
                        errors.cep ? styles.inputError : null
                      ]}
                      value={cep}
                      onChangeText={formatCEP}
                      placeholder="00000-000"
                      keyboardType="numeric"
                      maxLength={9}
                      editable={!addressLoading}
                    />
                    {addressLoading ? (
                      <ActivityIndicator size="small" color="#007bff" style={styles.cepIcon} />
                    ) : (
                      <TouchableOpacity 
                        style={styles.cepIconContainer} 
                        onPress={() => cep.length === 9 && fetchAddressByCEP(cep)}
                        disabled={cep.length !== 9}
                      >
                        <Text style={styles.cepIcon}>🔍</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  {errors.cep && <Text style={styles.errorText}>{errors.cep}</Text>}
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Logradouro</Text>
                  <View style={styles.infoInputContainer}>
                    <TextInput
                      style={[
                        styles.input, 
                        styles.infoInput,
                        errors.logradouro ? styles.inputError : null,
                        addressLoading && styles.disabledInput
                      ]}
                      value={logradouro}
                      onChangeText={setLogradouro}
                      placeholder="Rua, Avenida, etc..."
                      editable={!addressLoading}
                    />
                    {addressLoading ? (
                      <MaterialIcons name="autorenew" size={24} color="#4285F4" style={[styles.infoIcon, styles.loadingIcon]} />
                    ) : (
                      <MaterialIcons name="location-on" size={24} color="#777" style={styles.infoIcon} />
                    )}
                  </View>
                  {errors.logradouro && <Text style={styles.errorText}>{errors.logradouro}</Text>}
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Número</Text>
                  <TextInput
                    style={[styles.input, errors.numero ? styles.inputError : null]}
                    value={numero}
                    onChangeText={setNumero}
                    placeholder="Ex: 1000"
                    keyboardType="numeric"
                  />
                  {errors.numero && <Text style={styles.errorText}>{errors.numero}</Text>}
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Complemento</Text>
                  <TextInput
                    style={styles.input}
                    value={complemento}
                    onChangeText={setComplemento}
                    placeholder="Ex: Apto 101"
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Bairro</Text>
                  <View style={styles.infoInputContainer}>
                    <TextInput
                      style={[
                        styles.input, 
                        styles.infoInput,
                        errors.bairro ? styles.inputError : null,
                        addressLoading && styles.disabledInput
                      ]}
                      value={bairro}
                      onChangeText={setBairro}
                      placeholder="Bairro"
                      editable={!addressLoading}
                    />
                    <MaterialIcons name="info" size={24} color="#777" style={styles.infoIcon} />
                  </View>
                  {errors.bairro && <Text style={styles.errorText}>{errors.bairro}</Text>}
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Cidade</Text>
                  <View style={styles.infoInputContainer}>
                    <TextInput
                      style={[
                        styles.input, 
                        styles.infoInput,
                        errors.cidade ? styles.inputError : null,
                        addressLoading && styles.disabledInput
                      ]}
                      value={cidade}
                      onChangeText={setCidade}
                      placeholder="Cidade"
                      editable={!addressLoading}
                    />
                    <MaterialIcons name="info" size={24} color="#777" style={styles.infoIcon} />
                  </View>
                  {errors.cidade && <Text style={styles.errorText}>{errors.cidade}</Text>}
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Estado</Text>
                  <TextInput
                    style={[
                      styles.input, 
                      styles.infoInput,
                      errors.estado ? styles.inputError : null,
                      addressLoading && styles.disabledInput
                    ]}
                    value={estado}
                    onChangeText={setEstado}
                    placeholder="Estado"
                    editable={!addressLoading}
                  />
                  {errors.estado && <Text style={styles.errorText}>{errors.estado}</Text>}
                </View>
              </View>
            </>
          )}
        </ScrollView>
        
        <TouchableOpacity 
          style={[
            styles.confirmButton,
            (isLoading || isSaving || addressLoading) && styles.disabledButton
          ]}
          onPress={handleConfirm}
          disabled={isLoading || isSaving || addressLoading}
        >
          {isSaving ? (
            <Text style={styles.confirmButtonText}>Salvando...</Text>
          ) : (
            <Text style={styles.confirmButtonText}>Confirmar</Text>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

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
    textAlign: 'center',
    margin: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  infoInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoInput: {
    flex: 1,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  infoIcon: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: '#ddd',
    padding: 12,
    height: '100%',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#888',
  },
  inputError: {
    borderColor: '#e53935',
  },
  errorText: {
    color: '#e53935',
    fontSize: 12,
    marginTop: 4,
  },
  confirmButton: {
    backgroundColor: '#4285F4',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    margin: 16,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.7,
    backgroundColor: '#cccccc',
  },
  loadingIcon: {
    color: '#4285F4',
    transform: [{rotate: '0deg'}],
    animationName: 'spin',
    animationDuration: '1s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear',
  },
  cepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cepInput: {
    flex: 1,
  },
  cepIconContainer: {
    padding: 10,
  },
  cepIcon: {
    fontSize: 18,
    marginRight: 5,
  },
  dropdownSelector: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  dropdownText: {
    fontSize: 16,
  },
  formContainer: {
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
  modalOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedOption: {
    backgroundColor: '#f0f7ff',
  },
  modalOptionText: {
    fontSize: 16,
  },
  selectedOptionText: {
    color: '#4285F4',
    fontWeight: 'bold',
  },
});

export default FirstLoginAddressInfoScreen; 