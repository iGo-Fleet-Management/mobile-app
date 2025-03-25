// Mocks for React Native
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    StyleSheet: {
      create: (styles) => styles
    },
    Text: jest.fn(({ children }) => children),
    View: jest.fn(({ children }) => children),
    TouchableOpacity: jest.fn(({ children }) => children),
    Image: jest.fn(() => null),
    ScrollView: jest.fn(({ children }) => children),
    FlatList: jest.fn(({ renderItem, data }) => data ? data.map(renderItem) : null),
    Platform: {
      OS: 'web',
      select: jest.fn(obj => obj.web)
    },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 812 }))
    },
    Alert: {
      alert: jest.fn()
    },
    // Add mocks for extracted modules
    ProgressBarAndroid: jest.fn(),
    Clipboard: {
      getString: jest.fn(),
      setString: jest.fn()
    },
    PushNotificationIOS: {
      requestPermissions: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    },
    NativeEventEmitter: jest.fn(() => ({
      addListener: jest.fn(),
      removeAllListeners: jest.fn()
    })),
    SettingsManager: {
      settings: {},
      getSettings: jest.fn()
    }
  };
});

// Mocks for other libraries
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: jest.fn(({ children }) => children),
  SafeAreaView: jest.fn(({ children }) => children),
  useSafeAreaInsets: jest.fn(() => ({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }))
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    push: jest.fn(),
  }),
  useRoute: () => ({
    params: {}
  })
}));

// Additional mocks
jest.mock('@expo/vector-icons', () => ({
  Ionicons: jest.fn(() => null),
  MaterialIcons: jest.fn(() => null),
  AntDesign: jest.fn(() => null)
}));

// Use fake timers
jest.useFakeTimers();

// Clear mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});