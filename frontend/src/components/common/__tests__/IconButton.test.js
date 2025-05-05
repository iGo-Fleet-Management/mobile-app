import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import IconButton from '../IconButton'; // Ajuste o caminho conforme necessário

// Mock do MaterialIcons
jest.mock('@expo/vector-icons', () => {
  const { View, Text } = require('react-native');
  return {
    MaterialIcons: ({ name, size, color }) => (
      <View testID={`icon-${name}`}>
        <Text>Icon: {name}, Size: {size}, Color: {color}</Text>
      </View>
    ),
  };
});

describe('IconButton', () => {
  it('renderiza o ícone correto', () => {
    const { getByTestId } = render(<IconButton iconName="home" />);
    expect(getByTestId('icon-home')).toBeTruthy();
  });

  it('chama a função onPress quando pressionado', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <IconButton iconName="home" onPress={onPressMock} />
    );
    
    fireEvent.press(getByTestId('icon-home').parent);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('aplica o tamanho padrão quando não é especificado', () => {
    const { getByText } = render(<IconButton iconName="home" />);
    expect(getByText('Icon: home, Size: 24, Color: black')).toBeTruthy();
  });

  it('aplica o tamanho especificado', () => {
    const { getByText } = render(<IconButton iconName="home" size={32} />);
    expect(getByText('Icon: home, Size: 32, Color: black')).toBeTruthy();
  });

  it('aplica a cor padrão quando não é especificada', () => {
    const { getByText } = render(<IconButton iconName="home" />);
    expect(getByText('Icon: home, Size: 24, Color: black')).toBeTruthy();
  });

  it('aplica a cor especificada', () => {
    const { getByText } = render(<IconButton iconName="home" color="red" />);
    expect(getByText('Icon: home, Size: 24, Color: red')).toBeTruthy();
  });


  it('passa todas as props corretamente para o MaterialIcons', () => {
    const { getByText } = render(
      <IconButton iconName="settings" size={40} color="green" />
    );
    
    expect(getByText('Icon: settings, Size: 40, Color: green')).toBeTruthy();
  });
});