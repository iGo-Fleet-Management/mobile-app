import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ContactSection from '../ContactSection';

describe('ContactSection', () => {
  it('renderiza corretamente', () => {
    const { getByText } = render(<ContactSection onContactPress={() => {}} />);
    
    // Verifica se os textos estão presentes
    expect(getByText('Precisa de mais ajuda?')).toBeTruthy();
    expect(getByText('Contatar Suporte')).toBeTruthy();
  });
  
  it('chama a função onContactPress quando o botão é pressionado', () => {
    // Mock da função onContactPress
    const mockOnContactPress = jest.fn();
    
    const { getByText } = render(<ContactSection onContactPress={mockOnContactPress} />);
    
    // Encontra o botão pelo texto e simula um clique
    const button = getByText('Contatar Suporte');
    fireEvent.press(button);
    
    // Verifica se a função foi chamada
    expect(mockOnContactPress).toHaveBeenCalledTimes(1);
  });
  
  it('aplica os estilos corretamente', () => {
    const { getByText } = render(<ContactSection onContactPress={() => {}} />);
    
    // Verifica o título
    const title = getByText('Precisa de mais ajuda?');
    expect(title.props.style).toMatchObject({
      fontSize: 16,
      marginBottom: 10,
    });
    
    // Verifica o texto do botão
    const buttonText = getByText('Contatar Suporte');
    expect(buttonText.props.style).toMatchObject({
      color: '#ffffff',
      fontWeight: '500',
    });
  });
  
  it('renderiza sem a função onContactPress', () => {
    // Este teste verifica que não há erro quando onContactPress não é fornecido
    // (embora na prática você provavelmente queira exigir essa prop)
    
    // Silenciando temporariamente os erros de console para este teste
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    expect(() => {
      render(<ContactSection />);
    }).not.toThrow();
    
    // Restaurando console.error
    console.error = originalConsoleError;
  });
});