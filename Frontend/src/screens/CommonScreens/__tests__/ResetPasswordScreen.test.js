import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ResetPasswordScreen from '../ResetPasswordScreen'; // Ajuste o caminho conforme necessário

// Mock do React Navigation
const mockNavigation = {
  navigate: jest.fn(),
};

// Mock do Alert.alert
jest.spyOn(Alert, 'alert').mockImplementation((title, message) => jest.fn());

describe('ResetPasswordScreen', () => {
  beforeEach(() => {
    // Limpar todos os mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('renderiza corretamente', () => {
    const { getByText, getByPlaceholderText, queryAllByText } = render(
      <ResetPasswordScreen navigation={mockNavigation} />
    );

    // Verificar se o texto do subtítulo está presente (esse é único)
    expect(getByText('Digite o código de verificação e crie uma nova senha.')).toBeTruthy();
    
    // Verificar os inputs pelos placeholders
    expect(getByPlaceholderText('Código de Verificação')).toBeTruthy();
    expect(getByPlaceholderText('Nova Senha')).toBeTruthy();
    expect(getByPlaceholderText('Confirmar Nova Senha')).toBeTruthy();
    
    // Verificar se há pelo menos um elemento com o texto "Redefinir Senha"
    const titleElements = queryAllByText('Redefinir Senha');
    expect(titleElements.length).toBeGreaterThan(0);
  });

  it('exibe alerta quando os campos estão vazios', () => {
    const { queryAllByText } = render(
      <ResetPasswordScreen navigation={mockNavigation} />
    );

    // Encontrar botão através de todos os elementos com o texto "Redefinir Senha"
    // e pegar o último elemento (que provavelmente é o botão)
    const resetButtons = queryAllByText('Redefinir Senha');
    const buttonElement = resetButtons[resetButtons.length - 1];
    
    // Clicar no botão sem preencher os campos
    fireEvent.press(buttonElement);

    // Verificar se o alerta foi exibido corretamente
    expect(Alert.alert).toHaveBeenCalledWith(
      'Erro',
      'Todos os campos são obrigatórios!'
    );
    
    // Verificar que o navigation.navigate não foi chamado
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it('exibe alerta quando as senhas não coincidem', () => {
    const { queryAllByText, getByPlaceholderText } = render(
      <ResetPasswordScreen navigation={mockNavigation} />
    );

    // Preencher os campos com valores diferentes para as senhas
    fireEvent.changeText(getByPlaceholderText('Código de Verificação'), '123456');
    fireEvent.changeText(getByPlaceholderText('Nova Senha'), 'senha123');
    fireEvent.changeText(getByPlaceholderText('Confirmar Nova Senha'), 'senha456');

    // Encontrar o botão
    const resetButtons = queryAllByText('Redefinir Senha');
    const buttonElement = resetButtons[resetButtons.length - 1];
    
    // Clicar no botão de redefinir senha
    fireEvent.press(buttonElement);

    // Verificar se o alerta foi exibido corretamente
    expect(Alert.alert).toHaveBeenCalledWith(
      'Erro',
      'As senhas não coincidem!'
    );
    
    // Verificar que o navigation.navigate não foi chamado
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it('exibe mensagem de sucesso e navega para a tela de login quando todos os campos estão preenchidos corretamente', () => {
    const { queryAllByText, getByPlaceholderText } = render(
      <ResetPasswordScreen navigation={mockNavigation} />
    );

    // Preencher todos os campos corretamente
    fireEvent.changeText(getByPlaceholderText('Código de Verificação'), '123456');
    fireEvent.changeText(getByPlaceholderText('Nova Senha'), 'senha123');
    fireEvent.changeText(getByPlaceholderText('Confirmar Nova Senha'), 'senha123');

    // Encontrar o botão
    const resetButtons = queryAllByText('Redefinir Senha');
    const buttonElement = resetButtons[resetButtons.length - 1];
    
    // Clicar no botão de redefinir senha
    fireEvent.press(buttonElement);

    // Verificar se o alerta de sucesso foi exibido
    expect(Alert.alert).toHaveBeenCalledWith(
      'Sucesso',
      'Sua senha foi redefinida com sucesso!'
    );
    
    // Verificar se a navegação para a tela de Login ocorreu
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
  });
  
  it('atualiza os estados quando os campos são preenchidos', () => {
    const { getByPlaceholderText } = render(
      <ResetPasswordScreen navigation={mockNavigation} />
    );

    const codeInput = getByPlaceholderText('Código de Verificação');
    const newPasswordInput = getByPlaceholderText('Nova Senha');
    const confirmPasswordInput = getByPlaceholderText('Confirmar Nova Senha');

    // Testar entrada de dados nos campos
    fireEvent.changeText(codeInput, '123456');
    fireEvent.changeText(newPasswordInput, 'senha123');
    fireEvent.changeText(confirmPasswordInput, 'senha123');

    // Verificar se os valores foram atualizados
    expect(codeInput.props.value).toBe('123456');
    expect(newPasswordInput.props.value).toBe('senha123');
    expect(confirmPasswordInput.props.value).toBe('senha123');
  });
});