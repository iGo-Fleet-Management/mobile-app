import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import AddPassengerScreen from '../AddPassengerScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_IGO } from '@env';

// Mock das dependências
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
    navigate: jest.fn(),
  }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve('mock-token')),
}));

jest.mock('@env', () => ({
    API_IGO: 'https://api-mocked-url.com',
  }), { virtual: true });

// Mock para MaterialIcons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialIcons: ({ name, ...props }) => <View name={name} {...props} />,
  };
});

// Mock global do fetch
global.fetch = jest.fn();

describe('AddPassengerScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
  });

  // Helper function para encontrar o botão de submit
  const findSubmitButton = () => {
    const buttons = screen.getAllByText('Adicionar Passageiro');
    return buttons[buttons.length - 1]; // Assume que o botão de submit é o último
  };

  // Teste 1: Renderização inicial correta

  // Teste 2: Valida os campos obrigatórios
  test('valida os campos obrigatorios', async () => {
    render(<AddPassengerScreen />);

    fireEvent.press(findSubmitButton());

    await waitFor(() => {
      expect(screen.getByText('Nome é obrigatório')).toBeTruthy();
      expect(screen.getByText('Sobrenome é obrigatório')).toBeTruthy();
      expect(screen.getByText('Email é obrigatório')).toBeTruthy();
      expect(screen.getByText('Senha é obrigatória')).toBeTruthy();
      expect(screen.getByText('Confirme a senha')).toBeTruthy();
    });
  });

  // Teste 3: Valida se as senhas coincidem
  test('valida se as senhas coincidem', async () => {
    render(<AddPassengerScreen />);

    fireEvent.changeText(screen.getByPlaceholderText('Digite a senha'), 'senha123');
    fireEvent.changeText(screen.getByPlaceholderText('Confirme a senha'), 'senha456');
    fireEvent.press(findSubmitButton());

    await waitFor(() => {
      expect(screen.getByText('Senhas não coincidem')).toBeTruthy();
    });
  });

  // Teste 4: Sucesso ao adicionar passageiro
  test('Sucesso ao adicionar passageiro', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    render(<AddPassengerScreen />);

    fireEvent.changeText(screen.getByPlaceholderText('Digite o nome'), 'João');
    fireEvent.changeText(screen.getByPlaceholderText('Digite o sobrenome'), 'Silva');
    fireEvent.changeText(screen.getByPlaceholderText('Digite o email'), 'joao@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Digite a senha'), 'senha123');
    fireEvent.changeText(screen.getByPlaceholderText('Confirme a senha'), 'senha123');
    fireEvent.press(findSubmitButton());

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`${API_IGO}/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token' 
        },
        body: JSON.stringify({
          user_type: 'passenger',
          name: 'João',
          last_name: 'Silva',
          email: 'joao@example.com',
          password: 'senha123',
          reset_password: true,
        }),
      });
    });
  });

  
  // Teste 8: Botões de mostrar/ocultar senha funcionam
  test('Botões de mostrar/ocultar senha funcionam', async () => {
    render(<AddPassengerScreen />);

    const passwordInput = screen.getByPlaceholderText('Digite a senha');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirme a senha');
    
    // Encontrar os ícones de olho
    const eyeIcons = screen.root.findAllByType('View').filter(view => 
      view.props.name === 'visibility' || view.props.name === 'visibility-off'
    );
    
    // Estado inicial (senhas ocultas)
    expect(passwordInput.props.secureTextEntry).toBe(true);
    expect(confirmPasswordInput.props.secureTextEntry).toBe(true);
    
    // Mostrar senha principal
    fireEvent.press(eyeIcons[0]);
    expect(passwordInput.props.secureTextEntry).toBe(false);
    
    // Mostrar confirmação de senha
    fireEvent.press(eyeIcons[1]);
    expect(confirmPasswordInput.props.secureTextEntry).toBe(false);
    
    // Ocultar senha principal
    fireEvent.press(eyeIcons[0]);
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  // Teste 9: Validação de formato de CPF
test('valida o formato do CPF corretamente', async () => {
  render(<AddPassengerScreen />);

  const cpfInput = screen.getByPlaceholderText('Digite o CPF');
  
  // Teste com CPF inválido (formato incorreto)
  fireEvent.changeText(cpfInput, '12345678900');
  fireEvent.press(findSubmitButton());

  await waitFor(() => {
    expect(screen.getByText('CPF inválido')).toBeTruthy();
  });

  // Teste com CPF inválido (dígitos iguais)
  fireEvent.changeText(cpfInput, '111.111.111-11');
  fireEvent.press(findSubmitButton());

  await waitFor(() => {
    expect(screen.getByText('CPF inválido')).toBeTruthy();
  });

  // Teste com CPF válido
  fireEvent.changeText(cpfInput, '529.982.247-25'); // CPF válido (gerado para testes)
  fireEvent.press(findSubmitButton());

  await waitFor(() => {
    expect(screen.queryByText('CPF inválido')).toBeNull();
  });
});
});