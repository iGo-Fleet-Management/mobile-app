// Este arquivo deve ser colocado na raiz do projeto ou em uma pasta __tests__
import '@testing-library/jest-native/extend-expect';

// Configuração global para lidar com animações do React Native
// Atualizado o mock para o caminho correto na versão 0.76.9
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({
  addListener: jest.fn(),
  removeListeners: jest.fn(),
}), { virtual: true });

// Como alternativa, você pode tentar este caminho se o de cima não funcionar
// jest.mock('react-native/Libraries/Animated/components/AnimatedImplementation', () => ({}), { virtual: true });

// Mock para o AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Configuração global para resolver problemas com o componente SafeAreaView
jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaProvider: jest.fn(({ children }) => children),
    SafeAreaView: jest.fn(({ children, style }) => <View style={style}>{children}</View>),
    useSafeAreaInsets: jest.fn(() => ({ top: 0, right: 0, bottom: 0, left: 0 })),
  };
});

// Mock para o React Navigation
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      setOptions: jest.fn(),
    }),
    useRoute: () => ({
      params: {
        address: {
          id: '1',
          street: 'Rua de Teste',
          number: '123',
          complement: 'Apto 101',
          neighborhood: 'Bairro Teste',
          city: 'Cidade Teste',
          state: 'Estado Teste',
          zipCode: '12345-678',
          country: 'Brasil',
          isDefault: true
        }
      }
    }),
  };
});

// Mock para fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ success: true }),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
);

// Mock para @env (variáveis de ambiente)
jest.mock('@env', () => ({
  API_IGO: 'https://api.example.com/'
}), { virtual: true });

// Mock para expo-font (adicionar)
jest.mock('expo-font', () => ({
  ...jest.requireActual('expo-font'),
  useFonts: () => [true, null],
  isLoaded: jest.fn(() => true),
  loadAsync: jest.fn(() => Promise.resolve()),
}));

// Mock para imagens do React Native
jest.mock('react-native/Libraries/Image/Image', () => {
  const OriginalImage = jest.requireActual('react-native/Libraries/Image/Image');
  return {
    ...OriginalImage,
    resolveAssetSource: jest.fn(() => ({ uri: 'mocked-uri' })),
  };
});

// Mock para assets de imagem
jest.mock('../../assets/images/Logo iGo.png', () => 'mocked-image-path', { virtual: true });

// Suprimir erros de console durante os testes
const originalConsoleError = console.error;
console.error = (...args) => {
  // Ignora erros específicos que podem ocorrer durante testes
  if (
    args[0] && 
    typeof args[0] === 'string' && 
    (args[0].includes('Warning:') ||
     args[0].includes('React does not recognize the') ||
     args[0].includes('Invalid prop') ||
     args[0].includes('loadedNativeFonts'))
  ) {
    return;
  }
  originalConsoleError(...args);
};