import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isValidEmail = (email) => {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = () => {
    console.log("E-mail digitado:", email);
    console.log("Senha digitada:", password);

    if (!email || !password) {
      Alert.alert("Erro", "Todos os campos são obrigatórios!");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Erro", "Por favor, insira um e-mail válido!");
      return;
    }

    // Navigate to Main instead of Dashboard
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/Logo iGo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.subtitle}>Entre com suas credenciais</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity 
        style={styles.forgotPassword}
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Não tem uma conta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signupLink}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%', 
    height: '100%', 
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#007BFF',
  },
  button: {
    backgroundColor: '#007BFF',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signupText: {
    color: '#333',
  },
  signupLink: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});