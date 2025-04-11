import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DriverHomeScreen from '../DriverHomeScreen';

// Mock dos componentes
jest.mock('../../../components/common/Header', () => {
  const { View, Text } = require('react-native');
  return ({ title }) => (
    <View>
      <Text>{title}</Text>
    </View>
  );
});

jest.mock('../../../components/common/UserIcon', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ onPress, userName }) => (
    <TouchableOpacity onPress={onPress}>
      <Text>{userName}</Text>
    </TouchableOpacity>
  );
});

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 })
}));

describe('DriverHomeScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o cabeçalho com título e ícone do usuário', () => {
    const { getByText } = render(
      <DriverHomeScreen navigation={mockNavigation} />
    );
    
    expect(getByText('iGO')).toBeTruthy();
    expect(getByText('John')).toBeTruthy();
  });

  it('deve mostrar o conteúdo específico para motorista', () => {
    const { getByText } = render(
      <DriverHomeScreen navigation={mockNavigation} />
    );

    expect(getByText('Tela Motorista')).toBeTruthy();
    expect(getByText('Falta implementar')).toBeTruthy();
  });

  it('deve navegar para o perfil ao pressionar o ícone do usuário', () => {
    const { getByText } = render(
      <DriverHomeScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByText('John'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Profile');
  });

  it('deve renderizar a estrutura principal', () => {
    const { getByText, getByTestId } = render(
      <DriverHomeScreen navigation={mockNavigation} />
    );
    
    // Verifica se os elementos principais estão presentes
    expect(getByText('iGO')).toBeTruthy();
    expect(getByText('Tela Motorista')).toBeTruthy();
    
    // Verifica se o container principal está renderizado
    const container = getByText('Tela Motorista').parent.parent;
    expect(container).toBeTruthy();
  });

  it('deve corresponder ao snapshot', () => {
    const { toJSON } = render(
      <DriverHomeScreen navigation={mockNavigation} />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});