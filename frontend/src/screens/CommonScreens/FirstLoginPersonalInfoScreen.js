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
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Skeleton from '../../components/common/Skeleton';
import { API_IGO } from '@env';

const FirstLoginPersonalInfoScreen = () => {
  const navigation = useNavigation();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [name, setName] = useState('');
  const [last_name, setLastName] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
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

        setName(userData.name || '');
        setLastName(userData.last_name || '');
        setCpf(userData.cpf || '');
        setBirthDate(userData.birth_date || '');
        setEmail(userData.email || '');
        setPhone(userData.phone || '');
      } catch (error) {
        console.error('Error fetching profile:', error);
        Alert.alert('Erro', 'Não foi possível recuperar seus dados. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);

  const formatCPF = (value) => {
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setCpf(value);
  };

  const formatBirthDate = (value) => {
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d)/, '$1/$2');
    value = value.replace(/(\d{2})(\d)/, '$1/$2');
    setBirthDate(value);
  };

  const formatPhone = (value) => {
    value = value.replace(/\D/g, '');
    if (value.length > 0) {
      value = '(' + value;
    }
    if (value.length > 3) {
      value = value.substring(0, 3) + ') ' + value.substring(3);
    }
    if (value.length > 10) {
      value = value.substring(0, 10) + '-' + value.substring(10);
    }
    setPhone(value);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!last_name.trim()) {
      newErrors.last_name = 'Sobrenome é obrigatório';
    }
    
    if (!cpf.trim() || cpf.length < 14) {
      newErrors.cpf = 'CPF inválido';
    }
    
    if (!birthDate.trim() || birthDate.length < 10) {
      newErrors.birthDate = 'Data de nascimento inválida';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Email inválido';
      }
    }
    
    if (!phone.trim() || phone.length < 15) {
      newErrors.phone = 'Telefone inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (validateForm()) {
      try {
        setIsSaving(true);
        const token = await AsyncStorage.getItem('userToken');
        
        const [day, month, year] = birthDate.split('/');
        const formattedBirthDate = `${year}-${month}-${day}`;
        
        const response = await fetch(`${API_IGO}profile/update-profile`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userData: {
              name,
              last_name,
              cpf: cpf.replace(/\D/g, ''),
              birthdate: formattedBirthDate,
              email,
              phone: phone.replace(/\D/g, '')
            }
          })
        });
        
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error('Failed to update profile');
        }
        
        navigation.navigate('FirstLoginAddressInfo');
      } catch (error) {
        console.error('Error updating profile:', error);
        Alert.alert('Erro', 'Não foi possível atualizar seu perfil. Por favor, tente novamente.');
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
          
          <View style={styles.formContainer}>
            {isLoading ? (
              <>
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
                  <Text style={styles.label}>Nome</Text>
                  <TextInput
                    style={[styles.input, errors.name ? styles.inputError : null]}
                    value={name}
                    onChangeText={setName}
                    placeholder="Nome"
                    autoCapitalize="words"
                  />
                  {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Sobrenome</Text>
                  <TextInput
                    style={[styles.input, errors.last_name ? styles.inputError : null]}
                    value={last_name}
                    onChangeText={setLastName}
                    placeholder="Sobrenome"
                    autoCapitalize="words"
                  />
                  {errors.last_name && <Text style={styles.errorText}>{errors.last_name}</Text>}
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>CPF</Text>
                  <TextInput
                    style={[styles.input, errors.cpf ? styles.inputError : null]}
                    value={cpf}
                    onChangeText={formatCPF}
                    placeholder="Ex: 123.456.789-01"
                    keyboardType="numeric"
                    maxLength={14}
                  />
                  {errors.cpf && <Text style={styles.errorText}>{errors.cpf}</Text>}
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Data de Nascimento</Text>
                  <TextInput
                    style={[styles.input, errors.birthDate ? styles.inputError : null]}
                    value={birthDate}
                    onChangeText={formatBirthDate}
                    placeholder="Ex: 01/01/2000"
                    keyboardType="numeric"
                    maxLength={10}
                  />
                  {errors.birthDate && <Text style={styles.errorText}>{errors.birthDate}</Text>}
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>E-mail</Text>
                  <TextInput
                    style={[styles.input, errors.email ? styles.inputError : null]}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="exemplo@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Telefone</Text>
                  <TextInput
                    style={[styles.input, errors.phone ? styles.inputError : null]}
                    value={phone}
                    onChangeText={formatPhone}
                    placeholder="Ex: (31) 9 1234-5678"
                    keyboardType="phone-pad"
                    maxLength={16}
                  />
                  {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
                </View>
              </>
            )}
          </View>
        </ScrollView>
        
        <TouchableOpacity 
          style={[
            styles.nextButton,
            (isLoading || isSaving) && styles.disabledButton
          ]}
          onPress={handleNext}
          disabled={isLoading || isSaving}
        >
          {isSaving ? (
            <Text style={styles.nextButtonText}>Salvando...</Text>
          ) : (
            <Text style={styles.nextButtonText}>Próximo</Text>
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
  formContainer: {
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
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
  inputError: {
    borderColor: '#e53935',
  },
  errorText: {
    color: '#e53935',
    fontSize: 12,
    marginTop: 4,
  },
  nextButton: {
    backgroundColor: '#4285F4',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    margin: 16,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default FirstLoginPersonalInfoScreen; 