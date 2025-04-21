import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PassengersScreen from '../PassengersScreen';

// Mock dos componentes
jest.mock('../../../components/common/Header', () => {
  const { Text, View } = require('react-native');
  return ({ title }) => (
    <View>
      <Text>{title}</Text>
    </View>
  );
});

jest.mock('../../../components/common/SearchBar', () => {
  const { TextInput, View } = require('react-native');
  return ({ placeholder, value, onChangeText }) => (
    <View>
      <TextInput 
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
});

jest.mock('../../../components/passengers/PassengerItem', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ name, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <Text>{name}</Text>
    </TouchableOpacity>
  );
});

jest.mock('../../../components/passengers/AddPassengerButton', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <Text>Adicionar Passageiro</Text>
    </TouchableOpacity>
  );
});

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 })
}));

describe('PassengersScreen', () => {
  const mockNavigation = {
    navigate: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o cabeçalho corretamente', () => {
    const { getByText } = render(
      <PassengersScreen navigation={mockNavigation} />
    );
    
    expect(getByText('Passageiros')).toBeTruthy();
  });

  it('deve renderizar a barra de pesquisa', () => {
    const { getByPlaceholderText } = render(
      <PassengersScreen navigation={mockNavigation} />
    );
    
    expect(getByPlaceholderText('Procurar passageiro')).toBeTruthy();
  });

  it('deve filtrar passageiros ao digitar na busca', () => {
    const { getByPlaceholderText, queryByText } = render(
      <PassengersScreen navigation={mockNavigation} />
    );
    
    const searchInput = getByPlaceholderText('Procurar passageiro');
    fireEvent.changeText(searchInput, 'Iago');
    
    expect(queryByText('Hugo de Melo Carvalho')).toBeNull();
    expect(queryByText('Iago Carro Guimarães')).toBeTruthy();
  });

  it('deve renderizar todos os passageiros inicialmente', () => {
    const { getByText } = render(
      <PassengersScreen navigation={mockNavigation} />
    );
    
    expect(getByText('Hugo de Melo Carvalho')).toBeTruthy();
    expect(getByText('Iago Carro Guimarães')).toBeTruthy();
    expect(getByText('Lucas Barcelos Gomes')).toBeTruthy();
    expect(getByText('Paulo Henrique Reis')).toBeTruthy();
    expect(getByText('Rafael Galinari')).toBeTruthy();
    expect(getByText('Samuel Andrade')).toBeTruthy();
  });

  it('deve navegar para adicionar passageiro ao pressionar o botão', () => {
    const { getByText } = render(
      <PassengersScreen navigation={mockNavigation} />
    );
    
    fireEvent.press(getByText('Adicionar Passageiro'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddPassenger');
  });

  it('deve renderizar o botão de adicionar passageiro', () => {
    const { getByText } = render(
      <PassengersScreen navigation={mockNavigation} />
    );
    
    expect(getByText('Adicionar Passageiro')).toBeTruthy();
  });

  it('deve corresponder ao snapshot', () => {
    const { toJSON } = render(
      <PassengersScreen navigation={mockNavigation} />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});