import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import HelpScreen from '../HelpScreen'; // Ajuste o caminho conforme sua estrutura de diretórios

// Mock para o componente Header
jest.mock('../../../components/common/Header', () => {
  return jest.fn(({ title, onArrowBackPress }) => (
    <div testID="mock-header">
      <div testID="header-title">{title}</div>
      <button testID="back-button" onPress={onArrowBackPress}>Voltar</button>
    </div>
  ));
});

// Mock para o componente HelpItem
jest.mock('../../../components/help/HelpItem', () => {
  return jest.fn(({ icon, title, description }) => (
    <div testID={`help-item-${icon}`}>
      <div testID={`help-item-title-${icon}`}>{title}</div>
      <div testID={`help-item-description-${icon}`}>{description}</div>
    </div>
  ));
});

// Mock para o componente ContactSection
jest.mock('../../../components/help/ContactSection', () => {
  return jest.fn(({ onContactPress }) => (
    <div testID="contact-section">
      <button testID="contact-button" onPress={onContactPress}>Contato</button>
    </div>
  ));
});

// Mock para o SafeAreaView
jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: jest.fn(({ children, style, edges }) => (
      <View testID="safe-area-view" style={style}>{children}</View>
    )),
  };
});

describe('HelpScreen', () => {
  const mockNavigation = {
    goBack: jest.fn(),
  };

  beforeEach(() => {
    // Resetar os mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('renderiza corretamente com todos os componentes', () => {
    render(<HelpScreen navigation={mockNavigation} />);
    
    // Verificar se o Header está presente com o título correto
    expect(screen.getByTestId('header-title').props.children).toBe('Central de Ajuda');
    
    // Verificar se os HelpItems estão presentes
    expect(screen.getByTestId('help-item-directions-car')).toBeTruthy();
    expect(screen.getByTestId('help-item-toggle-on')).toBeTruthy();
    
    // Verificar se a seção de contato está presente
    expect(screen.getByTestId('contact-section')).toBeTruthy();
  });

  it('chama a função goBack quando o botão voltar é pressionado', () => {
    render(<HelpScreen navigation={mockNavigation} />);
    
    // Pressionar o botão voltar
    fireEvent.press(screen.getByTestId('back-button'));
    
    // Verificar se a função goBack foi chamada
    expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
  });

  it('passa os títulos e descrições corretos para os componentes HelpItem', () => {
    render(<HelpScreen navigation={mockNavigation} />);
    
    // Verificar o primeiro HelpItem
    expect(screen.getByTestId('help-item-title-directions-car').props.children).toBe('Acompanhamento em tempo real');
    expect(screen.getByTestId('help-item-description-directions-car').props.children).toBe(
      'Acompanhe a localização do seu motorista em tempo real no mapa.'
    );
    
    // Verificar o segundo HelpItem
    expect(screen.getByTestId('help-item-title-toggle-on').props.children).toBe('Status \'Liberado\'');
    expect(screen.getByTestId('help-item-description-toggle-on').props.children).toBe(
      'Ative esta opção quando estiver pronto para o embarque.'
    );
  });

  it('verifica se o componente ContactSection recebe uma função onContactPress', () => {
    const { getByTestId } = render(<HelpScreen navigation={mockNavigation} />);
    
    // Verificar se a seção de contato está presente
    const contactSection = getByTestId('contact-section');
    expect(contactSection).toBeTruthy();
    
    // Verificar se o botão de contato está presente
    const contactButton = getByTestId('contact-button');
    expect(contactButton).toBeTruthy();
    
    // Não testamos se a função é chamada porque no código fonte ela é apenas um comentário
    // /* Implement contact support logic */
  });
});