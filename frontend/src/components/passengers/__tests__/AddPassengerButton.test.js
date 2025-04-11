import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddPassengerButton from '../AddPassengerButton'; 

describe('AddPassengerButton', () => {
  const mockOnPress = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza o texto do botão corretamente', () => {
    const { getByText } = render(
      <AddPassengerButton onPress={mockOnPress} />
    );
    
    expect(getByText('Adicionar passageiro')).toBeTruthy();
  });

  it('chama a função onPress quando o botão é pressionado', () => {
    const { getByText } = render(
      <AddPassengerButton onPress={mockOnPress} />
    );
    
    const button = getByText('Adicionar passageiro');
    fireEvent.press(button);
    
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('não chama a função onPress quando o botão não é pressionado', () => {
    render(<AddPassengerButton onPress={mockOnPress} />);
    
    expect(mockOnPress).not.toHaveBeenCalled();
  });

});