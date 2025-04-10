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

const FirstLoginAddressInfoScreen = ({ route }) => {
  const navigation = useNavigation();
  const { userData } = route.params || { userData: {} };
  
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
  const [numberComplement, setNumberComplement] = useState('');
  const [addressTypeOptions] = useState(['Casa', 'Trabalho', 'Outro']);
  const [addressTypeModalVisible, setAddressTypeModalVisible] = useState(false);

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
      
      // Remover todos os caracteres não numéricos
      const cleanCEP = cep.replace(/\D/g, '');
      
      // Verificar se o CEP tem 8 dígitos
      if (cleanCEP.length !== 8) {
        Alert.alert('CEP Inválido', 'Por favor, digite um CEP válido com 8 dígitos.');
        setAddressLoading(false);
        return;
      }
      
      // Simular um tempo de carregamento para melhor experiência do usuário
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Arrays para simulação de dados
      const streets = ['Rua das Flores', 'Av. Brasil', 'Rua São Paulo', 'Av. Paulista', 'Rua Amazonas', 'Rua dos Pinheiros', 'Av. Atlântica', 'Rua Sergipe', 'Av. Rebouças', 'Rua Augusta'];
      const neighborhoods = ['Centro', 'Jardim América', 'Vila Madalena', 'Pinheiros', 'Itaim Bibi', 'Moema', 'Brooklin', 'Morumbi', 'Consolação', 'Bela Vista'];
      const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre', 'Salvador', 'Recife', 'Fortaleza', 'Brasília', 'Manaus'];
      const states = ['SP', 'RJ', 'MG', 'PR', 'RS', 'BA', 'PE', 'CE', 'DF', 'AM'];
      
      // Usar o último dígito do CEP para escolher um índice aleatório
      const lastDigit = parseInt(cleanCEP.charAt(7));
      const index = lastDigit % 10;
      
      // Preencher os campos com os dados obtidos
      setLogradouro(streets[index]);
      setBairro(neighborhoods[index]);
      setCidade(cities[index]);
      setEstado(states[index]);
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
    
    // Validação dos campos
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

  const handleConfirm = () => {
    if (validateForm()) {
      const addressData = { 
        addressType, 
        cep, 
        logradouro, 
        numero, 
        complemento, 
        bairro, 
        cidade, 
        estado 
      };
      
      // Combinando dados do usuário com endereço
      const completeUserData = { ...userData, address: addressData };
      
      // Aqui você enviaria os dados para o backend
      console.log('Dados completos do usuário:', completeUserData);
      
      // Mostrando alerta de sucesso
      Alert.alert(
        "Cadastro Concluído",
        "Seu cadastro foi concluído com sucesso!",
        [
          { 
            text: "OK", 
            onPress: () => navigation.reset({
              index: 0,
              routes: [{ name: 'PassengerHomeScreen' }],
            })
          }
        ]
      );
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
                />
                {addressLoading ? (
                  <ActivityIndicator size="small" color="#007bff" style={styles.cepIcon} />
                ) : (
                  <TouchableOpacity 
                    style={styles.cepIconContainer} 
                    onPress={() => cep.length === 9 && fetchAddressByCEP(cep)}
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
        </ScrollView>
        
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmButtonText}>Confirmar</Text>
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
    color: '#666',
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