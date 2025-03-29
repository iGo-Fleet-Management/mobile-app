import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DriverProfileScreen from '../DriverProfileScreen'; 
// Mock dos ícones e dependências
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: ({ name }) => {
    const { Text } = require('react-native');
    return <Text>{name}</Text>; // Renderiza o nome do ícone como texto
  },
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 })
}));

describe('DriverProfileScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    setParams: jest.fn()
  };

  const mockUserData = {
    nome: 'John',
    sobrenome: 'Doe',
    telefone: '(31) 9 1234-5678',
    email: 'johndoe@gmail.com',
    enderecos: [
      { tipo: 'Casa', logradouro: 'R.', numero: '12', bairro: 'Bairro 1', cidade: 'Ipatinga' },
      { tipo: 'Trabalho', logradouro: 'R.', numero: '72', bairro: 'Bairro 4', cidade: 'Ipatinga' }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o cabeçalho corretamente', () => {
    const { getByText } = render(
      <DriverProfileScreen navigation={mockNavigation} />
    );
    
    expect(getByText('chevron-left')).toBeTruthy(); // Ícone de voltar
    expect(getByText('Ajuda')).toBeTruthy();
    expect(getByText('help-outline')).toBeTruthy(); // Ícone de ajuda
  });

  it('deve exibir todas as informações do motorista', () => {
    const { getByText } = render(
      <DriverProfileScreen navigation={mockNavigation} />
    );

    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Passageiro')).toBeTruthy();
    expect(getByText('(31) 9 1234-5678')).toBeTruthy();
    expect(getByText('johndoe@gmail.com')).toBeTruthy();
  });

  it('deve exibir todos os endereços cadastrados', () => {
    const { getByText } = render(
      <DriverProfileScreen navigation={mockNavigation} />
    );

    expect(getByText('(Casa) R. 12, Bairro 1, Ipatinga')).toBeTruthy();
    expect(getByText('(Trabalho) R. 72, Bairro 4, Ipatinga')).toBeTruthy();
  });

  it('deve navegar para edição de perfil ao pressionar o botão', () => {
    const { getByText } = render(
      <DriverProfileScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByText('Editar Perfil'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('EditProfile');
  });

  it('deve mostrar confirmação de logout ao pressionar Sair', () => {
    const { getByText } = render(
      <DriverProfileScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByText('Sair'));
    expect(mockNavigation.setParams).toHaveBeenCalledWith({
      showLogoutConfirm: true
    });
  });

  it('deve voltar ao pressionar o ícone de voltar', () => {
    const { getByText } = render(
      <DriverProfileScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByText('chevron-left'));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('deve renderizar o avatar do motorista', () => {
    const { getByText } = render(
      <DriverProfileScreen navigation={mockNavigation} />
    );

    expect(getByText('person')).toBeTruthy(); // Ícone de avatar
  });

  it('deve corresponder ao snapshot', () => {
    const { toJSON } = render(
      <DriverProfileScreen navigation={mockNavigation} />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});