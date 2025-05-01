import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  SafeAreaView,
  StatusBar 
} from 'react-native';
import Button from '../../components/common/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_IGO } from '@env';
import { MaterialIcons } from '@expo/vector-icons';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleForgotPassword = async () => {
    console.log("E-mail digitado:", email);

    try {

      if (!email) {
        Alert.alert("Erro", "Por favor, insira seu e-mail.");
        return;
      }
      
      if (!isValidEmail(email)) {
        console.log("E-mail inválido detectado:", email);
        Alert.alert("Erro", "Por favor, insira um e-mail válido!");
        return;
      }
      
      setIsLoading(true);
      const response = await fetch(`${API_IGO}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        if (data.token) {
          await AsyncStorage.setItem('resetToken', data.token);
        }
      }

      Alert.alert("Sucesso", "Código de recuperação enviado para o e-mail.");
      navigation.navigate('ResetPassword');
    } catch (error) {
      console.error('Forgot password error:', error);
      Alert.alert('Erro', 'Ocorreu um erro durante o login. Por favor, tente novamente.');
    } finally { 
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recuperar Senha</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Esqueci minha senha</Text>
        <Text style={styles.subtitle}>Digite seu e-mail e enviaremos um código de verificação.</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={(text) => {
            setEmail(text.trim());
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />

          <Button
            title="Enviar Código"
            onPress={handleForgotPassword}
            loading={isLoading}
            style={styles.button}
          />

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Voltar para o login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 24,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  button: {
    backgroundColor: '#007BFF',
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    height: 52,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  link: {
    color: '#007BFF',
    marginTop: 10,
  },
});