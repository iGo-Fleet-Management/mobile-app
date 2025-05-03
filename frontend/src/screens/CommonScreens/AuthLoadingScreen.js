// src/screens/Auth/AuthLoadingScreen.js
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { getToken } from '../../auth/AuthService';
import { isTokenExpired } from '../../utils/jwtUtils';

export default function AuthLoadingScreen({ navigation }) {
  useEffect(() => {
    const bootstrapAsync = async () => {
      const token = await getToken();

      if (!token || isTokenExpired(token)) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
        return;
      }

      // Extrai o tipo de usuário do token
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userType = payload?.user_type;
      const resetPassword = payload?.reset_password;

      if (resetPassword) {
        navigation.reset({ index: 0, routes: [{ name: 'FirstLogin' }] });
      } else if (userType === 'motorista') {
        navigation.reset({ index: 0, routes: [{ name: 'DriverHomeScreen' }] });
      } else if (userType === 'passageiro') {
        navigation.reset({ index: 0, routes: [{ name: 'PassengerHomeScreen' }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      }
    };

    bootstrapAsync();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4a90e2" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
