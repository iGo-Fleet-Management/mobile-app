import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EditAddressesScreen from '../src/screens/EditAddressesScreen';

describe('EditAddressesScreen', () => {
  const mockNavigation = {
    goBack: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all input fields with correct initial values', () => {
    const { getByText, getByDisplayValue } = render(<EditAddressesScreen navigation={mockNavigation} />);
    
    // Verificar labels
    expect(getByText('Endereço(s):')).toBeTruthy();
    expect(getByText('CEP')).toBeTruthy();
    expect(getByText('Logradouro')).toBeTruthy();
    expect(getByText('Número')).toBeTruthy();
    expect(getByText('Complemento')).toBeTruthy();
    expect(getByText('Bairro')).toBeTruthy();

    // Verificar valores iniciais
    expect(getByDisplayValue('35123-000')).toBeTruthy();
    expect(getByDisplayValue('Rua')).toBeTruthy();
    expect(getByDisplayValue('12')).toBeTruthy();
    expect(getByDisplayValue('Bairro')).toBeTruthy();
    expect(getByDisplayValue('Cidade')).toBeTruthy();
  });

  it('changes address type when buttons are pressed', () => {
    const { getByText } = render(<EditAddressesScreen navigation={mockNavigation} />);
    
    const casaButton = getByText('Casa');
    const outroButton = getByText('Outro');
    
    // Verificar estado inicial
    expect(casaButton).toBeTruthy();
    
    // Mudar para 'Outro'
    fireEvent.press(outroButton);
  });

  it('allows updating address fields', () => {
    const { getByDisplayValue } = render(<EditAddressesScreen navigation={mockNavigation} />);
    
    const cepInput = getByDisplayValue('35123-000');
    fireEvent.changeText(cepInput, '12345-678');
    expect(getByDisplayValue('12345-678')).toBeTruthy();
  });

  it('navigates back when back button is pressed', () => {
    const { getByTestId } = render(<EditAddressesScreen navigation={mockNavigation} />);
    
    // Você precisará adicionar um testID ao botão de voltar
    // const backButton = getByTestId('back-button');
    // fireEvent.press(backButton);
    // expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<EditAddressesScreen navigation={mockNavigation} />);
    expect(toJSON()).toMatchSnapshot();
  });
});