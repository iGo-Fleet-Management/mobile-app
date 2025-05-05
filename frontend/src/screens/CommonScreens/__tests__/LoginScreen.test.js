import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../LoginScreen';

// Mock the modules we need
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('@env', () => ({
  API_IGO: 'https://api-mocked-url.com',
}), { virtual: true });

// Mock the navigation
const mockNavigation = {
  navigate: jest.fn(),
  reset: jest.fn(),
};

// Mock fetch for API calls
global.fetch = jest.fn();

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('LoginScreen', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Reset fetch mock
    fetch.mockReset();
  });

  test('exibe erro quando tenta fazer login sem email', async () => {
    // Render the component
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    
    // Enter only password (no email)
    const passwordInput = getByPlaceholderText('Digite sua senha');
    fireEvent.changeText(passwordInput, 'senha123');
    
    // Click login button
    const loginButton = getByText('Entrar');
    fireEvent.press(loginButton);
    
    // Check if the correct error message is displayed
    await waitFor(() => {
      expect(getByText('Por favor, informe seu e-mail')).toBeTruthy();
    });
    
    // Verify the API wasn't called
    expect(fetch).not.toHaveBeenCalled();
  });

  test('exibe erro quando tenta fazer login sem senha', async () => {
    // Render the component
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    
    // Enter only email (no password)
    const emailInput = getByPlaceholderText('Digite seu email');
    fireEvent.changeText(emailInput, 'teste@exemplo.com');
    
    // Click login button
    const loginButton = getByText('Entrar');
    fireEvent.press(loginButton);
    
    // Check if the correct error message is displayed
    await waitFor(() => {
      expect(getByText('Por favor, informe sua senha')).toBeTruthy();
    });
    
    // Verify the API wasn't called
    expect(fetch).not.toHaveBeenCalled();
  });

  test('exibe erro quando o email é inválido', async () => {
    // Render the component
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    
    // Enter invalid email format
    const emailInput = getByPlaceholderText('Digite seu email');
    fireEvent.changeText(emailInput, 'emailinvalido');
    
    // Enter password
    const passwordInput = getByPlaceholderText('Digite sua senha');
    fireEvent.changeText(passwordInput, 'senha123');
    
    // Click login button
    const loginButton = getByText('Entrar');
    fireEvent.press(loginButton);
    
    // Check if the correct error message is displayed
    await waitFor(() => {
      expect(getByText('Por favor, insira um e-mail válido')).toBeTruthy();
    });
    
    // Verify the API wasn't called
    expect(fetch).not.toHaveBeenCalled();
  });

  test('redireciona para tela de primeiro login quando reset_password é true', async () => {
    // Mock successful API response with reset_password flag
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: {
          token: 'fake-token',
          user_type: 'passageiro',
          reset_password: true
        }
      })
    });
    
    // Render the component
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    
    // Fill in valid credentials
    const emailInput = getByPlaceholderText('Digite seu email');
    fireEvent.changeText(emailInput, 'teste@exemplo.com');
    
    const passwordInput = getByPlaceholderText('Digite sua senha');
    fireEvent.changeText(passwordInput, 'senha123');
    
    // Click login button
    const loginButton = getByText('Entrar');
    fireEvent.press(loginButton);
    
    // Wait for async operations to complete
    await waitFor(() => {
      // Verify AsyncStorage was called with the token
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('userToken', 'fake-token');
      
      // Verify navigation reset was called to redirect to FirstLogin
      expect(mockNavigation.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'FirstLogin' }],
      });
    });
  });

  test('navega para a tela de recuperação de senha quando o botão é pressionado', () => {
    // Render the component
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    
    // Find and click the forgot password button
    const forgotPasswordButton = getByText('Esqueceu a senha?');
    fireEvent.press(forgotPasswordButton);
    
    // Verify navigation was called with the correct screen
    expect(mockNavigation.navigate).toHaveBeenCalledWith('ForgotPassword');
  });
});