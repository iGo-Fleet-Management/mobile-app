import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import SignUpScreen from '../SignUpScreen';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
};

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('SignUpScreen', () => {
  const fillOutForm = (renderResult) => {
    const { getByPlaceholderText } = renderResult;
    fireEvent.changeText(getByPlaceholderText('Nome'), 'John');
    fireEvent.changeText(getByPlaceholderText('Sobrenome'), 'Doe');
    fireEvent.changeText(getByPlaceholderText('E-mail'), 'john.doe@example.com');
    fireEvent.changeText(getByPlaceholderText('Telefone'), '(11) 98765-4321');
    fireEvent.changeText(getByPlaceholderText('CPF'), '123.456.789-10');
    fireEvent.changeText(getByPlaceholderText('Data de Nascimento'), '01/01/1990');
  };

  it('renders all input fields', () => {
    const { getByPlaceholderText } = render(<SignUpScreen navigation={mockNavigation} />);
    
    expect(getByPlaceholderText('Nome')).toBeTruthy();
    expect(getByPlaceholderText('Sobrenome')).toBeTruthy();
    expect(getByPlaceholderText('E-mail')).toBeTruthy();
    expect(getByPlaceholderText('Telefone')).toBeTruthy();
    expect(getByPlaceholderText('CPF')).toBeTruthy();
    expect(getByPlaceholderText('Data de Nascimento')).toBeTruthy();
  });

  it('shows error when all fields are not filled', () => {
    const { getByText } = render(<SignUpScreen navigation={mockNavigation} />);
    const createAccountButton = getByText('Criar Conta');

    fireEvent.press(createAccountButton);

    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Todos os campos são obrigatórios!');
  });

  it('validates email format', () => {
    const renderResult = render(<SignUpScreen navigation={mockNavigation} />);
    const { getByPlaceholderText, getByText } = renderResult;
    
    fillOutForm(renderResult);
    fireEvent.changeText(getByPlaceholderText('E-mail'), 'invalid-email');
    fireEvent.press(getByText('Criar Conta'));

    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Por favor, insira um e-mail válido!');
  });

  it('validates phone number', () => {
    const renderResult = render(<SignUpScreen navigation={mockNavigation} />);
    const { getByPlaceholderText, getByText } = renderResult;
    
    fillOutForm(renderResult);
    fireEvent.changeText(getByPlaceholderText('Telefone'), '123');
    fireEvent.press(getByText('Criar Conta'));

    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Número de telefone inválido! Use o formato (11) 98765-4321.');
  });

  it('validates CPF format', () => {
    const renderResult = render(<SignUpScreen navigation={mockNavigation} />);
    const { getByPlaceholderText, getByText } = renderResult;
    
    fillOutForm(renderResult);
    fireEvent.changeText(getByPlaceholderText('CPF'), '123');
    fireEvent.press(getByText('Criar Conta'));

    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'CPF inválido! O formato correto é XXX.XXX.XXX-XX.');
  });

  it('validates date of birth format', () => {
    const renderResult = render(<SignUpScreen navigation={mockNavigation} />);
    const { getByPlaceholderText, getByText } = renderResult;
    
    fillOutForm(renderResult);
    fireEvent.changeText(getByPlaceholderText('Data de Nascimento'), '123');
    fireEvent.press(getByText('Criar Conta'));

    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Data de nascimento inválida! Use o formato DD/MM/AAAA.');
  });

  it('navigates to dashboard on successful signup', () => {
    const renderResult = render(<SignUpScreen navigation={mockNavigation} />);
    const { getByPlaceholderText, getByText } = renderResult;
    
    fillOutForm(renderResult);
    fireEvent.press(getByText('Criar Conta'));

    expect(Alert.alert).toHaveBeenCalledWith('Sucesso', 'Cadastro realizado com sucesso!');
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Dashboard');
  });
});