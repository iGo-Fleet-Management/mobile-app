import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Header from '../Header'; // Ajuste o caminho conforme a estrutura do seu projeto

describe('Header Component', () => {
  const defaultProps = {
    title: 'Teste de Título',
  };

  test('renderiza o componente com título corretamente', () => {
    const { getByText } = render(<Header {...defaultProps} />);
    expect(getByText('Teste de Título')).toBeTruthy();
  });

  test('não renderiza o botão de voltar quando onArrowBackPress não é fornecido', () => {
    const { queryByTestId } = render(<Header {...defaultProps} />);
    expect(queryByTestId('icon-chevron-left')).toBeNull();
  });

  test('renderiza o botão de voltar quando onArrowBackPress é fornecido', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <Header {...defaultProps} onArrowBackPress={mockOnPress} />
    );
    
    expect(getByTestId('icon-chevron-left')).toBeTruthy();
  });

  test('chama onArrowBackPress quando o botão de voltar é pressionado', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <Header {...defaultProps} onArrowBackPress={mockOnPress} />
    );
    
    fireEvent.press(getByTestId('icon-chevron-left').parent);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  test('não renderiza o ícone direito quando rightIcon não é fornecido', () => {
    const mockOnPress = jest.fn();
    const { queryByTestId } = render(
      <Header {...defaultProps} onRightIconPress={mockOnPress} />
    );
    
    // Como não especificamos rightIcon, não deve renderizar nenhum ícone direito
    expect(queryByTestId(/^icon-/)).toBeNull();
  });

  test('não renderiza o ícone direito quando onRightIconPress não é fornecido', () => {
    const { queryByTestId } = render(
      <Header {...defaultProps} rightIcon="settings" />
    );
    
    // Como não especificamos onRightIconPress, não deve renderizar o ícone
    expect(queryByTestId('icon-settings')).toBeNull();
  });

  test('renderiza o ícone direito quando rightIcon e onRightIconPress são fornecidos', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <Header 
        {...defaultProps} 
        rightIcon="settings" 
        onRightIconPress={mockOnPress} 
      />
    );
    
    expect(getByTestId('icon-settings')).toBeTruthy();
  });

  test('chama onRightIconPress quando o ícone direito é pressionado', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <Header 
        {...defaultProps} 
        rightIcon="settings" 
        onRightIconPress={mockOnPress} 
      />
    );
    
    fireEvent.press(getByTestId('icon-settings').parent);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

});