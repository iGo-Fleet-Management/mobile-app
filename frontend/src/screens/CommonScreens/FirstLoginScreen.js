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
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { API_IGO } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Skeleton from '../../components/common/Skeleton';

const FirstLoginScreen = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          navigation.navigate('Login');
          return;
        }
        
        const response = await fetch(`${API_IGO}/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        
        const responseData = await response.json();
        
        if (responseData.success && responseData.data) {
          setUserName(responseData.data.name || '');
          setUserEmail(responseData.data.email || '');
        } else {
          throw new Error('Invalid data format from API');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        Alert.alert('Erro', 'Não foi possível recuperar seus dados. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validatePassword = () => {
    const newErrors = {};
    
    // Requisitos da senha conforme mostrado na imagem
    if (!password) {
      newErrors.password = 'Digite sua nova senha';
    } else {
      if (password.length < 8) {
        newErrors.password = 'Senha deve ter no mínimo 8 caracteres';
      }
      
      if (!/[A-Z]/.test(password)) {
        newErrors.password = 'Senha deve conter letras maiúsculas';
      }
      
      if (!/[a-z]/.test(password)) {
        newErrors.password = 'Senha deve conter letras minúsculas';
      }
      
      if (!/\d/.test(password)) {
        newErrors.password = 'Senha deve conter números';
      }
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua senha';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (validatePassword()) {
      try {
        setIsLoading(true);
        const token = await AsyncStorage.getItem('userToken');
        
        const response = await fetch(`${API_IGO}/forgot-password/reset-password`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            newPassword: password,
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to update password');
        }
        
        navigation.navigate('FirstLoginPersonalInfo');
      } catch (error) {
        console.error('Error updating password:', error);
        Alert.alert('Erro', 'Não foi possível alterar sua senha. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.welcomeTitle}>Bem vindo {userName}!</Text>
          
          <Text style={styles.welcomeMessage}>
            Seu motorista já criou seu usuário previamente!
          </Text>
          
          <Text style={styles.additionalInfo}>
            Porém vamos precisar de mais alguns dados, mas antes disso, crie uma nova senha.
          </Text>
          
          <View style={styles.passwordSection}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Digite sua nova senha</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="Digite sua nova senha"
                />
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                  <MaterialIcons 
                    name={showPassword ? "visibility-off" : "visibility"} 
                    size={24} 
                    color="#777" 
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirme sua nova senha</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  placeholder="Confirme sua nova senha"
                />
                <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.eyeIcon}>
                  <MaterialIcons 
                    name={showConfirmPassword ? "visibility-off" : "visibility"} 
                    size={24} 
                    color="#777" 
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>
          </View>
          
          <View style={styles.passwordRequirements}>
            <Text style={styles.requirementsTitle}>Sua senha deve conter:</Text>
            <View style={styles.requirementItem}>
              <Text>• Mínimo de 8 caracteres</Text>
            </View>
            <View style={styles.requirementItem}>
              <Text>• Letras maiúsculas e minúsculas</Text>
            </View>
            <View style={styles.requirementItem}>
              <Text>• Números</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.changePasswordButton}
            onPress={handleChangePassword}
          >
            <Text style={styles.changePasswordButtonText}>Alterar Senha</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  welcomeMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  additionalInfo: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#555',
  },
  passwordSection: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 4,
  },
  passwordRequirements: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 32,
  },
  requirementsTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  changePasswordButton: {
    backgroundColor: '#4285F4',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  changePasswordButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default FirstLoginScreen; 