import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import LoginScreen from '../LoginScreen';

// Mock do Alert.alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Mock do módulo de navegação
const mockNavigation = {
  navigate: jest.fn(),
};

describe('LoginScreen', () => {
  beforeEach(() => {
    // Limpa os mocks entre os testes
    jest.clearAllMocks();
  });

  it('renderiza corretamente', () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    // Verifica se os elementos principais estão presentes
    expect(getByPlaceholderText('E-mail')).toBeTruthy();
    expect(getByPlaceholderText('Senha')).toBeTruthy();
    expect(getByText('Entrar')).toBeTruthy();
    expect(getByText('Esqueceu a senha?')).toBeTruthy();
  
  });

  it('mostra alerta quando campos estão vazios', () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    // Tenta fazer login sem preencher os campos
    fireEvent.press(getByText('Entrar'));

    // Verifica se o Alert.alert foi chamado com a mensagem correta
    expect(Alert.alert).toHaveBeenCalledWith(
      'Erro',
      'Todos os campos são obrigatórios!'
    );
  });

  it('valida formato de e-mail', () => {
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    // Preenche com e-mail inválido e senha
    fireEvent.changeText(getByPlaceholderText('E-mail'), 'email-invalido');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'senha123');
    
    // Tenta fazer login
    fireEvent.press(getByText('Entrar'));

    // Verifica se o Alert.alert foi chamado com a mensagem de erro de e-mail
    expect(Alert.alert).toHaveBeenCalledWith(
      'Erro',
      'Por favor, insira um e-mail válido!'
    );
  });

  it('navega para PassengerHomeScreen quando login de passageiro é bem-sucedido', () => {
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    // Preenche com e-mail e senha de passageiro
    fireEvent.changeText(getByPlaceholderText('E-mail'), 'passenger@gmail.com');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'senha123');
    
    // Faz login
    fireEvent.press(getByText('Entrar'));

    // Verifica se a navegação foi chamada com a tela correta
    expect(mockNavigation.navigate).toHaveBeenCalledWith('PassengerHomeScreen');
  });

  it('navega para DriverHomeScreen quando login de motorista é bem-sucedido', () => {
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    // Preenche com e-mail e senha de motorista
    fireEvent.changeText(getByPlaceholderText('E-mail'), 'driver@gmail.com');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'senha123');
    
    // Faz login
    fireEvent.press(getByText('Entrar'));

    // Verifica se a navegação foi chamada com a tela correta
    expect(mockNavigation.navigate).toHaveBeenCalledWith('DriverHomeScreen');
  });


  it('navega para a tela de esqueceu a senha quando o link é pressionado', () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    // Pressiona o link de esqueceu a senha
    fireEvent.press(getByText('Esqueceu a senha?'));

    // Verifica se a navegação foi chamada com a tela correta
    expect(mockNavigation.navigate).toHaveBeenCalledWith('ForgotPassword');
  });
});