import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const EditAddressesScreen = ({ navigation }) => {
  const [addressType, setAddressType] = useState('Casa');
  const [addressData, setAddressData] = useState({
    cep: '35123-000',
    logradouro: 'Rua',
    numero: '12',
    complemento: '',
    bairro: 'Bairro',
    cidade: 'Cidade'
  });

  const handleChange = (field, value) => {
    setAddressData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Save the address data and navigate back
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="chevron-left" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.fieldLabel}>Endereço(s):</Text>
          <View style={styles.addressTypeContainer}>
            <TouchableOpacity 
              style={[
                styles.addressTypeButton,
                addressType === 'Casa' && styles.addressTypeSelected
              ]}
              onPress={() => setAddressType('Casa')}
            >
              <Text style={styles.addressTypeText}>Casa</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.addressTypeButton,
                addressType === 'Outro' && styles.addressTypeSelected
              ]}
              onPress={() => setAddressType('Outro')}
            >
              <Text style={styles.addressTypeText}>Outro</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.fieldLabel}>CEP</Text>
          <TextInput
            style={styles.input}
            value={addressData.cep}
            onChangeText={(text) => handleChange('cep', text)}
            keyboardType="numeric"
          />

          <Text style={styles.fieldLabel}>Logradouro</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.inputFlex}
              value={addressData.logradouro}
              onChangeText={(text) => handleChange('logradouro', text)}
            />
            <TouchableOpacity style={styles.infoIcon}>
              <MaterialIcons name="info-outline" size={24} color="#4285F4" />
            </TouchableOpacity>
          </View>

          <Text style={styles.fieldLabel}>Número</Text>
          <TextInput
            style={styles.input}
            value={addressData.numero}
            onChangeText={(text) => handleChange('numero', text)}
            keyboardType="numeric"
          />

          <Text style={styles.fieldLabel}>Complemento</Text>
          <TextInput
            style={styles.input}
            value={addressData.complemento}
            onChangeText={(text) => handleChange('complemento', text)}
          />

          <Text style={styles.fieldLabel}>Bairro</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.inputFlex}
              value={addressData.bairro}
              onChangeText={(text) => handleChange('bairro', text)}
            />
            <TouchableOpacity style={styles.infoIcon}>
              <MaterialIcons name="info-outline" size={24} color="#4285F4" />
            </TouchableOpacity>
          </View>

          <Text style={styles.fieldLabel}>Cidade</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.inputFlex}
              value={addressData.cidade}
              onChangeText={(text) => handleChange('cidade', text)}
            />
            <TouchableOpacity style={styles.infoIcon}>
              <MaterialIcons name="info-outline" size={24} color="#4285F4" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Salvar</Text>
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
    paddingHorizontal: 15,
    height: 50,
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    height: 48,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  inputFlex: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    height: 48,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  infoIcon: {
    padding: 10,
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
});

export default EditAddressesScreen;