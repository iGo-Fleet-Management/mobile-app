import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import DriverReturnScreen from '../DriverReturnScreen';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Mock das dependências
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

// Mock para ícones
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: ({ name, ...props }) => <View name={`Ionicons-${name}`} {...props} />,
    MaterialIcons: ({ name, ...props }) => <View name={`MaterialIcons-${name}`} {...props} />,
  };
});

describe('DriverReturnScreen', () => {
  const mockNavigate = jest.fn();
  const mockNavigation = {
    navigate: mockNavigate,
    goBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigation.mockReturnValue(mockNavigation);
  });

  // Teste 1: deve renderizar o cabeçalho corretamente
  test('deve renderizar o cabeçalho corretamente', () => {
    render(<DriverReturnScreen />);
    
    expect(screen.getByText('iGO')).toBeTruthy();
    expect(screen.getByText('Roni Cristian')).toBeTruthy();
    
    // Verifica o ícone de perfil
    const profileIcons = screen.root.findAllByType('View').filter(
      view => view.props.name === 'MaterialIcons-person'
    );
    expect(profileIcons.length).toBeGreaterThan(0);
  });

  test('deve exibir o nome da empresa', () => {
    render(<DriverReturnScreen />);
    expect(screen.getByText('Minions Vans')).toBeTruthy();
  });

  

  test('deve alternar para tela de ida ao pressionar o botão', () => {
    render(<DriverReturnScreen />);
    
    const idaButton = screen.getByText('Ida');
    fireEvent.press(idaButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('DriverHomeScreen');
  });

  test('deve exibir o resumo do dia corretamente', () => {
    render(<DriverReturnScreen />);
    
    expect(screen.getByText('Resumo do Dia')).toBeTruthy();
    expect(screen.getByText('5')).toBeTruthy(); // Total passageiros
    expect(screen.getByText('1')).toBeTruthy(); // Somente volta
    expect(screen.getByText('3')).toBeTruthy(); // Liberados
  });

 
  test('deve renderizar o botão de trajeto', () => {
    render(<DriverReturnScreen />);
    expect(screen.getByText('Trajeto')).toBeTruthy();
  });

  // Teste 7: deve navegar para tela de trajeto ativo ao pressionar o botão
  test('deve navegar para tela de trajeto ativo ao pressionar o botão', () => {
    render(<DriverReturnScreen />);
    
    const trajetoButton = screen.getByText('Trajeto');
    fireEvent.press(trajetoButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('ActiveTrip');
  });


  test('deve exibir a data atual formatada', () => {
    render(<DriverReturnScreen />);
    
    const today = new Date();
    const expectedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    
    expect(screen.getByText(expectedDate)).toBeTruthy();
  });
});