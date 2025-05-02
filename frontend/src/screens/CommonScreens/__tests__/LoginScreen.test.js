import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../LoginScreen';
import { API_IGO } from '@env';

// Mock de componentes e funções externos
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

describe('Tela de Login', () => {
  // Configuração de navegação para os testes
  const mockNavigation = {
    navigate: jest.fn(),
    reset: jest.fn(),
  };

  // Reset dos mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
    AsyncStorage.setItem.mockClear();
  });

  test('Deve renderizar corretamente todos os elementos da tela de login', () => {
    // Arrange & Act
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    // Assert
    expect(getByText('Login')).toBeTruthy();
    expect(getByText('Entre com suas credenciais')).toBeTruthy();
    expect(getByPlaceholderText('Digite seu email')).toBeTruthy();
    expect(getByPlaceholderText('Digite sua senha')).toBeTruthy();
    expect(getByText('Entrar')).toBeTruthy();
    expect(getByText('Esqueceu a senha?')).toBeTruthy();
  });

  test('Deve exibir mensagens de erro quando tentar fazer login com campos vazios', () => {
    // Arrange
    const { getByText, queryByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    
    // Act
    fireEvent.press(getByText('Entrar'));
    
    // Assert
    expect(queryByText('Por favor, informe seu e-mail')).toBeTruthy();
    expect(queryByText('Por favor, informe sua senha')).toBeTruthy();
  });

  test('Deve exibir erro quando o formato de email for inválido', () => {
    // Arrange
    const { getByText, getByPlaceholderText, queryByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    
    // Act
    fireEvent.changeText(getByPlaceholderText('Digite seu email'), 'email_invalido');
    fireEvent.changeText(getByPlaceholderText('Digite sua senha'), 'senha123');
    fireEvent.press(getByText('Entrar'));
    
    // Assert
    expect(queryByText('Por favor, insira um e-mail válido')).toBeTruthy();
  });

  test('Deve chamar a API com os dados corretos ao fazer login', async () => {
    // Arrange
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    
    const testEmail = 'test@example.com';
    const testPassword = 'senha123';
    
    // Act
    fireEvent.changeText(getByPlaceholderText('Digite seu email'), testEmail);
    fireEvent.changeText(getByPlaceholderText('Digite sua senha'), testPassword);
    
    // Mock da resposta da API
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: {
            token: 'token-test',
            user_type: 'passageiro',
            reset_password: false
          }
        })
      })
    );
    
    fireEvent.press(getByText('Entrar'));
    
    // Assert
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_IGO}/auth/login`,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: testEmail, password: testPassword })
        })
      );
    });
  });

  test('Deve armazenar o token e navegar para a tela principal do passageiro após login bem-sucedido', async () => {
    // Arrange
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    
    const testEmail = 'test@example.com';
    const testPassword = 'senha123';
    const testToken = 'token-test-123';
    const testUserData = {
      token: testToken,
      user_type: 'passageiro',
      reset_password: false
    };
    
    // Act
    fireEvent.changeText(getByPlaceholderText('Digite seu email'), testEmail);
    fireEvent.changeText(getByPlaceholderText('Digite sua senha'), testPassword);
    
    // Mock da resposta da API
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: testUserData
        })
      })
    );
    
    fireEvent.press(getByText('Entrar'));
    
    // Assert
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('userToken', testToken);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'userData',
        JSON.stringify({
          ...testUserData,
          email: testEmail
        })
      );
      expect(mockNavigation.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'PassengerHomeScreen' }]
      });
    });
  });

  test('Deve armazenar o token e navegar para a tela principal do motorista após login bem-sucedido', async () => {
    // Arrange
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    
    const testEmail = 'motorista@example.com';
    const testPassword = 'senha123';
    const testToken = 'token-test-123';
    const testUserData = {
      token: testToken,
      user_type: 'motorista',
      reset_password: false
    };
    
    // Act
    fireEvent.changeText(getByPlaceholderText('Digite seu email'), testEmail);
    fireEvent.changeText(getByPlaceholderText('Digite sua senha'), testPassword);
    
    // Mock da resposta da API
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: testUserData
        })
      })
    );
    
    fireEvent.press(getByText('Entrar'));
    
    // Assert
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('userToken', testToken);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'userData',
        JSON.stringify({
          ...testUserData,
          email: testEmail
        })
      );
      expect(mockNavigation.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'DriverHomeScreen' }]
      });
    });
  });

  test('Deve navegar para a tela de primeiro login quando reset_password for true', async () => {
    // Arrange
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    
    const testEmail = 'reset@example.com';
    const testPassword = 'senha123';
    const testToken = 'token-test-123';
    const testUserData = {
      token: testToken,
      user_type: 'passageiro',
      reset_password: true
    };
    
    // Act
    fireEvent.changeText(getByPlaceholderText('Digite seu email'), testEmail);
    fireEvent.changeText(getByPlaceholderText('Digite sua senha'), testPassword);
    
    // Mock da resposta da API
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: testUserData
        })
      })
    );
    
    fireEvent.press(getByText('Entrar'));
    
    // Assert
    await waitFor(() => {
      expect(mockNavigation.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'FirstLogin' }]
      });
    });
  });

  test('Deve exibir alerta quando a resposta da API é de erro', async () => {
    // Arrange
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    
    const testEmail = 'error@example.com';
    const testPassword = 'senha123';
    
    // Act
    fireEvent.changeText(getByPlaceholderText('Digite seu email'), testEmail);
    fireEvent.changeText(getByPlaceholderText('Digite sua senha'), testPassword);
    
    // Mock da resposta da API com erro
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({
          success: false,
          message: 'Credenciais inválidas'
        })
      })
    );
    
    fireEvent.press(getByText('Entrar'));
    
    // Assert
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Erro de Login',
        'Credenciais inválidas'
      );
    });
  });

  test('Deve exibir alerta quando ocorrer um erro na chamada da API', async () => {
    // Arrange
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    
    const testEmail = 'network@example.com';
    const testPassword = 'senha123';
    
    // Act
    fireEvent.changeText(getByPlaceholderText('Digite seu email'), testEmail);
    fireEvent.changeText(getByPlaceholderText('Digite sua senha'), testPassword);
    
    // Mock da resposta da API com erro de rede
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Erro de rede')));
    
    fireEvent.press(getByText('Entrar'));
    
    // Assert
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Erro',
        'Ocorreu um erro durante o login. Por favor, tente novamente.'
      );
    });
  });

  test('Deve alternar a visibilidade da senha ao clicar no botão', () => {
    // Arrange
    const { getByPlaceholderText, getByTestId } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    
    const passwordInput = getByPlaceholderText('Digite sua senha');
    
    // O componente ToggleVisibility deve ter um testID para ser localizado
    // Vamos assumir que ele tenha um testID "toggle-visibility-button"
    const toggleButton = getByTestId('toggle-visibility-button');
    
    // Act & Assert
    // Inicialmente a senha deve estar oculta
    expect(passwordInput.props.secureTextEntry).toBe(true);
    
    // Ao clicar no botão, a senha deve ficar visível
    fireEvent.press(toggleButton);
    expect(passwordInput.props.secureTextEntry).toBe(false);
    
    // Ao clicar novamente, a senha deve voltar a ficar oculta
    fireEvent.press(toggleButton);
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  test('Deve navegar para a tela de recuperação de senha ao clicar em "Esqueceu a senha?"', () => {
    // Arrange
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    
    // Act
    fireEvent.press(getByText('Esqueceu a senha?'));
    
    // Assert
    expect(mockNavigation.navigate).toHaveBeenCalledWith('ForgotPassword');
  });
});