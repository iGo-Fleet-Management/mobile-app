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

  it('deve aplicar estilos personalizados quando a prop style é fornecida', () => {
    const customStyle = { backgroundColor: 'lightblue', margin: 20 };
    const { container } = render(
      <SearchBar {...defaultProps} style={customStyle} />
    );
    
    // Verificamos se o estilo personalizado foi aplicado
    // Usando o método toJSON() para acessar a estrutura do componente renderizado
    const searchContainer = container.children[0];
    expect(searchContainer.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining(customStyle)
      ])
    );
  });

  it('deve renderizar o ícone de busca com as propriedades corretas', () => {
    render(<SearchBar {...defaultProps} />);
    
    // Verificamos se o MaterialIcons foi chamado com os parâmetros corretos
    expect(MaterialIcons).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'search',
        size: 24,
        color: 'gray'
      }),
      {}
    );
  });

  it('deve renderizar o TextInput com as propriedades corretas', () => {
    const { getByPlaceholderText } = render(<SearchBar {...defaultProps} />);
    
    const input = getByPlaceholderText('Pesquisar');
    expect(input.props.onChangeText).toBe(mockOnChangeText);
    expect(input.props.value).toBe('');
  });

  it('deve permitir entrada de texto longa no campo de busca', () => {
    const { getByPlaceholderText } = render(<SearchBar {...defaultProps} />);
    
    const input = getByPlaceholderText('Pesquisar');
    const longText = 'Este é um texto muito longo para testar o campo de busca e garantir que ele funcione corretamente';
    fireEvent.changeText(input, longText);
    
    expect(mockOnChangeText).toHaveBeenCalledWith(longText);
  });
});