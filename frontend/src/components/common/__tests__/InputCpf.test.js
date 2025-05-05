import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { InputCpf } from '../InputCpf';
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

describe('Componente InputCpf', () => {
  // Mock para as funções
  const mockOnChangeText = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza corretamente com props padrão', () => {
    const { getByPlaceholderText } = render(
      <InputCpf onChangeText={mockOnChangeText} />
    );
    
    expect(getByPlaceholderText('000.000.000-00')).toBeTruthy();
  });

  it('renderiza com placeholder personalizado', () => {
    const { getByPlaceholderText } = render(
      <InputCpf onChangeText={mockOnChangeText} placeholder="Digite seu CPF" />
    );
    
    expect(getByPlaceholderText('Digite seu CPF')).toBeTruthy();
  });

  it('renderiza com label', () => {
    const { getByText } = render(
      <InputCpf onChangeText={mockOnChangeText} label="CPF" />
    );
    
    expect(getByText('CPF')).toBeTruthy();
  });

  

  it('formata CPF corretamente ao digitar', () => {
    const { getByPlaceholderText } = render(
      <InputCpf onChangeText={mockOnChangeText} />
    );
    
    const input = getByPlaceholderText('000.000.000-00');
    
    // Simular digitação
    fireEvent.changeText(input, '12345678901');
    
    // Verificar se o input foi formatado corretamente
    expect(input.props.value).toBe('123.456.789-01');
    
    // Verificar se onChangeText foi chamado com o valor limpo (sem formatação)
    expect(mockOnChangeText).toHaveBeenCalledWith('12345678901');
  });

  it('limita a entrada a 11 dígitos', () => {
    const { getByPlaceholderText } = render(
      <InputCpf onChangeText={mockOnChangeText} />
    );
    
    const input = getByPlaceholderText('000.000.000-00');
    
    // Simular digitação com mais de 11 dígitos
    fireEvent.changeText(input, '123456789012');
    
    // Verificar se o input foi limitado a 11 dígitos e formatado
    expect(input.props.value).toBe('123.456.789-01');
    
    // Verificar se onChangeText foi chamado com o valor limitado
    expect(mockOnChangeText).toHaveBeenCalledWith('12345678901');
  });

  it('remove caracteres não numéricos', () => {
    const { getByPlaceholderText } = render(
      <InputCpf onChangeText={mockOnChangeText} />
    );
    
    const input = getByPlaceholderText('000.000.000-00');
    
    // Simular digitação com caracteres não numéricos
    fireEvent.changeText(input, 'a1b2c3d4e5f6g7h8i9j0k1');
    
    // Verificar se apenas os números foram mantidos e formatados
    expect(input.props.value).toBe('123.456.789-01');
    
    // Verificar se onChangeText foi chamado com o valor limpo
    expect(mockOnChangeText).toHaveBeenCalledWith('12345678901');
  });

  it('exibe mensagem de erro quando fornecida', () => {
    const { getByText, getByTestId } = render(
      <InputCpf 
        onChangeText={mockOnChangeText} 
        error="CPF inválido" 
      />
    );
    
    expect(getByText('CPF inválido')).toBeTruthy();
    expect(getByTestId('icon-error-outline')).toBeTruthy();
  });

  it('formata parcialmente CPF com 3 dígitos', () => {
    const { getByPlaceholderText } = render(
      <InputCpf onChangeText={mockOnChangeText} />
    );
    
    const input = getByPlaceholderText('000.000.000-00');
    
    // Simular digitação de apenas 3 dígitos
    fireEvent.changeText(input, '123');
    
    // Verificar formatação parcial
    expect(input.props.value).toBe('123');
  });

  it('formata parcialmente CPF com 6 dígitos', () => {
    const { getByPlaceholderText } = render(
      <InputCpf onChangeText={mockOnChangeText} />
    );
    
    const input = getByPlaceholderText('000.000.000-00');
    
    // Simular digitação de 6 dígitos
    fireEvent.changeText(input, '123456');
    
    // Verificar formatação parcial
    expect(input.props.value).toBe('123.456');
  });

  it('formata parcialmente CPF com 9 dígitos', () => {
    const { getByPlaceholderText } = render(
      <InputCpf onChangeText={mockOnChangeText} />
    );
    
    const input = getByPlaceholderText('000.000.000-00');
    
    // Simular digitação de 9 dígitos
    fireEvent.changeText(input, '123456789');
    
    // Verificar formatação parcial
    expect(input.props.value).toBe('123.456.789');
  });

  it('aplica estilo personalizado quando fornecido', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByPlaceholderText } = render(
      <InputCpf 
        onChangeText={mockOnChangeText}
        style={customStyle}
      />
    );
    
    const input = getByPlaceholderText('000.000.000-00');
    const inputContainer = input.parent;
    
    // Verificar se o estilo personalizado foi aplicado
    expect(inputContainer.props.style).toContainEqual(customStyle);
  });

  it('atualiza o valor formatado quando a prop value muda externamente', async () => {
    const { getByPlaceholderText, rerender } = render(
      <InputCpf 
        value=""
        onChangeText={mockOnChangeText}
      />
    );
    
    const input = getByPlaceholderText('000.000.000-00');
    expect(input.props.value).toBe('');
    
    // Atualizar props para simular mudança externa
    rerender(
      <InputCpf 
        value="12345678901"
        onChangeText={mockOnChangeText}
      />
    );
    
    // Verificar se o valor foi formatado corretamente
    await waitFor(() => {
      expect(input.props.value).toBe('123.456.789-01');
    });
  });
});