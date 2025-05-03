import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ForgotPasswordScreen from '../ForgotPasswordScreen';
import { Alert } from 'react-native';

// Mock do Alert.alert
jest.spyOn(Alert, 'alert').mockImplementation((title, message) => {
  console.log(`${title}: ${message}`);
});

// Mock do expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialIcons: () => <View />,
  };
});

// Mock das funções de navegação
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: mockGoBack
};

describe('ForgotPasswordScreen', () => {
  beforeEach(() => {
    // Limpa todos os mocks antes de cada teste
    jest.clearAllMocks();
  });
  
  test('exibe alerta quando o campo de email está vazio', () => {
    const { getAllByText } = render(<ForgotPasswordScreen navigation={mockNavigation} />);
    
    // Encontra e pressiona o botão de enviar código
    const sendCodeButtons = getAllByText('Enviar Código');
    const sendCodeButton = sendCodeButtons[sendCodeButtons.length - 1];
    fireEvent.press(sendCodeButton);
    
    // Verifica se o Alert.alert foi chamado com a mensagem de erro correta
    expect(Alert.alert).toHaveBeenCalledWith(
      "Erro", 
      "Por favor, insira seu e-mail."
    );
    
    // Verifica que a navegação não foi chamada
    expect(mockNavigate).not.toHaveBeenCalled();
  });
  
  test('exibe alerta quando o email é inválido', () => {
    const { getAllByText, getByPlaceholderText } = render(
      <ForgotPasswordScreen navigation={mockNavigation} />
    );
    
    // Preenche o campo de email com um valor inválido
    const emailInput = getByPlaceholderText('E-mail');
    fireEvent.changeText(emailInput, 'email_invalido');
    
    // Pressiona o botão de enviar código
    const sendCodeButtons = getAllByText('Enviar Código');
    const sendCodeButton = sendCodeButtons[sendCodeButtons.length - 1];
    fireEvent.press(sendCodeButton);
    
    // Verifica se o Alert.alert foi chamado com a mensagem de erro correta
    expect(Alert.alert).toHaveBeenCalledWith(
      "Erro", 
      "Por favor, insira um e-mail válido!"
    );
    
    // Verifica que a navegação não foi chamada
    expect(mockNavigate).not.toHaveBeenCalled();
  });
  
  test('navega para a tela de redefinição de senha quando o email é válido', () => {
    const { getAllByText, getByPlaceholderText } = render(
      <ForgotPasswordScreen navigation={mockNavigation} />
    );
    
    // Preenche o campo de email com um valor válido
    const emailInput = getByPlaceholderText('E-mail');
    fireEvent.changeText(emailInput, 'usuario@exemplo.com');
    
    // Pressiona o botão de enviar código
    const sendCodeButtons = getAllByText('Enviar Código');
    const sendCodeButton = sendCodeButtons[sendCodeButtons.length - 1];
    fireEvent.press(sendCodeButton);
    
    // Verifica se o Alert.alert foi chamado com a mensagem de sucesso
    expect(Alert.alert).toHaveBeenCalledWith(
      "Sucesso", 
      "Código de recuperação enviado para o e-mail."
    );
    
    // Verifica se navega para a tela de redefinição de senha
    expect(mockNavigate).toHaveBeenCalledWith('ResetPassword');
  });
  
  test('remove espaços em branco do email', () => {
    const { getAllByText, getByPlaceholderText } = render(
      <ForgotPasswordScreen navigation={mockNavigation} />
    );
    
    // Preenche o campo de email com espaços extras
    const emailInput = getByPlaceholderText('E-mail');
    fireEvent.changeText(emailInput, '  usuario@exemplo.com  ');
    
    // Pressiona o botão de enviar código
    const sendCodeButtons = getAllByText('Enviar Código');
    const sendCodeButton = sendCodeButtons[sendCodeButtons.length - 1];
    fireEvent.press(sendCodeButton);
    
    // Verifica se o Alert.alert foi chamado com a mensagem de sucesso
    expect(Alert.alert).toHaveBeenCalledWith(
      "Sucesso", 
      "Código de recuperação enviado para o e-mail."
    );
    
    // Verifica se o email teve os espaços removidos
    expect(emailInput.props.value).toBe('usuario@exemplo.com');
  });
  
  test('botão de voltar chama a função navigation.goBack', () => {
    const { getAllByText } = render(
      <ForgotPasswordScreen navigation={mockNavigation} />
    );
    
    // Encontra e pressiona o link "Voltar para o login"
    const backLinks = getAllByText('Voltar para o login');
    const backLink = backLinks[backLinks.length - 1];
    fireEvent.press(backLink);
    
    // Verifica que a função goBack foi chamada
    expect(mockGoBack).toHaveBeenCalled();
  });
});