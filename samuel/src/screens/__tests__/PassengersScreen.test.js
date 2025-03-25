import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PassengersScreen from '../src/screens/PassengersScreen';

// Mock components
jest.mock('../components/common/Header', () => {
  const { View, Text } = require('react-native');
  return jest.fn(({ title }) => (
    <View>
      <Text>{title}</Text>
    </View>
  ));
});

jest.mock('../components/common/SearchBar', () => {
  const { TextInput } = require('react-native');
  return jest.fn(({ placeholder, value, onChangeText }) => (
    <TextInput 
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
    />
  ));
});

jest.mock('../components/passengers/PassengerItem', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return jest.fn(({ name, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <Text>{name}</Text>
    </TouchableOpacity>
  ));
});

jest.mock('../components/passengers/AddPassengerButton', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return jest.fn(({ onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <Text>Adicionar Passageiro</Text>
    </TouchableOpacity>
  ));
});

describe('PassengersScreen', () => {
  const mockNavigation = {
    openDrawer: jest.fn(),
    navigate: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders screen title', () => {
    const { getByText } = render(<PassengersScreen navigation={mockNavigation} />);
    expect(getByText('Passageiros')).toBeTruthy();
  });

  it('renders search bar', () => {
    const { getByPlaceholderText } = render(<PassengersScreen navigation={mockNavigation} />);
    expect(getByPlaceholderText('Procurar passageiro')).toBeTruthy();
  });

  it('displays all passengers initially', () => {
    const { getByText } = render(<PassengersScreen navigation={mockNavigation} />);
    
    const passengers = [
      'Hugo de Melo Carvalho',
      'Iago Carro Guimarães',
      'Lucas Barcelos Gomes',
      'Paulo Henrique Reis',
      'Rafael Galinari',
      'Samuel Andrade'
    ];

    passengers.forEach(passenger => {
      expect(getByText(passenger)).toBeTruthy();
    });
  });

  it('filters passengers based on search input', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<PassengersScreen navigation={mockNavigation} />);
    
    const searchInput = getByPlaceholderText('Procurar passageiro');
    
    // Search for a specific passenger
    fireEvent.changeText(searchInput, 'Hugo');
    expect(getByText('Hugo de Melo Carvalho')).toBeTruthy();
    expect(queryByText('Iago Carro Guimarães')).toBeNull();
  });

  it('opens drawer menu when menu button is pressed', () => {
    const { getByText } = render(<PassengersScreen navigation={mockNavigation} />);
    
    // Simular pressionamento do botão de menu
    // Você precisará adicionar um testID ao Header para este teste
    // const menuButton = getByTestId('menu-button');
    // fireEvent.press(menuButton);
    // expect(mockNavigation.openDrawer).toHaveBeenCalled();
  });

  it('navigates to AddPassenger screen when add button is pressed', () => {
    const { getByText } = render(<PassengersScreen navigation={mockNavigation} />);
    
    const addButton = getByText('Adicionar Passageiro');
    fireEvent.press(addButton);
    
    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddPassenger');
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<PassengersScreen navigation={mockNavigation} />);
    expect(toJSON()).toMatchSnapshot();
  });
});