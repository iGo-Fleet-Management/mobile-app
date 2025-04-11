import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignUpScreen from '../SignUpScreen';
import { Alert } from 'react-native';

// Mock da navegação
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

// Mock das funções de formatação para testar seus comportamentos
jest.mock('../SignUpScreen', () => {
  const originalModule = jest.requireActual('../SignUpScreen');
  return {
    __esModule: true,
    default: originalModule.default,
    formatCPF: jest.fn((value) => {
      value = value.replace(/\D/g, "");
      value = value.replace(/^(\d{3})(\d)/, "$1.$2");
      value = value.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
      value = value.replace(/\.(\d{3})(\d)/, ".$1-$2");
      return value.substring(0, 14);
    }),
    formatDate: jest.fn((value) => {
      value = value.replace(/\D/g, "");
      value = value.replace(/^(\d{2})(\d)/, "$1/$2");
      value = value.replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
      return value.substring(0, 10);
    }),
    formatPhone: jest.fn((value) => {
      value = value.replace(/\D/g, "");
      if (value.startsWith("55") && value.length > 2) {
        value = "+" + value;
      }
      if (value.length <= 10) {
        value = value.replace(/^(\d{2})(\d)/, "($1) $2");
        value = value.replace(/(\d{4})(\d)/, "$1-$2");
      } else {
        value = value.replace(/^(\d{2})(\d)/, "($1) $2");
        value = value.replace(/(\d{5})(\d)/, "$1-$2");
      }
      return value.substring(0, 16);
    }),
  };
});

describe('SignUpScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <SignUpScreen navigation={mockNavigation} />
    );

    expect(getByText('Complete as informações para criar sua conta')).toBeTruthy();
    expect(getByPlaceholderText('Nome')).toBeTruthy();
    expect(getByPlaceholderText('Sobrenome')).toBeTruthy();
    expect(getByPlaceholderText('E-mail')).toBeTruthy();
    expect(getByPlaceholderText('Telefone')).toBeTruthy();
    expect(getByPlaceholderText('CPF')).toBeTruthy();
    expect(getByPlaceholderText('Data de Nascimento')).toBeTruthy();
    expect(getByText('Criar Conta')).toBeTruthy();
    expect(getByText('Voltar para o login')).toBeTruthy();
  });

  it('shows error when fields are empty', async () => {
    const { getByText } = render(
      <SignUpScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByText('Criar Conta'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Todos os campos são obrigatórios!');
    });
  });

  it('validates email format', async () => {
    const { getByText, getByPlaceholderText } = render(
      <SignUpScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Nome'), 'John');
    fireEvent.changeText(getByPlaceholderText('Sobrenome'), 'Doe');
    fireEvent.changeText(getByPlaceholderText('E-mail'), 'invalid-email');
    fireEvent.changeText(getByPlaceholderText('Telefone'), '(11) 98765-4321');
    fireEvent.changeText(getByPlaceholderText('CPF'), '123.456.789-09');
    fireEvent.changeText(getByPlaceholderText('Data de Nascimento'), '01/01/1990');

    fireEvent.press(getByText('Criar Conta'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Por favor, insira um e-mail válido!');
    });
  });

  it('validates phone format', async () => {
    const { getByText, getByPlaceholderText } = render(
      <SignUpScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Nome'), 'John');
    fireEvent.changeText(getByPlaceholderText('Sobrenome'), 'Doe');
    fireEvent.changeText(getByPlaceholderText('E-mail'), 'valid@email.com');
    fireEvent.changeText(getByPlaceholderText('Telefone'), '(11) 9876');
    fireEvent.changeText(getByPlaceholderText('CPF'), '123.456.789-09');
    fireEvent.changeText(getByPlaceholderText('Data de Nascimento'), '01/01/1990');

    fireEvent.press(getByText('Criar Conta'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Erro',
        'Número de telefone inválido! Use o formato (11) 98765-4321.'
      );
    });
  });

  it('validates CPF format', async () => {
    const { getByText, getByPlaceholderText } = render(
      <SignUpScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Nome'), 'John');
    fireEvent.changeText(getByPlaceholderText('Sobrenome'), 'Doe');
    fireEvent.changeText(getByPlaceholderText('E-mail'), 'valid@email.com');
    fireEvent.changeText(getByPlaceholderText('Telefone'), '(11) 98765-4321');
    fireEvent.changeText(getByPlaceholderText('CPF'), '123.456.789');
    fireEvent.changeText(getByPlaceholderText('Data de Nascimento'), '01/01/1990');

    fireEvent.press(getByText('Criar Conta'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Erro',
        'CPF inválido! O formato correto é XXX.XXX.XXX-XX.'
      );
    });
  });

  it('validates date format', async () => {
    const { getByText, getByPlaceholderText } = render(
      <SignUpScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Nome'), 'John');
    fireEvent.changeText(getByPlaceholderText('Sobrenome'), 'Doe');
    fireEvent.changeText(getByPlaceholderText('E-mail'), 'valid@email.com');
    fireEvent.changeText(getByPlaceholderText('Telefone'), '(11) 98765-4321');
    fireEvent.changeText(getByPlaceholderText('CPF'), '123.456.789-09');
    fireEvent.changeText(getByPlaceholderText('Data de Nascimento'), '01/01');

    fireEvent.press(getByText('Criar Conta'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Erro',
        'Data de nascimento inválida! Use o formato DD/MM/AAAA.'
      );
    });
  });

  it('navigates to Dashboard on successful signup', async () => {
    const { getByText, getByPlaceholderText } = render(
      <SignUpScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Nome'), 'John');
    fireEvent.changeText(getByPlaceholderText('Sobrenome'), 'Doe');
    fireEvent.changeText(getByPlaceholderText('E-mail'), 'valid@email.com');
    fireEvent.changeText(getByPlaceholderText('Telefone'), '(11) 98765-4321');
    fireEvent.changeText(getByPlaceholderText('CPF'), '123.456.789-09');
    fireEvent.changeText(getByPlaceholderText('Data de Nascimento'), '01/01/1990');

    fireEvent.press(getByText('Criar Conta'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Sucesso', 'Cadastro realizado com sucesso!');
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Dashboard');
    });
  });

  it('formats CPF input correctly', () => {
    const { getByPlaceholderText } = render(
      <SignUpScreen navigation={mockNavigation} />
    );

    const cpfInput = getByPlaceholderText('CPF');
    fireEvent.changeText(cpfInput, '12345678909');

    expect(cpfInput.props.value).toBe('123.456.789-09');
  });

  it('formats date input correctly', () => {
    const { getByPlaceholderText } = render(
      <SignUpScreen navigation={mockNavigation} />
    );

    const dateInput = getByPlaceholderText('Data de Nascimento');
    fireEvent.changeText(dateInput, '01011990');

    expect(dateInput.props.value).toBe('01/01/1990');
  });

  it('formats phone input correctly', () => {
    const { getByPlaceholderText } = render(
      <SignUpScreen navigation={mockNavigation} />
    );

    const phoneInput = getByPlaceholderText('Telefone');
    fireEvent.changeText(phoneInput, '11987654321');

    expect(phoneInput.props.value).toBe('(11) 98765-4321');
  });

  it('navigates back when back link is pressed', () => {
    const { getByText } = render(
      <SignUpScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByText('Voltar para o login'));

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});