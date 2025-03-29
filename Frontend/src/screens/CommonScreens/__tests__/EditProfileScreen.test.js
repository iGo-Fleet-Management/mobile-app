import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EditProfileScreen from '../EditProfileScreen'; // Ajuste o caminho para o seu arquivo

// Mock para o navigation
const mockNavigation = {
  goBack: jest.fn(),
  navigate: jest.fn(),
};

// Mock para o route
const mockRoute = {
  params: {}
};

describe('EditProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza corretamente com os dados iniciais', () => {
    const { getByText, getByDisplayValue } = render(
      <EditProfileScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Verifica se os campos de texto estão presentes com os valores iniciais
    expect(getByText('Nome')).toBeTruthy();
    expect(getByDisplayValue('John')).toBeTruthy();
    expect(getByText('Sobrenome')).toBeTruthy();
    expect(getByDisplayValue('Doe')).toBeTruthy();
    expect(getByText('CPF')).toBeTruthy();
    expect(getByDisplayValue('123.456.789-10')).toBeTruthy();
    expect(getByText('Data de Nascimento')).toBeTruthy();
    expect(getByDisplayValue('02/09/2003')).toBeTruthy();
    expect(getByText('E-mail')).toBeTruthy();
    expect(getByDisplayValue('johndoe@gmail.com')).toBeTruthy();
    expect(getByText('Telefone')).toBeTruthy();
    expect(getByDisplayValue('(31) 9 1234-5678')).toBeTruthy();
    
    // Verifica se os botões estão presentes
    expect(getByText('Endereços')).toBeTruthy();
    expect(getByText('Salvar Perfil')).toBeTruthy();
  });

  it('atualiza os dados do formulário quando o texto é alterado', () => {
    const { getByDisplayValue } = render(
      <EditProfileScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Obtém os inputs pelos valores iniciais
    const nomeInput = getByDisplayValue('John');
    const sobrenomeInput = getByDisplayValue('Doe');
    const cpfInput = getByDisplayValue('123.456.789-10');
    const dataNascimentoInput = getByDisplayValue('02/09/2003');
    const emailInput = getByDisplayValue('johndoe@gmail.com');
    const telefoneInput = getByDisplayValue('(31) 9 1234-5678');

    // Altera os valores dos inputs
    fireEvent.changeText(nomeInput, 'Jane');
    fireEvent.changeText(sobrenomeInput, 'Smith');
    fireEvent.changeText(cpfInput, '987.654.321-00');
    fireEvent.changeText(dataNascimentoInput, '15/03/1995');
    fireEvent.changeText(emailInput, 'janesmith@gmail.com');
    fireEvent.changeText(telefoneInput, '(31) 9 8765-4321');

    // Verifica se os valores foram atualizados
    expect(getByDisplayValue('Jane')).toBeTruthy();
    expect(getByDisplayValue('Smith')).toBeTruthy();
    expect(getByDisplayValue('987.654.321-00')).toBeTruthy();
    expect(getByDisplayValue('15/03/1995')).toBeTruthy();
    expect(getByDisplayValue('janesmith@gmail.com')).toBeTruthy();
    expect(getByDisplayValue('(31) 9 8765-4321')).toBeTruthy();
  });

  it('navega para tela anterior ao pressionar o botão de voltar', () => {
    const { getByTestId } = render(
      <EditProfileScreen navigation={mockNavigation} route={mockRoute} />
    );
  
    const backButton = getByTestId('back-button');
    fireEvent.press(backButton);
  
    expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
  });

  it('navega para tela de endereços ao pressionar o botão Endereços', () => {
    const { getByText } = render(
      <EditProfileScreen navigation={mockNavigation} route={mockRoute} />
    );

    const addressesButton = getByText('Endereços');
    fireEvent.press(addressesButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('EditAddresses');
  });

  it('salva o perfil e volta para a tela anterior ao pressionar Salvar Perfil', () => {
    const { getByText } = render(
      <EditProfileScreen navigation={mockNavigation} route={mockRoute} />
    );

    const saveButton = getByText('Salvar Perfil');
    fireEvent.press(saveButton);

    expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
  });
});