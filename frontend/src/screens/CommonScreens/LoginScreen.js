import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_IGO } from '@env';
import Button from '../../components/common/Button';
import Input from '../../components/common/InputText';
import { authHeader } from '../../auth/AuthService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Por favor, informe seu e-mail');
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Por favor, insira um e-mail válido');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Por favor, informe sua senha');
      isValid = false;
    }

    return isValid;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_IGO}auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const loginResponse = await response.json();
      console.log('Login response:', loginResponse);

      if (response.ok && loginResponse.success) {
        // Check if the response has the expected structure
        if (loginResponse.data && loginResponse.data.token) {
          const token = loginResponse.data.token;
          console.log('Login successful, token received:', token);
          
          // Store the token securely
          await AsyncStorage.setItem('userToken', token);
          
          // Explicitly log the token being stored
          console.log('Token stored in AsyncStorage:', token);
          
          // Store complete user data for easy access
          if (loginResponse.data) {
            const userData = {
              ...loginResponse.data,
              // Add additional fields if needed
              email: email,  // Store the email since it might be needed later
            };
            
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
            console.log('User data stored in AsyncStorage:', userData);
          }
          
          // Route based on user type
          if (loginResponse.data.user_type) {
            if (loginResponse.data.user_type === 'motorista') {
              navigation.reset({
                index: 0,
                routes: [{ name: 'DriverHomeScreen' }],
              });
            } else if (loginResponse.data.user_type === 'passageiro') {
              navigation.reset({
                index: 0,
                routes: [{ name: 'PassengerHomeScreen' }],
              });
            } else if (loginResponse.data.reset_password) {
              navigation.reset({
                index: 0,
                routes: [{ name: 'FirstLogin' }],
              });
            } else {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });
            }
          } else {
            // Default navigation if user type is not available
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
          }
        } else {
          console.warn('No token received from server');
          Alert.alert(
            'Erro de Login', 
            'Não foi possível obter o token de autenticação. Por favor, contate o suporte.'
          );
        }
      } else {
        Alert.alert('Erro de Login', loginResponse.message || 'Credenciais inválidas. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Erro', 'Ocorreu um erro durante o login. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/images/Logo iGo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.subtitle}>Entre com suas credenciais</Text>
          <Text style={styles.title}>Login</Text>
          
          <Input
            label="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError('');
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Digite seu email"
            error={emailError}
            returnKeyType="next"
            blurOnSubmit={false}
            style={styles.inputField}
          />
          
          <Input
            label="Senha"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError('');
            }}
            secureTextEntry
            placeholder="Digite sua senha"
            error={passwordError}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            style={styles.inputField}
          />
          
          <Button
            title="Entrar"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
          />
          
          <Button
            title="Esqueceu a senha?"
            onPress={navigateToForgotPassword}
            variant="outline"
            size="small"
            style={styles.forgotPasswordButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  logoContainer: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: {
    width: '100%', 
    height: '100%', 
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  inputField: {
    width: '100%',
    marginBottom: 10,
  },
  loginButton: {
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
  },
  forgotPasswordButton: {
    marginTop: 5,
  },
});