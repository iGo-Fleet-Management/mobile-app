import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import DriverProfileScreen from '../DriverProfileScreen';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_IGO } from '@env';

// Mock das dependências
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  removeItem: jest.fn(),
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

// Mock do componente LogoutConfirmation
jest.mock('../../../components/common/Logout', () => {
  const { View, Text } = require('react-native');
  return ({ visible, onConfirm, onCancel }) => (
    visible ? (
      <View testID="logout-modal">
        <Text onPress={onConfirm}>Confirmar Logout</Text>
        <Text onPress={onCancel}>Cancelar Logout</Text>
      </View>
    ) : null
  );
});

// Mock global do fetch
global.fetch = jest.fn();

describe('DriverProfileScreen', () => {
  const mockNavigate = jest.fn();
  const mockGoBack = jest.fn();
  const mockNavigation = {
    navigate: mockNavigate,
    goBack: mockGoBack,
  };

  const mockUserData = {
    name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone: '(11) 99999-9999',
    addresses: [
      {
        address_type: 'Casa',
        street: 'Rua das Flores',
        number: '123',
        neighbourhood: 'Centro',
        city: 'São Paulo'
      },
      {
        address_type: 'Trabalho',
        street: 'Avenida Paulista',
        number: '1000',
        neighbourhood: 'Bela Vista',
        city: 'São Paulo'
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigation.mockReturnValue(mockNavigation);
    AsyncStorage.getItem.mockResolvedValue('mock-token');
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: mockUserData
      }),
    });
  });

  // Teste 1: deve exibir todas as informações do motorista
  test('deve exibir todas as informações do motorista', async () => {
    render(<DriverProfileScreen navigation={mockNavigation} />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeTruthy();
      expect(screen.getByText('Motorista')).toBeTruthy();
      expect(screen.getByText('john.doe@example.com')).toBeTruthy();
      expect(screen.getByText('(11) 99999-9999')).toBeTruthy();
    });
  });

  // Teste 2: deve exibir todos os endereços cadastrados
  test('deve exibir todos os endereços cadastrados', async () => {
    render(<DriverProfileScreen navigation={mockNavigation} />);
    
    await waitFor(() => {
      expect(screen.getByText('(Casa) Rua das Flores 123, Centro, São Paulo')).toBeTruthy();
      expect(screen.getByText('(Trabalho) Avenida Paulista 1000, Bela Vista, São Paulo')).toBeTruthy();
    });
  });

  // Teste 3: deve navegar para edição de perfil ao pressionar o botão
  test('deve navegar para edição de perfil ao pressionar o botão', async () => {
    render(<DriverProfileScreen navigation={mockNavigation} />);
    
    await waitFor(() => {
      const editButton = screen.getByText('Editar Perfil');
      fireEvent.press(editButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('EditProfile', { userData: mockUserData });
    });
  });

  // Teste 4: deve mostrar confirmação de logout ao pressionar Sair
  test('deve mostrar confirmação de logout ao pressionar Sair', async () => {
    render(<DriverProfileScreen navigation={mockNavigation} />);
    
    await waitFor(() => {
      const logoutButton = screen.getByText('Sair');
      fireEvent.press(logoutButton);
      
      expect(screen.getByText('Confirmar Logout')).toBeTruthy();
      expect(screen.getByText('Cancelar Logout')).toBeTruthy();
    });
  });

  // Teste 5: deve voltar ao pressionar o ícone de voltar
  test('deve voltar ao pressionar o ícone de voltar', async () => {
    render(<DriverProfileScreen navigation={mockNavigation} />);
    
    await waitFor(() => {
      // Encontra o ícone de voltar pelo nome
      const backIcons = screen.root.findAllByType('View').filter(
        view => view.props.name === 'MaterialIcons-chevron-left'
      );
      
      // Simula o clique no primeiro ícone encontrado
      fireEvent.press(backIcons[0]);
      
      expect(mockGoBack).toHaveBeenCalled();
    });
  });


  // Teste adicional: deve exibir mensagem de erro quando falha ao carregar
  test('deve exibir mensagem de erro quando falha ao carregar', async () => {
    fetch.mockRejectedValueOnce(new Error('Erro de rede'));
    
    render(<DriverProfileScreen navigation={mockNavigation} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Erro ao carregar perfil/i)).toBeTruthy();
      expect(screen.getByText('Tentar novamente')).toBeTruthy();
    });
  });
});