import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import PassengersScreen from '../PassengersScreen';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { API_IGO } from '@env';

// Mock das dependências
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useFocusEffect: jest.fn(),
}));

jest.mock('../../../auth/AuthService', () => ({
  authHeader: jest.fn(() => Promise.resolve({})),
}));

jest.mock('@env', () => ({
  API_IGO: 'https://api-mocked-url.com',
}), { virtual: true });


// Mock para ícones
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialIcons: ({ name, ...props }) => <View name={`MaterialIcons-${name}`} {...props} />,
  };
});

// Mock global do fetch
global.fetch = jest.fn();

describe('PassengersScreen', () => {
  const mockNavigate = jest.fn();
  const mockGoBack = jest.fn();
  const mockNavigation = {
    navigate: mockNavigate,
    goBack: mockGoBack,
    setOptions: jest.fn(),
  };

  const mockPassengers = [
    { id: '1', name: 'João Silva', phone: '(11) 99999-9999' },
    { id: '2', name: 'Maria Souza', phone: '(11) 98888-8888' },
    { id: '3', name: 'Carlos Oliveira', phone: '(11) 97777-7777' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigation.mockReturnValue(mockNavigation);
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: mockPassengers
      }),
    });
  });

  // Teste 1: deve renderizar o cabeçalho corretamente
  test('deve renderizar o cabeçalho corretamente', async () => {
    render(<PassengersScreen navigation={mockNavigation} />);
    
    await waitFor(() => {
      expect(screen.getByText('Passageiros')).toBeTruthy();
      
      // Verifica o ícone de voltar
      const backIcons = screen.root.findAllByType('View').filter(
        view => view.props.name === 'MaterialIcons-arrow-back'
      );
      expect(backIcons.length).toBeGreaterThan(0);
    });
  });

  // Teste 2: deve renderizar a barra de pesquisa
  test('deve renderizar a barra de pesquisa', async () => {
    render(<PassengersScreen navigation={mockNavigation} />);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Procurar passageiro')).toBeTruthy();
      
      // Verifica o ícone de busca
      const searchIcons = screen.root.findAllByType('View').filter(
        view => view.props.name === 'MaterialIcons-search'
      );
      expect(searchIcons.length).toBeGreaterThan(0);
    });
  });

 
  // Teste 5: deve navegar para adicionar passageiro ao pressionar o botão
  test('deve navegar para adicionar passageiro ao pressionar o botão', async () => {
    render(<PassengersScreen navigation={mockNavigation} />);
    
    await waitFor(() => {
      const addButton = screen.getByText('Adicionar Passageiro');
      fireEvent.press(addButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('AddPassenger');
    });
  });

  // Teste 6: deve renderizar o botão de adicionar passageiro
  test('deve renderizar o botão de adicionar passageiro', async () => {
    render(<PassengersScreen navigation={mockNavigation} />);
    
    await waitFor(() => {
      expect(screen.getByText('Adicionar Passageiro')).toBeTruthy();
    });
  });

  // Teste adicional: deve limpar a pesquisa ao pressionar o ícone de fechar
  test('deve limpar a pesquisa ao pressionar o ícone de fechar', async () => {
    render(<PassengersScreen navigation={mockNavigation} />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Procurar passageiro');
      fireEvent.changeText(searchInput, 'João');
      
      // Encontra o ícone de fechar
      const closeIcons = screen.root.findAllByType('View').filter(
        view => view.props.name === 'MaterialIcons-close'
      );
      fireEvent.press(closeIcons[0]);
      
      expect(searchInput.props.value).toBe('');
    });
  });
});