import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PassengerProfileScreen from '../src/screens/PassengerProfileScreen';

// Mock LogoutConfirmation component
jest.mock('../components/common/Logout', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return jest.fn(({ visible, onConfirm, onCancel }) => (
    visible ? (
      <View>
        <Text>Tem certeza que deseja sair?</Text>
        <TouchableOpacity onPress={onConfirm}>
          <Text>Confirmar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCancel}>
          <Text>Cancelar</Text>
        </TouchableOpacity>
      </View>
    ) : null
  ));
});

describe('PassengerProfileScreen', () => {
  const mockNavigation = {
    goBack: jest.fn(),
    navigate: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user profile information', () => {
    const { getByText } = render(<PassengerProfileScreen navigation={mockNavigation} />);
    
    // Verificar nome completo
    expect(getByText('John Doe')).toBeTruthy();
    
    // Verificar role
    expect(getByText('Passageiro')).toBeTruthy();
    
    // Verificar informações pessoais
    expect(getByText('20')).toBeTruthy();
    expect(getByText('(31) 9 1234-5678')).toBeTruthy();
    expect(getByText('johndoe@gmail.com')).toBeTruthy();
    
    // Verificar endereços
    expect(getByText(/\(Casa\) R\. 12, Bairro 1, Ipatinga/)).toBeTruthy();
    expect(getByText(/\(Trabalho\) R\. 72, Bairro 4, Ipatinga/)).toBeTruthy();
  });

  it('navigates to EditProfile when Edit Profile button is pressed', () => {
    const { getByText } = render(<PassengerProfileScreen navigation={mockNavigation} />);
    
    const editButton = getByText('Editar Perfil');
    fireEvent.press(editButton);
    
    expect(mockNavigation.navigate).toHaveBeenCalledWith('EditProfile');
  });

  it('shows logout confirmation modal when Logout button is pressed', () => {
    const { getByText } = render(<PassengerProfileScreen navigation={mockNavigation} />);
    
    const logoutButton = getByText('Sair');
    fireEvent.press(logoutButton);
    
    expect(getByText('Tem certeza que deseja sair?')).toBeTruthy();
  });

  it('navigates to Login screen when logout is confirmed', () => {
    const { getByText } = render(<PassengerProfileScreen navigation={mockNavigation} />);
    
    const logoutButton = getByText('Sair');
    fireEvent.press(logoutButton);
    
    const confirmButton = getByText('Confirmar');
    fireEvent.press(confirmButton);
    
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
  });

  it('closes logout modal when canceled', () => {
    const { getByText, queryByText } = render(<PassengerProfileScreen navigation={mockNavigation} />);
    
    const logoutButton = getByText('Sair');
    fireEvent.press(logoutButton);
    
    const cancelButton = getByText('Cancelar');
    fireEvent.press(cancelButton);
    
    expect(queryByText('Tem certeza que deseja sair?')).toBeNull();
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<PassengerProfileScreen navigation={mockNavigation} />);
    expect(toJSON()).toMatchSnapshot();
  });
});