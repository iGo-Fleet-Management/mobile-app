import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MaterialIcons } from '@expo/vector-icons';
import IconButton from '../IconButton'; // Ajuste o caminho conforme a estrutura do seu projeto

// Mock do MaterialIcons para poder espionar as chamadas
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialIcons: jest.fn(({ name, size, color, ...props }) => {
      return <View testID={`icon-${name}`} name={name} size={size} color={color} {...props} />;
    })
  };
});

describe('IconButton Component', () => {
  const defaultProps = {
    name: 'home',
    onPress: jest.fn()
  };

  beforeEach(() => {
    // Limpa o estado do mock antes de cada teste
    jest.clearAllMocks();
  });

  test('renderiza o componente com o ícone correto', () => {
    const { getByTestId } = render(<IconButton {...defaultProps} />);
    expect(getByTestId('icon-home')).toBeTruthy();
  });

  test('chama a função onPress quando pressionado', () => {
    const { getByTestId } = render(<IconButton {...defaultProps} />);
    fireEvent.press(getByTestId('icon-home').parent);
    expect(defaultProps.onPress).toHaveBeenCalledTimes(1);
  });

});