/* import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [dob, setDob] = useState('');

 
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

 
  const isValidCPF = (cpf) => {
    return cpf.length === 14;
  };

  const isValidDate = (dob) => {
    return dob.length === 10;
  };

  const isValidPhone = (phone) => {
    return phone.length >= 14;
  };

  const formatCPF = (value) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{3})(\d)/, "$1.$2");
    value = value.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/\.(\d{3})(\d)/, ".$1-$2");
    return value.substring(0, 14);
   };

  const formatDate = (value) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/, "$1/$2");
    value = value.replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
    return value.substring(0, 10);
  };


  const formatPhone = (value) => {
    value = value.replace(/\D/g, ""); 

    if (value.startsWith("55") && value.length > 2) {
      value = "+" + value;
    }

    if (value.length <= 10) {
      value = value.replace(/^(\d{2})(\d)/, "($1) $2");
      value = value.replace(/(\d{4})(\d)/, "$1-$2");
    } else {
      value = value.replace(/^(\d{2})(\d)/, "($1) $2");
      value = value.replace(/(\d{5})(\d)/, "$1-$2");
    }

    return value.substring(0, 16);
  };

  const handleSignUp = () => {
    console.log("Nome:", name);
    console.log("Sobrenome:", surname);
    console.log("E-mail:", email);
    console.log("Telefone:", phone);
    console.log("CPF:", cpf);
    console.log("Data de Nascimento:", dob);

    if (!name || !surname || !email || !phone || !cpf || !dob) {
      Alert.alert("Erro", "Todos os campos são obrigatórios!");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Erro", "Por favor, insira um e-mail válido!");
      return;
    }

    if (!isValidPhone(phone)) {
      Alert.alert("Erro", "Número de telefone inválido! Use o formato (11) 98765-4321.");
      return;
    }

    if (!isValidCPF(cpf)) {
      Alert.alert("Erro", "CPF inválido! O formato correto é XXX.XXX.XXX-XX.");
      return;
    }

    if (!isValidDate(dob)) {
      Alert.alert("Erro", "Data de nascimento inválida! Use o formato DD/MM/AAAA.");
      return;
    }

    Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
    navigation.navigate('Dashboard');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete as informações para criar sua conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Sobrenome"
        value={surname}
        onChangeText={setSurname}
      />
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
        placeholder="Telefone"
        value={phone}
        onChangeText={(text) => setPhone(formatPhone(text))}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="CPF"
        value={cpf}
        onChangeText={(text) => setCpf(formatCPF(text))}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Data de Nascimento"
        value={dob}
        onChangeText={(text) => setDob(formatDate(text))}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Criar Conta</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Voltar para o login</Text>
      </TouchableOpacity>

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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
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
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
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
 */