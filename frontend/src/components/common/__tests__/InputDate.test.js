import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { InputDate } from '../InputDate'; // Ajuste o caminho conforme necessário

// Mocks simples
jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons'
}));

describe('InputDate Component', () => {
  test('renderiza corretamente', () => {
    const { getByPlaceholderText } = render(
      <InputDate onChangeText={jest.fn()} />
    );
    
    expect(getByPlaceholderText('DD/MM/AAAA')).toBeTruthy();
  });
  
  test('exibe label quando fornecido', () => {
    const { getByText } = render(
      <InputDate 
        label="Data de Nascimento" 
        onChangeText={jest.fn()} 
      />
    );
    
    expect(getByText('Data de Nascimento')).toBeTruthy();
  });
  
  test('exibe indicador de campo obrigatório quando required=true', () => {
    const { getByText } = render(
      <InputDate 
        label="Data" 
        required={true}
        onChangeText={jest.fn()} 
      />
    );
    
    expect(getByText('*')).toBeTruthy();
  });
  
  test('exibe mensagem de erro quando error prop é fornecida', () => {
    const errorMessage = 'Data inválida';
    const { getByText } = render(
      <InputDate 
        onChangeText={jest.fn()} 
        error={errorMessage} 
      />
    );
    
    expect(getByText(errorMessage)).toBeTruthy();
  });
  
  test('formata o texto inserido corretamente', () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <InputDate onChangeText={mockOnChangeText} />
    );
    
    const input = getByPlaceholderText('DD/MM/AAAA');
    
    // Simula digitação de "01012023"
    fireEvent.changeText(input, '01012023');
    
    // Verifica se o formato aplicado é "01/01/2023"
    expect(mockOnChangeText).toHaveBeenCalledWith('01/01/2023');
  });
  
  test('aceita placeholder personalizado', () => {
    const { getByPlaceholderText } = render(
      <InputDate 
        onChangeText={jest.fn()} 
        placeholder="Selecione uma data" 
      />
    );
    
    expect(getByPlaceholderText('Selecione uma data')).toBeTruthy();
  });
  
  test('inicializa com valor de data fornecido como string', () => {
    const { getByDisplayValue } = render(
      <InputDate 
        value="25/12/2023" 
        onChangeText={jest.fn()} 
      />
    );
    
    expect(getByDisplayValue('25/12/2023')).toBeTruthy();
  });
});