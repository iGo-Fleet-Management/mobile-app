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
import { MaterialIcons } from '@expo/vector-icons';
import { API_IGO } from '@env';
import Button from '../../components/common/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ResetPasswordScreen({ navigation }) {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = async () => {

    try {
      const token = await AsyncStorage.getItem('resetToken');
  
      if (!code || !newPassword || !confirmPassword) {
        Alert.alert("Erro", "Todos os campos são obrigatórios!");
        return;
      }
  
      if (newPassword !== confirmPassword) {
        Alert.alert("Erro", "As senhas não coincidem!");
        return;
      }

      setIsLoading(true);
      const response = await fetch(`${API_IGO}/auth/reset-password-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token,
          code,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();  
      console.log("Resposta do servidor:", data);

      Alert.alert("Sucesso", "Sua senha foi redefinida com sucesso!");
      navigation.navigate('Login');
      
    } catch (error) {
      console.error('Forgot password error:', error);
      Alert.alert('Erro', 'Ocorreu um erro durante o login. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Redefinir Senha</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Digite o código de verificação e crie uma nova senha.</Text>

        <TextInput
          style={styles.input}
          placeholder="Código de Verificação"
          value={code}
          onChangeText={setCode}
          keyboardType="numeric"
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Nova Senha"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar Nova Senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />

          <Button
            title="Resetar Senha"
            onPress={handleResetPassword}
            loading={isLoading}
            style={styles.button}
          />
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
    color: '#333',
  },
  headerRight: {
    width: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007BFF',
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    height: 52,
  }
});