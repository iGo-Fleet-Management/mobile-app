import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ForgotPasswordScreen from '../ForgotPassword';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('ForgotPasswordScreen', () => {
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<ForgotPasswordScreen navigation={mockNavigation} />);
    
    expect(getByText('Esqueci minha senha')).toBeTruthy();
    expect(getByText('Digite seu e-mail e enviaremos um código de verificação.')).toBeTruthy();
    expect(getByPlaceholderText('E-mail')).toBeTruthy();
  });

  it('shows error for empty email', () => {
    const { getByText } = render(<ForgotPasswordScreen navigation={mockNavigation} />);
    const sendCodeButton = getByText('Enviar Código');

    fireEvent.press(sendCodeButton);

    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Por favor, insira seu e-mail.');
  });

  it('validates email format', () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPasswordScreen navigation={mockNavigation} />);
    const emailInput = getByPlaceholderText('E-mail');
    const sendCodeButton = getByText('Enviar Código');

    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.press(sendCodeButton);

    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Por favor, insira um e-mail válido!');
  });

  it('navigates to reset password on valid email', () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPasswordScreen navigation={mockNavigation} />);
    const emailInput = getByPlaceholderText('E-mail');
    const sendCodeButton = getByText('Enviar Código');

    fireEvent.changeText(emailInput, 'valid@example.com');
    fireEvent.press(sendCodeButton);

    expect(Alert.alert).toHaveBeenCalledWith('Sucesso', 'Código de recuperação enviado para o e-mail.');
    expect(mockNavigation.navigate).toHaveBeenCalledWith('ResetPassword');
  });

  it('navigates back to previous screen', () => {
    const { getByText } = render(<ForgotPasswordScreen navigation={mockNavigation} />);
    const backLink = getByText('Voltar para o login');

    fireEvent.press(backLink);

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});