import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MaterialIcons } from '@expo/vector-icons';
import UserIcon from '../UserIcon';

// Mock para o componente MaterialIcons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialIcons: jest.fn(({ name, size, color, style }) => {
      return <View testID={`icon-${name}`} style={style} />;
    })
  };
});

describe('UserIcon', () => {
  const mockOnPress = jest.fn();
  
  beforeEach(() => {
    // Limpa o mock antes de cada teste
    mockOnPress.mockClear();
  });

  it('deve renderizar o componente corretamente com um nome de usuário', () => {
    const { getByText } = render(
      <UserIcon userName="José" onPress={mockOnPress} />
    );
    
    expect(getByText('José')).toBeTruthy();
    expect(getByText('J')).toBeTruthy();
  });

  it('deve renderizar "Usuário" e o ícone de pessoa quando nenhum nome é fornecido', () => {
    const { getByText, getByTestId } = render(
      <UserIcon onPress={mockOnPress} />
    );
    
    expect(getByText('Usuário')).toBeTruthy();
    expect(getByTestId('icon-person')).toBeTruthy();
  });

  it('deve chamar a função onPress quando o TouchableOpacity é pressionado', () => {
    const { getByText } = render(
      <UserIcon userName="Maria" onPress={mockOnPress} />
    );
    
    const touchableComponent = getByText('Maria').parent;
    fireEvent.press(touchableComponent);
    
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('deve mostrar apenas a primeira letra do nome do usuário em maiúscula', () => {
    const { getByText } = render(
      <UserIcon userName="ana" onPress={mockOnPress} />
    );
    
    expect(getByText('A')).toBeTruthy();
  });

  it('deve limitar o nome de usuário a uma linha', () => {
    const { getByText } = render(
      <UserIcon userName="Nome Muito Longo Para Teste" onPress={mockOnPress} />
    );
    
    const nameComponent = getByText('Nome Muito Longo Para Teste');
    expect(nameComponent.props.numberOfLines).toBe(1);
  });

  it('deve extrair apenas a primeira letra mesmo de nomes compostos', () => {
    const { getByText } = render(
      <UserIcon userName="João Silva" onPress={mockOnPress} />
    );
    
    expect(getByText('J')).toBeTruthy();
  });

  it('deve renderizar o ícone de pessoa quando userName é uma string vazia', () => {
    const { getByText, getByTestId } = render(
      <UserIcon userName="" onPress={mockOnPress} />
    );
    
    expect(getByText('Usuário')).toBeTruthy();
    expect(getByTestId('icon-person')).toBeTruthy();
  });

  it('deve usar o estilo correto para o container do ícone', () => {
    const { getByText } = render(
      <UserIcon userName="Carlos" onPress={mockOnPress} />
    );
    
    const letterComponent = getByText('C');
    const iconContainer = letterComponent.parent;
    
    // Verificando algumas das propriedades de estilo principais
    expect(iconContainer.props.style).toEqual(
      expect.objectContaining({
        backgroundColor: '#3f51b5',
        borderRadius: 18,
        width: 36,
        height: 36,
      })
    );
  });

  it('deve renderizar o ícone MaterialIcons com os parâmetros corretos quando não há nome', () => {
    render(<UserIcon onPress={mockOnPress} />);
    
    expect(MaterialIcons).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'person',
        size: 24,
        color: 'white'
      }),
      {}
    );
  });
});