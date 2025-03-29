import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PassengerHomeScreen from '../PassengerHomeScreen'; 

// Mock dos componentes
jest.mock('../../../components/common/Header', () => {
  const { Text, View } = require('react-native');
  return ({ title, testID }) => (
    <View testID={testID}>
      <Text>{title}</Text>
    </View>
  );
});

jest.mock('../../../components/common/UserIcon', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ onPress, userName, testID }) => (
    <TouchableOpacity testID={testID} onPress={onPress}>
      <Text>{userName}</Text>
    </TouchableOpacity>
  );
});

jest.mock('../../../components/home/TravelModeSelector', () => {
  const { View, Text } = require('react-native');
  return ({ testID }) => (
    <View testID={testID}>
      <Text>TravelModeSelector</Text>
    </View>
  );
});

jest.mock('../../../components/home/StatusSwitch', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return ({ value, onHelpPress, testID }) => (
    <View testID={testID}>
      <Text>{value ? 'Liberado' : 'Não Liberado'}</Text>
      <TouchableOpacity testID={`${testID}-help-button`} onPress={onHelpPress}>
        <Text>Ajuda</Text>
      </TouchableOpacity>
    </View>
  );
});

jest.mock('../../../components/home/AlertBox', () => {
  const { View, Text } = require('react-native');
  return ({ message, testID }) => (
    <View testID={testID}>
      <Text>{message}</Text>
    </View>
  );
});

jest.mock('../../../components/home/MapContainer', () => {
  const { View } = require('react-native');
  return ({ testID }) => <View testID={testID} />;
});

jest.mock('../../../components/home/BottomUserBar', () => {
  const { View, Text } = require('react-native');
  return ({ userName, testID }) => (
    <View testID={testID}>
      <Text>{userName}</Text>
    </View>
  );
});

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 })
}));

describe('PassengerHomeScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('deve mostrar a data e dia da semana', () => {
    const { getByTestId } = render(
      <PassengerHomeScreen navigation={mockNavigation} />
    );
    
    expect(getByTestId('day-text').props.children).toBe('Segunda-Feira');
    expect(getByTestId('date-text').props.children).toBe('27 de Novembro de 2023');
  });

  it('deve navegar para o perfil ao pressionar o ícone do usuário', () => {
    const { getByTestId } = render(
      <PassengerHomeScreen navigation={mockNavigation} />
    );
    
    fireEvent.press(getByTestId('user-icon'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Profile');
  });

  it('deve navegar para ajuda ao pressionar o botão de ajuda', () => {
    const { getByTestId } = render(
      <PassengerHomeScreen navigation={mockNavigation} />
    );
    
    fireEvent.press(getByTestId('status-switch-help-button'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Ajuda');
  });

  it('deve mostrar a mensagem de alerta', () => {
    const { getByTestId } = render(
      <PassengerHomeScreen navigation={mockNavigation} />
    );
    
    expect(getByTestId('alert-box').children[0].props.children)
      .toBe('Seu motorista já iniciou o trajeto. Fique atento!');
  });

  it('deve renderizar todos os componentes principais', () => {
    const { getByTestId } = render(
      <PassengerHomeScreen navigation={mockNavigation} />
    );
    
    expect(getByTestId('travel-mode-selector')).toBeTruthy();
    expect(getByTestId('status-switch')).toBeTruthy();
    expect(getByTestId('map-container')).toBeTruthy();
    expect(getByTestId('bottom-user-bar')).toBeTruthy();
  });

  it('deve corresponder ao snapshot', () => {
    const { toJSON } = render(
      <PassengerHomeScreen navigation={mockNavigation} />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});