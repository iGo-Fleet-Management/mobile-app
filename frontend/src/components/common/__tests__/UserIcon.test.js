import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MaterialIcons } from '@expo/vector-icons';
import UserIcon from '../UserIcon';

// Mock para o componente MaterialIcons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialIcons: jest.fn(({ name, size, color }) => {
      return <View testID={`icon-${name}`} />;
    })
  };
});

describe('UserIcon', () => {
  const mockOnPress = jest.fn();
  
  beforeEach(() => {
    // Limpa o mock antes de cada teste
    mockOnPress.mockClear();
  });

  it('deve renderizar com a primeira letra do nome quando userName é fornecido', () => {
    const { getByText, queryByTestId } = render(
      <UserIcon userName="Maria" onPress={mockOnPress} />
    );
    
    expect(getByText('M')).toBeTruthy();
    expect(getByText('Maria')).toBeTruthy();
    // Não deve mostrar o ícone person quando tem a letra
    expect(queryByTestId('icon-person')).toBeNull();
  });

  it('deve renderizar o ícone de pessoa quando userName não é fornecido', () => {
    const { getByTestId, getByText } = render(
      <UserIcon onPress={mockOnPress} />
    );
    
    expect(getByTestId('icon-person')).toBeTruthy();
    expect(getByText('Usuário')).toBeTruthy();
  });

  it('deve renderizar o ícone de pessoa quando userName é string vazia', () => {
    const { getByTestId, getByText } = render(
      <UserIcon userName="" onPress={mockOnPress} />
    );
    
    expect(getByTestId('icon-person')).toBeTruthy();
    expect(getByText('Usuário')).toBeTruthy();
  });

  it('deve renderizar a primeira letra em maiúsculo mesmo se o nome começar com minúsculo', () => {
    const { getByText } = render(
      <UserIcon userName="joão" onPress={mockOnPress} />
    );
    
    expect(getByText('J')).toBeTruthy();
    expect(getByText('joão')).toBeTruthy();
  });

  it('deve chamar onPress quando pressionado', () => {
    const { getByText } = render(
      <UserIcon userName="Pedro" onPress={mockOnPress} />
    );
    
    fireEvent.press(getByText('Pedro').parent);
    
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('deve limitar o texto do nome a uma linha', () => {
    const { getByText } = render(
      <UserIcon userName="Nome muito longo para testar" onPress={mockOnPress} />
    );
    
    const nameText = getByText('Nome muito longo para testar');
    expect(nameText.props.numberOfLines).toBe(1);
  });
});