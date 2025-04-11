import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PassengerProfileScreen from '../PassengerProfileScreen';
import { MaterialIcons } from '@expo/vector-icons';

// Mock dos componentes e ícones
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: jest.fn(({ name, testID }) => {
    const { View } = require('react-native');
    return <View testID={testID || `icon-${name}`} />;
  }),
}));

jest.mock('../../../components/common/Logout', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return ({ visible, onConfirm, onCancel }) => (
    visible ? (
      <View testID="logout-modal">
        <TouchableOpacity testID="confirm-logout" onPress={onConfirm}>
          <Text>Confirmar</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="cancel-logout" onPress={onCancel}>
          <Text>Cancelar</Text>
        </TouchableOpacity>
      </View>
    ) : null
  );
});

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 })
}));

describe('PassengerProfileScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar corretamente', () => {
    const { getByTestId, getByText } = render(
      <PassengerProfileScreen navigation={mockNavigation} />
    );

    expect(getByTestId('icon-chevron-left')).toBeTruthy();
    expect(getByText('Ajuda')).toBeTruthy();
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Passageiro')).toBeTruthy();
    expect(getByText('Editar Perfil')).toBeTruthy();
    expect(getByText('Sair')).toBeTruthy();
  });

  it('deve mostrar as informações do usuário', () => {
    const { getByText } = render(
      <PassengerProfileScreen navigation={mockNavigation} />
    );

    expect(getByText('20')).toBeTruthy();
    expect(getByText('(31) 9 1234-5678')).toBeTruthy();
    expect(getByText('johndoe@gmail.com')).toBeTruthy();
    expect(getByText('(Casa) R. 12, Bairro 1, Ipatinga')).toBeTruthy();
    expect(getByText('(Trabalho) R. 72, Bairro 4, Ipatinga')).toBeTruthy();
  });

  it('deve navegar para edição de perfil ao pressionar o botão', () => {
    const { getByText } = render(
      <PassengerProfileScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByText('Editar Perfil'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('EditProfile');
  });

  it('deve mostrar modal de logout ao pressionar sair', () => {
    const { getByText, queryByTestId } = render(
      <PassengerProfileScreen navigation={mockNavigation} />
    );

    expect(queryByTestId('logout-modal')).toBeNull();
    fireEvent.press(getByText('Sair'));
    expect(queryByTestId('logout-modal')).toBeTruthy();
  });

  it('deve navegar para login ao confirmar logout', () => {
    const { getByText, getByTestId } = render(
      <PassengerProfileScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByText('Sair'));
    fireEvent.press(getByTestId('confirm-logout'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
  });

  it('deve fechar modal ao cancelar logout', () => {
    const { getByText, queryByTestId } = render(
      <PassengerProfileScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByText('Sair'));
    expect(queryByTestId('logout-modal')).toBeTruthy();
    fireEvent.press(getByText('Cancelar'));
    expect(queryByTestId('logout-modal')).toBeNull();
  });

  it('deve voltar ao pressionar o botão de voltar', () => {
    const { getByTestId } = render(
      <PassengerProfileScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByTestId('icon-chevron-left'));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('deve corresponder ao snapshot', () => {
    const { toJSON } = render(
      <PassengerProfileScreen navigation={mockNavigation} />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});