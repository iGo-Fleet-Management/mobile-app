import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ResetPasswordScreen from '../ResetPassword';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
};

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('ResetPasswordScreen', () => {
  it('renders all input fields', () => {
    const { getByPlaceholderText } = render(<ResetPasswordScreen navigation={mockNavigation} />);
    
    expect(getByPlaceholderText('Código de Verificação')).toBeTruthy();
    expect(getByPlaceholderText('Nova Senha')).toBeTruthy();
    expect(getByPlaceholderText('Confirmar Nova Senha')).toBeTruthy();
  });

  it('shows error when all fields are not filled', () => {
    const { getByText } = render(<ResetPasswordScreen navigation={mockNavigation} />);
    const resetButton = getByText('Redefinir Senha');

    fireEvent.press(resetButton);

    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Todos os campos são obrigatórios!');
  });

  it('shows error when passwords do not match', () => {
    const { getByPlaceholderText, getByText } = render(<ResetPasswordScreen navigation={mockNavigation} />);
    
    fireEvent.changeText(getByPlaceholderText('Código de Verificação'), '123456');
    fireEvent.changeText(getByPlaceholderText('Nova Senha'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirmar Nova Senha'), 'password456');
    
    const resetButton = getByText('Redefinir Senha');
    fireEvent.press(resetButton);

    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'As senhas não coincidem!');
  });

  it('navigates to login on successful password reset', () => {
    const { getByPlaceholderText, getByText } = render(<ResetPasswordScreen navigation={mockNavigation} />);
    
    fireEvent.changeText(getByPlaceholderText('Código de Verificação'), '123456');
    fireEvent.changeText(getByPlaceholderText('Nova Senha'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirmar Nova Senha'), 'password123');
    
    const resetButton = getByText('Redefinir Senha');
    fireEvent.press(resetButton);

    expect(Alert.alert).toHaveBeenCalledWith('Sucesso', 'Sua senha foi redefinida com sucesso!');
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
  });
});