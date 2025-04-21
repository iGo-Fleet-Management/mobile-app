import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return !!token;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('userToken');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const getUserType = async () => {
  try {
    // Get from stored user data
    const userData = await getUserData();
    return userData?.user_type || null;
  } catch (error) {
    console.error('Error getting user type:', error);
    return null;
  }
};

export const logout = async (navigation) => {
  try {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    
    if (navigation) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error during logout:', error);
    return false;
  }
};

export const checkAuthAndRedirect = async (navigation) => {
  const authenticated = await isAuthenticated();
  
  if (!authenticated) {
    Alert.alert(
      'Sessão Expirada',
      'Sua sessão expirou. Por favor, faça login novamente.',
      [
        { 
          text: 'OK', 
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
    return false;
  }
  
  return true;
};

export const authHeader = async () => {
  const token = await getToken();
  
  if (token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  } else {
    return {
      'Content-Type': 'application/json'
    };
  }
};