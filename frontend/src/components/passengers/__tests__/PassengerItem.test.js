import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PassengerItem from '../PassengerItem'; // Ajuste o caminho conforme necessário

jest.mock('@expo/vector-icons', () => {
  const { View, Text } = require('react-native');
  return {
    MaterialIcons: ({ name, size, color }) => (
      <View testID={`icon-${name}`}>
        <Text>{name}</Text>
      </View>
    ),
  };
});

describe('PassengerItem', () => {
  const mockOnPress = jest.fn();
  const passengerName = 'John Doe';
  const mockAvatar = { uri: 'https://example.com/avatar.jpg' };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza o nome do passageiro corretamente', () => {
    const { getByText } = render(
      <PassengerItem 
        name={passengerName} 
        onPress={mockOnPress} 
      />
    );
    
    expect(getByText(passengerName)).toBeTruthy();
  });

  it('renderiza o ícone de pessoa quando não há avatar', () => {
    const { getByTestId } = render(
      <PassengerItem 
        name={passengerName} 
        onPress={mockOnPress} 
      />
    );
    
    expect(getByTestId('icon-person')).toBeTruthy();
  });

  it('renderiza a imagem do avatar quando fornecida', () => {
    const { queryByTestId, UNSAFE_getByType } = render(
      <PassengerItem 
        name={passengerName} 
        avatar={mockAvatar} 
        onPress={mockOnPress} 
      />
    );
    
    // Não deve renderizar o ícone quando há avatar
    expect(queryByTestId('icon-person')).toBeNull();
    
    // Deve renderizar a imagem
    const image = UNSAFE_getByType('Image');
    expect(image).toBeTruthy();
    expect(image.props.source).toBe(mockAvatar);
  });

  it('chama onPress quando pressionado', () => {
    const { getByText } = render(
      <PassengerItem 
        name={passengerName} 
        onPress={mockOnPress} 
      />
    );
    
    const touchableComponent = getByText(passengerName).parent.parent;
    fireEvent.press(touchableComponent);
    
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('não chama onPress quando não pressionado', () => {
    render(
      <PassengerItem 
        name={passengerName} 
        onPress={mockOnPress} 
      />
    );
    
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('aplica estilos adequados aos componentes', () => {
    const { getByText, UNSAFE_getAllByType } = render(
      <PassengerItem 
        name={passengerName} 
        onPress={mockOnPress} 
      />
    );
    
    // TouchableOpacity deve ter estilo
    const touchable = getByText(passengerName).parent.parent;
    expect(touchable.props.style).toBeTruthy();
    
    // View container do avatar deve ter estilo
    const views = UNSAFE_getAllByType('View');
    expect(views[0].props.style).toBeTruthy();
    
    // Text do nome do passageiro deve ter estilo
    const nameText = getByText(passengerName);
    expect(nameText.props.style).toBeTruthy();
  });


});