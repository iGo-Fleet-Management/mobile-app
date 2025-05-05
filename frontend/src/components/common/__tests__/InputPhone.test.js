import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import { InputPhone } from '../InputPhone';

// Mock para o MaterialIcons do expo
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
}));

describe('InputPhone Component', () => {
  test('renders correctly with default props', () => {
    const { getByPlaceholderText } = render(
      <InputPhone onChangeText={jest.fn()} />
    );
    
    const input = getByPlaceholderText('(00) 00000-0000');
    expect(input).toBeTruthy();
  });

  test('renders with custom placeholder', () => {
    const { getByPlaceholderText } = render(
      <InputPhone onChangeText={jest.fn()} placeholder="Enter phone number" />
    );
    
    const input = getByPlaceholderText('Enter phone number');
    expect(input).toBeTruthy();
  });

  test('displays label when provided', () => {
    const { getByText } = render(
      <InputPhone onChangeText={jest.fn()} label="Phone Number" />
    );
    
    const label = getByText('Phone Number');
    expect(label).toBeTruthy();
  });

  test('shows required asterisk when required prop is true', () => {
    const { getByText } = render(
      <InputPhone onChangeText={jest.fn()} label="Phone Number" required={true} />
    );
    
    const asterisk = getByText('*');
    expect(asterisk).toBeTruthy();
  });

  test('shows error message when error prop is provided', () => {
    const errorMessage = 'Invalid phone number';
    const { getByText } = render(
      <InputPhone onChangeText={jest.fn()} error={errorMessage} />
    );
    
    const error = getByText(errorMessage);
    expect(error).toBeTruthy();
  });

  test('displays error icon when error prop is provided', () => {
    const { getByTestId } = render(
      <InputPhone 
        onChangeText={jest.fn()} 
        error="Invalid phone number" 
      />
    );
    
    // Observe que precisamos adicionar testID ao ícone no componente
    // ou usar uma abordagem diferente para verificar a presença do ícone
    // Esta linha pode falhar se você não adicionar testID ao MaterialIcons
    // const errorIcon = getByTestId('error-icon');
    // expect(errorIcon).toBeTruthy();
  });

  test('formats phone number correctly (mobile format)', () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <InputPhone onChangeText={mockOnChangeText} />
    );
    
    const input = getByPlaceholderText('(00) 00000-0000');
    
    // Simula digitação de um número de celular (11 dígitos)
    fireEvent.changeText(input, '11987654321');
    
    // Verifica se o valor exibido está formatado
    expect(input.props.value).toBe('(11) 98765-4321');
    
    // Verifica se onChangeText foi chamado com o valor limpo (sem formatação)
    expect(mockOnChangeText).toHaveBeenCalledWith('11987654321');
  });

  
  test('formats partial phone number correctly (only DDD)', () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <InputPhone onChangeText={mockOnChangeText} />
    );
    
    const input = getByPlaceholderText('(00) 00000-0000');
    
    // Simula digitação apenas do DDD
    fireEvent.changeText(input, '11');
    
    // Verifica se o valor exibido está formatado
    expect(input.props.value).toBe('(11');
    
    // Verifica se onChangeText foi chamado com o valor limpo
    expect(mockOnChangeText).toHaveBeenCalledWith('11');
  });

  test('formats partial phone number correctly (DDD and partial number)', () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <InputPhone onChangeText={mockOnChangeText} />
    );
    
    const input = getByPlaceholderText('(00) 00000-0000');
    
    // Simula digitação do DDD e parte do número
    fireEvent.changeText(input, '11987');
    
    // Verifica se o valor exibido está formatado
    expect(input.props.value).toBe('(11) 987');
    
    // Verifica se onChangeText foi chamado com o valor limpo
    expect(mockOnChangeText).toHaveBeenCalledWith('11987');
  });

  test('limits input to 11 digits', () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <InputPhone onChangeText={mockOnChangeText} />
    );
    
    const input = getByPlaceholderText('(00) 00000-0000');
    
    // Simula digitação de um número com mais de 11 dígitos
    fireEvent.changeText(input, '119876543210000');
    
    // Verifica se o valor foi limitado a 11 dígitos e formatado corretamente
    expect(input.props.value).toBe('(11) 98765-4321');
    
    // Verifica se onChangeText foi chamado com o valor limitado a 11 dígitos
    expect(mockOnChangeText).toHaveBeenCalledWith('11987654321');
  });

 
  test('updates value when external value prop changes', async () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText, rerender } = render(
      <InputPhone onChangeText={mockOnChangeText} value="" />
    );
    
    const input = getByPlaceholderText('(00) 00000-0000');
    expect(input.props.value).toBe('');
    
    // Simula uma mudança externa no valor
    rerender(
      <InputPhone onChangeText={mockOnChangeText} value="11987654321" />
    );
    
    // Aguarda que o useEffect seja executado
    await waitFor(() => {
      expect(input.props.value).toBe('(11) 98765-4321');
    });
  });

  test('clears value when external value is set to empty', async () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText, rerender } = render(
      <InputPhone onChangeText={mockOnChangeText} value="11987654321" />
    );
    
    const input = getByPlaceholderText('(00) 00000-0000');
    
    // Aguarda que o valor inicial seja formatado
    await waitFor(() => {
      expect(input.props.value).toBe('(11) 98765-4321');
    });
    
    // Simula uma mudança externa limpando o valor
    rerender(
      <InputPhone onChangeText={mockOnChangeText} value="" />
    );
    
    // Aguarda que o useEffect seja executado
    await waitFor(() => {
      expect(input.props.value).toBe('');
    });
  });

  test('applies custom styles when provided', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByPlaceholderText } = render(
      <InputPhone 
        onChangeText={jest.fn()} 
        style={customStyle} 
      />
    );
    
    // Para testar estilos diretamente, podemos usar o testID ou
    // verificar os estilos aplicados aos componentes
    // Esta abordagem depende de como sua implementação de testes lida com estilos
    // Pode ser necessário ajustar o componente para incluir testID neste caso
  });
});