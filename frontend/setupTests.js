import 'react-native-gesture-handler/jestSetup';

// Mock para o AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

// Mock para Expo Status Bar
jest.mock('expo-status-bar', () => ({
  StatusBar: jest.fn(),
}));

// Mock para o módulo de ícones
jest.mock('@expo/vector-icons', () => ({
  Ionicons: '',
  MaterialCommunityIcons: '',
  FontAwesome5: '',
  // Adicione outros ícones que você usa
}));

// Mock para a API de localização
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  }),
}));

// Mock para react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock para react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  SafeAreaView: ({ children }) => children,
}));

// Mock para DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

// Mock para Picker
jest.mock('@react-native-picker/picker', () => ({
  Picker: 'Picker',
}));

// Mock para react-native-webview
jest.mock('react-native-webview', () => 'WebView');

// Mocks globais
global.window = {};
global.window = global;
global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({}),
}));

// Mock para @env
jest.mock('react-native-dotenv', () => ({
  API_IGO: 'https://api-mocked-url.com',
}));

// Mock para Image (especialmente para require('../../../assets/images/Logo iGo.png'))
jest.mock('react-native/Libraries/Image/Image', () => ({
  resolveAssetSource: jest.fn(() => ({ uri: 'mocked-asset-uri' })),
}));

// Silenciar logs durante os testes
jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});

// Mock para Alert do React Native
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

// Mock para socket.io-client
jest.mock('socket.io-client', () => {
  const emit = jest.fn();
  const on = jest.fn();
  const off = jest.fn();
  const connect = jest.fn();
  const disconnect = jest.fn();
  
  return jest.fn(() => ({
    emit,
    on,
    off,
    connect,
    disconnect,
    io: {
      connect,
      disconnect,
    },
  }));
});

// Suprimir warnings específicos do React Native
jest.mock('react-native/Libraries/LogBox/LogBox', () => ({
  ignoreLogs: jest.fn(),
}));

jest.mock('react-native/Libraries/Image/Image', () => {
  const mockComponent = require('react-native/jest/mockComponent');
  return mockComponent('react-native/Libraries/Image/Image');
});

// Adicione outros mocks necessários aqui