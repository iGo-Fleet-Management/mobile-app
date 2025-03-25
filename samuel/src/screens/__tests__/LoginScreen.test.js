import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import LoginScreen from '../LoginScreen';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
};

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('LoginScreen', () => {
  it('renders login screen correctly', () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen navigation={mockNavigation} />);
    
    expect(getByText('Bem-vindo de Volta')).toBeTruthy();
    expect(getByPlaceholderText('E-mail')).toBeTruthy();
    expect(getByPlaceholderText('Senha')).toBeTruthy();
  });

  it('shows error for empty fields', () => {
    const { getByText } = render(<LoginScreen navigation={mockNavigation} />);
    const loginButton = getByText('Entrar');

    fireEvent.press(loginButton);

    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Por favor, preencha todos os campos.');
  });

  it('validates email format', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={mockNavigation} />);
    
    fireEvent.changeText(getByPlaceholderText('E-mail'), 'invalid-email');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'password123');
    fireEvent.press(getByText('Entrar'));

    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Por favor, insira um e-mail válido.');
  });

  it('navigates to dashboard on successful login', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={mockNavigation} />);
    
    fireEvent.changeText(getByPlaceholderText('E-mail'), 'user@example.com');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'password123');
    fireEvent.press(getByText('Entrar'));

    expect(Alert.alert).toHaveBeenCalledWith('Sucesso', 'Login realizado com sucesso!');
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Dashboard');
  });

  it('navigates to forgot password screen', () => {
    const { getByText } = render(<LoginScreen navigation={mockNavigation} />);
    
    fireEvent.press(getByText('Esqueceu sua senha?'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('ForgotPassword');
  });

  it('navigates to signup screen', () => {
    const { getByText } = render(<LoginScreen navigation={mockNavigation} />);
    
    fireEvent.press(getByText('Criar Conta'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('SignUp');
  });
}); 