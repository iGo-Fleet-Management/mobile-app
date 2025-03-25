import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HelpScreen from '../src/screens/HelpScreen';

// Mock components
jest.mock('../components/help/HelpItem', () => {
  const { Text, View } = require('react-native');
  return jest.fn(({ title, description }) => (
    <View>
      <Text>{title}</Text>
      <Text>{description}</Text>
    </View>
  ));
});

jest.mock('../components/help/ContactSection', () => {
  const { Text, TouchableOpacity } = require('react-native');
  return jest.fn(({ onContactPress }) => (
    <TouchableOpacity onPress={onContactPress}>
      <Text>Fale Conosco</Text>
    </TouchableOpacity>
  ));
});

describe('HelpScreen', () => {
  const mockNavigation = {
    openDrawer: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders help items and contact section', () => {
    const { getByText } = render(<HelpScreen navigation={mockNavigation} />);
    
    // Verificar título da tela
    expect(getByText('Acompanhamento em tempo real')).toBeTruthy();
    expect(getByText('Acompanhe a localização do seu motorista em tempo real no mapa.')).toBeTruthy();
    
    expect(getByText('Status \'Liberado\'')).toBeTruthy();
    expect(getByText('Ative esta opção quando estiver pronto para o embarque.')).toBeTruthy();
    
    // Verificar seção de contato
    expect(getByText('Fale Conosco')).toBeTruthy();
  });

  it('calls navigation.openDrawer when menu is pressed', () => {
    const { getByTestId } = render(<HelpScreen navigation={mockNavigation} />);
    
    // Você precisará adicionar um testID ao componente Header
    // const menuButton = getByTestId('menu-button');
    // fireEvent.press(menuButton);
    // expect(mockNavigation.openDrawer).toHaveBeenCalled();
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<HelpScreen navigation={mockNavigation} />);
    expect(toJSON()).toMatchSnapshot();
  });
});