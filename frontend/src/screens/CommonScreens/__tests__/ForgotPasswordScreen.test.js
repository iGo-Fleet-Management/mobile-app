import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ForgotPasswordScreen from '../ForgotPasswordScreen'; // Ajuste o caminho conforme necessário

// Mock do React Navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn()
};

// Mock do console.log para evitar poluição nos logs de teste
jest.spyOn(console, 'log').mockImplementation(() => {});

// Mock do Alert.alert
jest.spyOn(Alert, 'alert').mockImplementation((title, message) => jest.fn());

describe('ForgotPasswordScreen', () => {
  beforeEach(() => {
    // Limpar todos os mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('renderiza corretamente', () => {
    const { getByText, getByPlaceholderText } = render(
      <ForgotPasswordScreen navigation={mockNavigation} />
    );

    // Verificar elementos da interface
    expect(getByText('Esqueci minha senha')).toBeTruthy();
    expect(getByText('Digite seu e-mail e enviaremos um código de verificação.')).toBeTruthy();
    expect(getByPlaceholderText('E-mail')).toBeTruthy();
    expect(getByText('Enviar Código')).toBeTruthy();
    expect(getByText('Voltar para o login')).toBeTruthy();
  });

  it('exibe alerta quando o campo de e-mail está vazio', () => {
    const { getByText } = render(
      <ForgotPasswordScreen navigation={mockNavigation} />
    );

    // Clicar no botão sem preencher o e-mail
    fireEvent.press(getByText('Enviar Código'));

    // Verificar se o alerta foi exibido corretamente
    expect(Alert.alert).toHaveBeenCalledWith(
      'Erro',
      'Por favor, insira seu e-mail.'
    );
    
    // Verificar que o navigation.navigate não foi chamado
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it('exibe alerta quando o e-mail é inválido', () => {
    const { getByText, getByPlaceholderText } = render(
      <ForgotPasswordScreen navigation={mockNavigation} />
    );

    // Preencher o campo com um e-mail inválido
    fireEvent.changeText(getByPlaceholderText('E-mail'), 'email-invalido');

    // Clicar no botão de enviar código
    fireEvent.press(getByText('Enviar Código'));

    // Verificar se o alerta foi exibido corretamente
    expect(Alert.alert).toHaveBeenCalledWith(
      'Erro',
      'Por favor, insira um e-mail válido!'
    );
    
    // Verificar que o navigation.navigate não foi chamado
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it('exibe mensagem de sucesso e navega para a tela de reset quando o e-mail é válido', () => {
    const { getByText, getByPlaceholderText } = render(
      <ForgotPasswordScreen navigation={mockNavigation} />
    );

    // Preencher o campo com um e-mail válido
    fireEvent.changeText(getByPlaceholderText('E-mail'), 'usuario@dominio.com');

    // Clicar no botão de enviar código
    fireEvent.press(getByText('Enviar Código'));

    // Verificar se o alerta de sucesso foi exibido
    expect(Alert.alert).toHaveBeenCalledWith(
      'Sucesso',
      'Código de recuperação enviado para o e-mail.'
    );
    
    // Verificar se a navegação para a tela de ResetPassword ocorreu
    expect(mockNavigation.navigate).toHaveBeenCalledWith('ResetPassword');
  });
  
  it('atualiza o estado de e-mail quando o campo é preenchido', () => {
    const { getByPlaceholderText } = render(
      <ForgotPasswordScreen navigation={mockNavigation} />
    );

    const emailInput = getByPlaceholderText('E-mail');

    // Testar entrada de dados no campo de e-mail
    fireEvent.changeText(emailInput, 'usuario@dominio.com');

    // Verificar se o valor foi atualizado
    expect(emailInput.props.value).toBe('usuario@dominio.com');
  });

  it('navega de volta para a tela anterior ao clicar em Voltar para o login', () => {
    const { getByText } = render(
      <ForgotPasswordScreen navigation={mockNavigation} />
    );

    // Clicar no link de voltar
    fireEvent.press(getByText('Voltar para o login'));

    // Verificar se a função goBack foi chamada
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('remove espaços em branco do e-mail digitado', () => {
    const { getByPlaceholderText } = render(
      <ForgotPasswordScreen navigation={mockNavigation} />
    );

    const emailInput = getByPlaceholderText('E-mail');

    // Testar entrada de dados com espaços
    fireEvent.changeText(emailInput, '  usuario@dominio.com  ');

    // Verificar se os espaços foram removidos
    expect(emailInput.props.value).toBe('usuario@dominio.com');
  });

  it('valida diferentes formatos de e-mail corretamente', () => {
    const { getByText, getByPlaceholderText } = render(
      <ForgotPasswordScreen navigation={mockNavigation} />
    );

    const emailInput = getByPlaceholderText('E-mail');
    const sendButton = getByText('Enviar Código');

    // Testar e-mail simples (válido)
    fireEvent.changeText(emailInput, 'usuario@dominio.com');
    fireEvent.press(sendButton);
    expect(Alert.alert).toHaveBeenCalledWith('Sucesso', expect.any(String));
    jest.clearAllMocks();

    // Testar e-mail com subdomínio (válido)
    fireEvent.changeText(emailInput, 'usuario@sub.dominio.com');
    fireEvent.press(sendButton);
    expect(Alert.alert).toHaveBeenCalledWith('Sucesso', expect.any(String));
    jest.clearAllMocks();

    // Testar e-mail com caracteres especiais (válido)
    fireEvent.changeText(emailInput, 'usuario.nome+tag@dominio.com');
    fireEvent.press(sendButton);
    expect(Alert.alert).toHaveBeenCalledWith('Sucesso', expect.any(String));
    jest.clearAllMocks();

    // Testar e-mail sem @ (inválido)
    fireEvent.changeText(emailInput, 'usuariodominio.com');
    fireEvent.press(sendButton);
    expect(Alert.alert).toHaveBeenCalledWith('Erro', expect.any(String));
    jest.clearAllMocks();

    // Testar e-mail sem domínio (inválido)
    fireEvent.changeText(emailInput, 'usuario@');
    fireEvent.press(sendButton);
    expect(Alert.alert).toHaveBeenCalledWith('Erro', expect.any(String));
  });
});