import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import LoginScreen from '../src/screens/LoginScreen';

// Mock the dependencies
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: 'SafeAreaView',
}));

// Mock the navigation
const mockNavigation = {
  navigate: jest.fn(),
};

// Mock the image require
jest.mock('../../assets/images/Logo iGo.png', () => 'mockedImagePath');

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    
    expect(getByText('Entre com suas credenciais')).toBeTruthy();
    expect(getByPlaceholderText('E-mail')).toBeTruthy();
    expect(getByPlaceholderText('Senha')).toBeTruthy();
    expect(getByText('Esqueceu a senha?')).toBeTruthy();
    expect(getByText('Entrar')).toBeTruthy();
    expect(getByText('Não tem uma conta?')).toBeTruthy();
    expect(getByText('Cadastre-se')).toBeTruthy();
  });

  it('navigates to SignUp screen when Cadastre-se is pressed', () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    
    fireEvent.press(getByText('Cadastre-se'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('SignUp');
  });

  it('navigates to ForgotPassword screen when Esqueceu a senha is pressed', () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    
    fireEvent.press(getByText('Esqueceu a senha?'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('ForgotPassword');
  });

  it('shows alert when email and password are empty', () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    
    fireEvent.press(getByText('Entrar'));
    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Todos os campos são obrigatórios!');
  });

  it('shows alert when email is invalid', () => {
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    
    fireEvent.changeText(getByPlaceholderText('E-mail'), 'invalidEmail');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'password123');
    fireEvent.press(getByText('Entrar'));
    
    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Por favor, insira um e-mail válido!');
  });

  it('navigates to Main screen when valid email and password are provided', () => {
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    
    fireEvent.changeText(getByPlaceholderText('E-mail'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'password123');
    fireEvent.press(getByText('Entrar'));
    
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Main');
  });

  it('updates email state when text input changes', () => {
    const { getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    
    const emailInput = getByPlaceholderText('E-mail');
    fireEvent.changeText(emailInput, 'test@example.com');
    
    expect(emailInput.props.value).toBe('test@example.com');
  });

  it('updates password state when text input changes', () => {
    const { getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    
    const passwordInput = getByPlaceholderText('Senha');
    fireEvent.changeText(passwordInput, 'password123');
    
    expect(passwordInput.props.value).toBe('password123');
  });

  it('validates email format correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    
    // Test invalid email formats
    const invalidEmails = ['test', 'test@', 'test@example', '@example.com'];
    const emailInput = getByPlaceholderText('E-mail');
    const passwordInput = getByPlaceholderText('Senha');
    
    invalidEmails.forEach(email => {
      fireEvent.changeText(emailInput, email);
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(getByText('Entrar'));
      expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Por favor, insira um e-mail válido!');
      jest.clearAllMocks();
    });
    
    // Test valid email format
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(getByText('Entrar'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Main');
  });
});