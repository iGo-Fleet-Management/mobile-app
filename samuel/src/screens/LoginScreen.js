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