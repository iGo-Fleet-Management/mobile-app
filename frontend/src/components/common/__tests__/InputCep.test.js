import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { InputCep } from '../InputCep';
import { MaterialIcons } from '@expo/vector-icons';

// Mock para o @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialIcons: ({ name, size, color, style }) => {
      return <View testID={`icon-${name}`} style={style} />;
    },
  };
});

describe('InputCep Component', () => {
  // Mock para as funções
  const mockOnChangeText = jest.fn();
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByPlaceholderText } = render(
      <InputCep onChangeText={mockOnChangeText} />
    );
    
    expect(getByPlaceholderText('00000-000')).toBeTruthy();
  });

  it('renders with custom placeholder', () => {
    const { getByPlaceholderText } = render(
      <InputCep onChangeText={mockOnChangeText} placeholder="Digite seu CEP" />
    );
    
    expect(getByPlaceholderText('Digite seu CEP')).toBeTruthy();
  });

  it('renders with label', () => {
    const { getByText } = render(
      <InputCep onChangeText={mockOnChangeText} label="CEP" />
    );
    
    expect(getByText('CEP')).toBeTruthy();
  });



  it('formats CEP correctly when typing', () => {
    const { getByPlaceholderText } = render(
      <InputCep onChangeText={mockOnChangeText} />
    );
    
    const input = getByPlaceholderText('00000-000');
    
    // Simular digitação
    fireEvent.changeText(input, '12345678');
    
    // Verificar se o input foi formatado corretamente
    expect(input.props.value).toBe('12345-678');
    
    // Verificar se onChangeText foi chamado com o valor limpo (sem formatação)
    expect(mockOnChangeText).toHaveBeenCalledWith('12345678');
  });

  it('limits input to 8 digits', () => {
    const { getByPlaceholderText } = render(
      <InputCep onChangeText={mockOnChangeText} />
    );
    
    const input = getByPlaceholderText('00000-000');
    
    // Simular digitação com mais de 8 dígitos
    fireEvent.changeText(input, '123456789');
    
    // Verificar se o input foi limitado a 8 dígitos e formatado
    expect(input.props.value).toBe('12345-678');
    
    // Verificar se onChangeText foi chamado com o valor limitado
    expect(mockOnChangeText).toHaveBeenCalledWith('12345678');
  });

  it('removes non-numeric characters', () => {
    const { getByPlaceholderText } = render(
      <InputCep onChangeText={mockOnChangeText} />
    );
    
    const input = getByPlaceholderText('00000-000');
    
    // Simular digitação com caracteres não numéricos
    fireEvent.changeText(input, 'a1b2c3d4e5');
    
    // Verificar se apenas os números foram mantidos e formatados
    expect(input.props.value).toBe('12345');
    
    // Verificar se onChangeText foi chamado com o valor limpo
    expect(mockOnChangeText).toHaveBeenCalledWith('12345');
  });

  it('displays error message when provided', () => {
    const { getByText, getByTestId } = render(
      <InputCep 
        onChangeText={mockOnChangeText} 
        error="CEP inválido" 
      />
    );
    
    expect(getByText('CEP inválido')).toBeTruthy();
    expect(getByTestId('icon-error-outline')).toBeTruthy();
  });

  it('renders search button when onSearch is provided', () => {
    const { getByTestId } = render(
      <InputCep 
        onChangeText={mockOnChangeText}
        onSearch={mockOnSearch}
      />
    );
    
    expect(getByTestId('icon-search')).toBeTruthy();
  });

  it('updates formatted value when value prop changes externally', async () => {
    const { getByPlaceholderText, rerender } = render(
      <InputCep 
        value=""
        onChangeText={mockOnChangeText}
      />
    );
    
    const input = getByPlaceholderText('00000-000');
    expect(input.props.value).toBe('');
    
    // Atualizar props para simular mudança externa
    rerender(
      <InputCep 
        value="12345678"
        onChangeText={mockOnChangeText}
      />
    );
    
    // Verificar se o valor foi formatado corretamente
    await waitFor(() => {
      expect(input.props.value).toBe('12345-678');
    });
  });
});