import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Header from '../Header'; // Ajuste o caminho conforme necessário

// Mock do MaterialIcons
jest.mock('@expo/vector-icons', () => {
  const { View, Text } = require('react-native');
  return {
    MaterialIcons: ({ name, size, color }) => (
      <View testID={`icon-${name}`}>
        <Text>{name}</Text>
      </View>
    ),
  };
});

describe('Header', () => {
  it('renderiza corretamente com título', () => {
    const { getByText } = render(<Header title="Teste" />);
    expect(getByText('Teste')).toBeTruthy();
  });

  it('não mostra o botão de voltar quando onArrowBackPress não é fornecido', () => {
    const { queryByTestId } = render(<Header title="Teste" />);
    expect(queryByTestId('icon-chevron-left')).toBeFalsy();
  });

  it('mostra o botão de voltar quando onArrowBackPress é fornecido', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <Header title="Teste" onArrowBackPress={mockOnPress} />
    );
    expect(getByTestId('icon-chevron-left')).toBeTruthy();
  });

  it('chama onArrowBackPress quando o botão de voltar é pressionado', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <Header title="Teste" onArrowBackPress={mockOnPress} />
    );
    
    fireEvent.press(getByTestId('icon-chevron-left').parent);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('não mostra o ícone direito quando rightIcon não é fornecido', () => {
    const mockOnPress = jest.fn();
    const { queryByTestId } = render(
      <Header title="Teste" onRightIconPress={mockOnPress} />
    );
    expect(queryByTestId('icon-undefined')).toBeFalsy();
  });

  it('não mostra o ícone direito quando onRightIconPress não é fornecido', () => {
    const { queryByTestId } = render(
      <Header title="Teste" rightIcon="settings" />
    );
    expect(queryByTestId('icon-settings')).toBeFalsy();
  });

  it('mostra o ícone direito quando rightIcon e onRightIconPress são fornecidos', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <Header title="Teste" rightIcon="settings" onRightIconPress={mockOnPress} />
    );
    expect(getByTestId('icon-settings')).toBeTruthy();
  });

  it('chama onRightIconPress quando o ícone direito é pressionado', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <Header title="Teste" rightIcon="settings" onRightIconPress={mockOnPress} />
    );
    
    fireEvent.press(getByTestId('icon-settings').parent);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('aplica estilos personalizados quando fornecidos via prop style', () => {
    const customStyle = { backgroundColor: 'red' };
    const { UNSAFE_root } = render(
      <Header title="Teste" style={customStyle} />
    );
    
    const headerView = UNSAFE_root.findByType('View');
    expect(headerView.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining(customStyle)
      ])
    );
  });
});