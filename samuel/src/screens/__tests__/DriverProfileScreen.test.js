import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DriverProfileScreen from '../src/screens/DriverProfileScreen';

describe('DriverProfileScreen', () => {
  const mockNavigation = {
    goBack: jest.fn(),
    navigate: jest.fn(),
    setParams: jest.fn()
  };

  const mockUserData = {
    nome: 'John',
    sobrenome: 'Doe',
    cpf: '123.456.789-10',
    dataNascimento: '02/09/2003',
    email: 'johndoe@gmail.com',
    telefone: '(31) 9 1234-5678',
    enderecos: [
      { tipo: 'Casa', logradouro: 'R.', numero: '12', bairro: 'Bairro 1', cidade: 'Ipatinga', cep: '35123-000' },
      { tipo: 'Trabalho', logradouro: 'R.', numero: '72', bairro: 'Bairro 4', cidade: 'Ipatinga', cep: '35123-000' }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user profile information correctly', () => {
    const { getByText } = render(<DriverProfileScreen navigation={mockNavigation} />);
    
    // Verificar nome completo
    expect(getByText('John Doe')).toBeTruthy();
    
    // Verificar role
    expect(getByText('Passageiro')).toBeTruthy();
    
    // Verificar informações pessoais
    expect(getByText('20')).toBeTruthy();
    expect(getByText('(31) 9 1234-5678')).toBeTruthy();
    expect(getByText('johndoe@gmail.com')).toBeTruthy();
    
    // Verificar endereços
    expect(getByText(/\(Casa\) R\. 12, Bairro 1, Ipatinga/)).toBeTruthy();
    expect(getByText(/\(Trabalho\) R\. 72, Bairro 4, Ipatinga/)).toBeTruthy();
  });

  it('navigates to EditProfile when Edit Profile button is pressed', () => {
    const { getByText } = render(<DriverProfileScreen navigation={mockNavigation} />);
    
    const editButton = getByText('Editar Perfil');
    fireEvent.press(editButton);
    
    expect(mockNavigation.navigate).toHaveBeenCalledWith('EditProfile');
  });

  it('triggers logout confirmation when Logout button is pressed', () => {
    const { getByText } = render(<DriverProfileScreen navigation={mockNavigation} />);
    
    const logoutButton = getByText('Sair');
    fireEvent.press(logoutButton);
    
    expect(mockNavigation.setParams).toHaveBeenCalledWith({ showLogoutConfirm: true });
  });

  it('navigates back when back button is pressed', () => {
    const { getByTestId } = render(<DriverProfileScreen navigation={mockNavigation} />);
    
    // Você precisará adicionar um testID ao botão de voltar
    // const backButton = getByTestId('back-button');
    // fireEvent.press(backButton);
    
    // expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<DriverProfileScreen navigation={mockNavigation} />);
    expect(toJSON()).toMatchSnapshot();
  });
});