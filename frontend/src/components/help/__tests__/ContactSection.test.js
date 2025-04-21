import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ContactSection from '../ContactSection'; 

describe('ContactSection', () => {
  const mockOnContactPress = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza o título corretamente', () => {
    const { getByText } = render(
      <ContactSection onContactPress={mockOnContactPress} />
    );
    
    expect(getByText('Precisa de mais ajuda?')).toBeTruthy();
  });

  it('renderiza o botão de contato corretamente', () => {
    const { getByText } = render(
      <ContactSection onContactPress={mockOnContactPress} />
    );
    
    expect(getByText('Contatar Suporte')).toBeTruthy();
  });

  it('chama onContactPress quando o botão é pressionado', () => {
    const { getByText } = render(
      <ContactSection onContactPress={mockOnContactPress} />
    );
    
    const contactButton = getByText('Contatar Suporte');
    fireEvent.press(contactButton);
    
    expect(mockOnContactPress).toHaveBeenCalledTimes(1);
  });

  it('não chama onContactPress se o botão não for pressionado', () => {
    render(<ContactSection onContactPress={mockOnContactPress} />);
    
    expect(mockOnContactPress).not.toHaveBeenCalled();
  });

});