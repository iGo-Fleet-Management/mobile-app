// setupTests.js - Coloque este arquivo na raiz do seu projeto

import 'react-native-gesture-handler/jestSetup';

// Mock para o módulo SafeAreaContext
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn(({ children }) => children),
    SafeAreaView: jest.fn(({ children }) => children),
    useSafeAreaInsets: jest.fn(() => inset),
  };
});

// Mock para @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  
  // Função para criar componentes mockados de ícones
  const createIconMock = (name) => {
    const IconComponent = ({ name, size, color, style, ...props }) => {
      return <View testID={`icon-${name}`} {...props} />;
    };
    return IconComponent;
  };
  
  // Retorne todos os conjuntos de ícones necessários
  return {
    MaterialIcons: createIconMock('MaterialIcons'),
    FontAwesome: createIconMock('FontAwesome'),
    Ionicons: createIconMock('Ionicons'),
    // Adicione outros conjuntos de ícones conforme necessário
  };
});

// Mock para o Alert nativo
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

// Silenciar os warnings específicos do React Native
jest.mock('react-native/Libraries/LogBox/LogBox', () => ({
  ignoreLogs: jest.fn(),
}));

// Necessário para o React Navigation
global.window = {};
global.window = global;