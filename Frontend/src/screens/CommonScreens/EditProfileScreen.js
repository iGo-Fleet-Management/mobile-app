import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const EditProfileScreen = ({ navigation, route }) => {
  const [formData, setFormData] = useState({
    nome: 'John',
    sobrenome: 'Doe',
    cpf: '123.456.789-10',
    dataNascimento: '02/09/2003',
    email: 'johndoe@gmail.com',
    telefone: '(31) 9 1234-5678',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Save the data and navigate back
    navigation.goBack();
  };

  const handleAddressesPress = () => {
    navigation.navigate('EditAddresses');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          testID="back-button"
        >
          <MaterialIcons name="chevron-left" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.fieldLabel}>Nome</Text>
          <TextInput
            style={styles.input}
            value={formData.nome}
            onChangeText={(text) => handleChange('nome', text)}
          />

          <Text style={styles.fieldLabel}>Sobrenome</Text>
          <TextInput
            style={styles.input}
            value={formData.sobrenome}
            onChangeText={(text) => handleChange('sobrenome', text)}
          />

          <Text style={styles.fieldLabel}>CPF</Text>
          <TextInput
            style={styles.input}
            value={formData.cpf}
            onChangeText={(text) => handleChange('cpf', text)}
            keyboardType="numeric"
          />

          <Text style={styles.fieldLabel}>Data de Nascimento</Text>
          <TextInput
            style={styles.input}
            value={formData.dataNascimento}
            onChangeText={(text) => handleChange('dataNascimento', text)}
            placeholder="DD/MM/AAAA"
          />

          <Text style={styles.fieldLabel}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.fieldLabel}>Telefone</Text>
          <TextInput
            style={styles.input}
            value={formData.telefone}
            onChangeText={(text) => handleChange('telefone', text)}
            keyboardType="phone-pad"
          />

          <TouchableOpacity 
            style={styles.addressesButton} 
            onPress={handleAddressesPress}
          >
            <Text style={styles.addressesButtonText}>Endereços</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Salvar Perfil</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  addressesButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  addressesButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;