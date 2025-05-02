import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import AboutScreen from '../AboutScreen'; // Ajuste o caminho conforme sua estrutura de diretórios

// Mock para o componente Header
jest.mock('../../../components/common/Header', () => {
  return jest.fn(({ title, onArrowBackPress }) => (
    <div testID="mock-header">
      <div testID="header-title">{title}</div>
      <button testID="back-button" onPress={onArrowBackPress}>Voltar</button>
    </div>
  ));
});

// Mock para o FontAwesome5
jest.mock('@expo/vector-icons', () => ({
  FontAwesome5: jest.fn(({ name, size, color, style }) => (
    <div testID={`icon-${name}`}>Icon: {name}</div>
  )),
}));

// Mock para o SafeAreaView
jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: jest.fn(({ children, style, edges }) => (
      <View testID="safe-area-view" style={style}>{children}</View>
    )),
  };
});

describe('AboutScreen', () => {
  const mockNavigation = {
    goBack: jest.fn(),
  };

  beforeEach(() => {
    // Resetar os mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('renderiza corretamente com todos os elementos', () => {
    render(<AboutScreen navigation={mockNavigation} />);
    
    // Verificar se o título da tela está presente
    expect(screen.getByText('iGO')).toBeTruthy();
    
    // Verificar se a versão está presente
    expect(screen.getByText('Versão 1.0.0')).toBeTruthy();
    
    // Verificar se a descrição está presente
    expect(screen.getByText(/O iGO é um aplicativo de transporte/)).toBeTruthy();
    
    // Verificar se o texto do recurso está presente
    expect(screen.getByText('Acompanhamento em tempo real')).toBeTruthy();
    
    // Verificar se o footer está presente
    expect(screen.getByText('Desenvolvido como projeto acadêmico')).toBeTruthy();
    
    // Verificar se o ícone está presente
    expect(screen.getByTestId('icon-map-marked-alt')).toBeTruthy();
  });

  it('chama a função goBack quando o botão voltar é pressionado', () => {
    render(<AboutScreen navigation={mockNavigation} />);
    
    // Pressionar o botão voltar
    fireEvent.press(screen.getByTestId('back-button'));
    
    // Verificar se a função goBack foi chamada
    expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
  });

  it('passa o título correto para o componente Header', () => {
    render(<AboutScreen navigation={mockNavigation} />);
    
    // Verificar se o título correto foi passado para o Header
    expect(screen.getByTestId('header-title').props.children).toBe('Sobre o iGO');
  });
});