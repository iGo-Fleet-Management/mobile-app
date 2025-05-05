import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import FirstLoginScreen from '../FirstLoginScreen';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock das dependências externas
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialIcons: () => <View />,
  };
});

// Mock do API_IGO (variável de ambiente)
jest.mock('@env', () => ({
    API_IGO: 'https://api-mocked-url.com',
  }), { virtual: true });

// Mock do fetch global
global.fetch = jest.fn();

// Mock das funções de navegação
const mockNavigate = jest.fn();

// Mock do Alert.alert
jest.spyOn(Alert, 'alert').mockImplementation((title, message) => {
  console.log(`${title}: ${message}`);
});

describe('FirstLoginScreen', () => {
  beforeEach(() => {
    // Limpa todos os mocks antes de cada teste
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue('fake-token');
    
    // Mock do fetch para retornar um resultado bem-sucedido por padrão
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: {
          token: 'new-fake-token'
        }
      })
    });
  });


  test('Valida Campos Obrigatórios', () => {
    const { getByText, getAllByText, getByPlaceholderText } = render(<FirstLoginScreen />);
    
    // Preenche apenas um campo
    const passwordInput = getByPlaceholderText('Digite sua nova senha');
    fireEvent.changeText(passwordInput, 'Password123');
    
    // Pressiona o botão sem preencher o outro campo
    const changePasswordButtons = getAllByText('Alterar Senha');
    const changePasswordButton = changePasswordButtons[changePasswordButtons.length - 1];
    fireEvent.press(changePasswordButton);
    
    // Verifica se a mensagem de erro para o campo de confirmação aparece
    const confirmPasswordError = getByText('Confirme sua senha');
    expect(confirmPasswordError).toBeTruthy();
    
    // Verifica que a navegação não foi chamada
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('valida Formato de Senha', () => {
    const { getByText, getAllByText, getByPlaceholderText } = render(<FirstLoginScreen />);
    
    // Testa senha muito curta
    const passwordInput = getByPlaceholderText('Digite sua nova senha');
    const confirmPasswordInput = getByPlaceholderText('Confirme sua nova senha');
    
    // Testa senha sem letras maiúsculas
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password123');
    
    // Pressiona o botão
    const changePasswordButtons = getAllByText('Alterar Senha');
    const changePasswordButton = changePasswordButtons[changePasswordButtons.length - 1];
    fireEvent.press(changePasswordButton);
    
    // Verifica se a mensagem de erro sobre letras maiúsculas aparece
    const passwordError = getByText('Senha deve conter letras maiúsculas');
    expect(passwordError).toBeTruthy();
    
    // Limpa campos e testa senha sem números
    fireEvent.changeText(passwordInput, 'Password');
    fireEvent.changeText(confirmPasswordInput, 'Password');
    fireEvent.press(changePasswordButton);
    
    // Verifica se a mensagem de erro sobre números aparece
    const numberError = getByText('Senha deve conter números');
    expect(numberError).toBeTruthy();
    
    // Limpa campos e testa senha sem letras minúsculas
    fireEvent.changeText(passwordInput, 'PASSWORD123');
    fireEvent.changeText(confirmPasswordInput, 'PASSWORD123');
    fireEvent.press(changePasswordButton);
    
    // Verifica se a mensagem de erro sobre letras minúsculas aparece
    const lowercaseError = getByText('Senha deve conter letras minúsculas');
    expect(lowercaseError).toBeTruthy();
    
    // Verifica que a navegação não foi chamada em nenhuma tentativa
    expect(mockNavigate).not.toHaveBeenCalled();
  });


  test('navega para o painel após a inscrição bem-sucedida', async () => {
    const { getAllByText, getByPlaceholderText } = render(<FirstLoginScreen />);
    
    // Preenche os campos corretamente
    const passwordInput = getByPlaceholderText('Digite sua nova senha');
    const confirmPasswordInput = getByPlaceholderText('Confirme sua nova senha');
    
    fireEvent.changeText(passwordInput, 'Password123');
    fireEvent.changeText(confirmPasswordInput, 'Password123');
    
    // Pressiona o botão
    const changePasswordButtons = getAllByText('Alterar Senha');
    const changePasswordButton = changePasswordButtons[changePasswordButtons.length - 1];
    fireEvent.press(changePasswordButton);
    
    // Verifica que a navegação foi chamada para a tela correta
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('FirstLoginPersonalInfo');
    });
    
    // Verifica que o AsyncStorage foi atualizado corretamente
    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('userToken');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('userData');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('userToken', 'new-fake-token');
    });
  });

  test('mostra erro quando a API falha', async () => {
    // Configura o mock do fetch para simular uma falha na API
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });
    
    const { getAllByText, getByPlaceholderText } = render(<FirstLoginScreen />);
    
    // Preenche os campos corretamente
    const passwordInput = getByPlaceholderText('Digite sua nova senha');
    const confirmPasswordInput = getByPlaceholderText('Confirme sua nova senha');
    
    fireEvent.changeText(passwordInput, 'Password123');
    fireEvent.changeText(confirmPasswordInput, 'Password123');
    
    // Pressiona o botão
    const changePasswordButtons = getAllByText('Alterar Senha');
    const changePasswordButton = changePasswordButtons[changePasswordButtons.length - 1];
    fireEvent.press(changePasswordButton);
    
    // Verifica que o alerta de erro foi exibido
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Erro',
        'Não foi possível alterar sua senha. Por favor, tente novamente.'
      );
    });
    
    // Verifica que a navegação não foi chamada
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('valida se as senhas não coincidem', () => {
    const { getByText, getAllByText, getByPlaceholderText } = render(<FirstLoginScreen />);
    
    // Preenche os campos com senhas diferentes
    const passwordInput = getByPlaceholderText('Digite sua nova senha');
    const confirmPasswordInput = getByPlaceholderText('Confirme sua nova senha');
    
    fireEvent.changeText(passwordInput, 'Password123');
    fireEvent.changeText(confirmPasswordInput, 'DifferentPassword123');
    
    // Pressiona o botão
    const changePasswordButtons = getAllByText('Alterar Senha');
    const changePasswordButton = changePasswordButtons[changePasswordButtons.length - 1];
    fireEvent.press(changePasswordButton);
    
    // Verifica se a mensagem de erro de senhas diferentes aparece
    const passwordMismatchError = getByText('As senhas não coincidem');
    expect(passwordMismatchError).toBeTruthy();
    
    // Verifica que a navegação não foi chamada
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});