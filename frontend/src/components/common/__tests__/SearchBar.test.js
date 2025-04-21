import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MaterialIcons } from '@expo/vector-icons';
import SearchBar from '../SearchBar';

// Mock para o componente MaterialIcons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialIcons: jest.fn(({ name, size, color, style }) => {
      return <View testID={`icon-${name}`} style={style} />;
    })
  };
});

describe('SearchBar', () => {
  const mockOnChangeText = jest.fn();
  const defaultProps = {
    placeholder: 'Pesquisar',
    value: '',
    onChangeText: mockOnChangeText,
  };

  beforeEach(() => {
    // Limpa o mock antes de cada teste
    mockOnChangeText.mockClear();
  });

  it('deve renderizar o componente corretamente', () => {
    const { getByPlaceholderText, getByTestId } = render(
      <SearchBar {...defaultProps} />
    );
    
    expect(getByPlaceholderText('Pesquisar')).toBeTruthy();
    expect(getByTestId('icon-search')).toBeTruthy();
  });

  it('deve exibir o valor fornecido no TextInput', () => {
    const props = {
      ...defaultProps,
      value: 'texto de busca',
    };
    
    const { getByDisplayValue } = render(<SearchBar {...props} />);
    
    expect(getByDisplayValue('texto de busca')).toBeTruthy();
  });

  it('deve chamar onChangeText quando o texto é alterado', () => {
    const { getByPlaceholderText } = render(<SearchBar {...defaultProps} />);
    
    const input = getByPlaceholderText('Pesquisar');
    fireEvent.changeText(input, 'novo texto');
    
    expect(mockOnChangeText).toHaveBeenCalledWith('novo texto');
    expect(mockOnChangeText).toHaveBeenCalledTimes(1);
  });

 

  it('deve usar o placeholder passado como propriedade', () => {
    const customPlaceholder = 'Digite para buscar';
    const { getByPlaceholderText } = render(
      <SearchBar {...defaultProps} placeholder={customPlaceholder} />
    );
    
    expect(getByPlaceholderText(customPlaceholder)).toBeTruthy();
  });
});