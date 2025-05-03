import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import DriverHomeScreen from '../DriverHomeScreen';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_IGO } from '@env';

// Mock das dependências
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

jest.mock('@env', () => ({
  API_IGO: 'https://api-mocked-url.com',
}), { virtual: true });

jest.mock('../../../auth/AuthService', () => ({
  authHeader: jest.fn(() => Promise.resolve({})),
}));

// Mock para ícones
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: ({ name, ...props }) => <View name={`Ionicons-${name}`} {...props} />,
    MaterialIcons: ({ name, ...props }) => <View name={`MaterialIcons-${name}`} {...props} />,
  };
});

// Mock global do fetch
global.fetch = jest.fn();

describe('DriverHomeScreen', () => {
  const mockNavigate = jest.fn();
  const mockNavigation = {
    navigate: mockNavigate,
    goBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigation.mockReturnValue(mockNavigation);
    AsyncStorage.getItem.mockResolvedValue('mock-token');
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: {
          name: 'John',
          last_name: 'Doe'
        }
      }),
    });
  });

  // Teste 1: deve renderizar o cabeçalho com título e ícone do usuário
  test('deve renderizar o cabeçalho com título e ícone do usuário', async () => {
    render(<DriverHomeScreen />);
    
    await waitFor(() => {
      // Verifica se os textos principais estão renderizados
      expect(screen.getByText('iGO')).toBeTruthy();
      expect(screen.getByText('John Doe')).toBeTruthy();
      
      // Verifica se o ícone de perfil está presente
      const profileIcons = screen.root.findAllByType('View').filter(
        view => view.props.name === 'MaterialIcons-person'
      );
      expect(profileIcons.length).toBeGreaterThan(0);
    });
  });

  // Teste 2: deve mostrar o conteúdo específico para motorista
  test('deve mostrar o conteúdo específico para motorista', async () => {
    render(<DriverHomeScreen />);
    
    await waitFor(() => {
      // Verifica textos básicos
      expect(screen.getByText('Minions Vans')).toBeTruthy();
      expect(screen.getByText('Resumo do Dia')).toBeTruthy();
      expect(screen.getByText('Ida')).toBeTruthy();
      expect(screen.getByText('Volta')).toBeTruthy();
      
      // Verifica o botão de trajeto pelo texto
      const trajetoButton = screen.getByText('Trajeto');
      expect(trajetoButton).toBeTruthy();
    });
  });

  // Teste 3: deve navegar para o perfil ao pressionar o ícone do usuário
  test('deve navegar para o perfil ao pressionar o ícone do usuário', async () => {
    render(<DriverHomeScreen />);
    
    await waitFor(() => {
      // Encontra o container do perfil pelo texto do nome
      const profileName = screen.getByText('John Doe');
      const profileContainer = profileName.parent;
      
      // Simula o clique no container do perfil
      fireEvent.press(profileContainer);
      
      // Verifica a navegação
      expect(mockNavigate).toHaveBeenCalledWith('DriverProfile');
    });
  });

  // Teste 4: deve renderizar a estrutura principal
  test('deve renderizar a estrutura principal', async () => {
    render(<DriverHomeScreen />);
    
    await waitFor(() => {
      // Verifica o cabeçalho
      expect(screen.getByText('iGO')).toBeTruthy();
      
      // Verifica os botões de ida e volta
      expect(screen.getByText('Ida')).toBeTruthy();
      expect(screen.getByText('Volta')).toBeTruthy();
      
      // Verifica o resumo do dia
      expect(screen.getByText('Resumo do Dia')).toBeTruthy();
      
      // Verifica o botão de trajeto
      expect(screen.getByText('Trajeto')).toBeTruthy();
    });
  });

  // Teste 5: deve alternar entre as abas de ida e volta
  test('deve alternar entre as abas de ida e volta', async () => {
    render(<DriverHomeScreen />);
    
    await waitFor(() => {
      // Clica no botão de Volta
      const voltaButton = screen.getByText('Volta');
      fireEvent.press(voltaButton);
      
      // Verifica se o texto específico de volta aparece
      expect(screen.queryByText('Somente volta')).toBeTruthy();
      
      // Clica no botão de Ida
      const idaButton = screen.getByText('Ida');
      fireEvent.press(idaButton);
      
      // Verifica se o texto específico de ida aparece
      expect(screen.queryByText('Somente ida')).toBeTruthy();
    });
  });
});