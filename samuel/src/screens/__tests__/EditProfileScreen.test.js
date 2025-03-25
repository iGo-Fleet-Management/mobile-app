import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EditProfileScreen from '../src/screens/EditProfileScreen';

describe('EditProfileScreen', () => {
  const mockNavigation = {
    goBack: jest.fn(),
    navigate: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all input fields with correct initial values', () => {
    const { getByText, getByDisplayValue } = render(<EditProfileScreen navigation={mockNavigation} />);
    
    // Verificar labels
    expect(getByText('Nome')).toBeTruthy();
    expect(getByText('Sobrenome')).toBeTruthy();
    expect(getByText('CPF')).toBeTruthy();
    expect(getByText('Data de Nascimento')).toBeTruthy();
    expect(getByText('E-mail')).toBeTruthy();
    expect(getByText('Telefone')).toBeTruthy();

    // Verificar valores iniciais
    expect(getByDisplayValue('John')).toBeTruthy();
    expect(getByDisplayValue('Doe')).toBeTruthy();
    expect(getByDisplayValue('123.456.789-10')).toBeTruthy();
    expect(getByDisplayValue('02/09/2003')).toBeTruthy();
    expect(getByDisplayValue('johndoe@gmail.com')).toBeTruthy();
    expect(getByDisplayValue('(31) 9 1234-5678')).toBeTruthy();
  });

  it('allows updating form fields', () => {
    const { getByText, getByDisplayValue } = render(<EditProfileScreen navigation={mockNavigation} />);
    
    const nomeInput = getByDisplayValue('John');
    fireEvent.changeText(nomeInput, 'Jane');
    expect(getByDisplayValue('Jane')).toBeTruthy();
  });

  it('navigates to EditAddresses when Addresses button is pressed', () => {
    const { getByText } = render(<EditProfileScreen navigation={mockNavigation} />);
    
    const addressesButton = getByText('Endereços');
    fireEvent.press(addressesButton);
    
    expect(mockNavigation.navigate).toHaveBeenCalledWith('EditAddresses');
  });

  it('navigates back when save button is pressed', () => {
    const { getByText } = render(<EditProfileScreen navigation={mockNavigation} />);
    
    const saveButton = getByText('Salvar Perfil');
    fireEvent.press(saveButton);
    
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<EditProfileScreen navigation={mockNavigation} />);
    expect(toJSON()).toMatchSnapshot();
  });
});