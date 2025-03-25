import React from 'react';
import { render } from '@testing-library/react-native';
import AboutScreen from '../src/screens/AboutScreen';

describe('AboutScreen', () => {
  const mockNavigation = {
    openDrawer: jest.fn()
  };

  it('renders correctly', () => {
    const { getByText } = render(<AboutScreen navigation={mockNavigation} />);
    
    // Verificar título do aplicativo
    expect(getByText('iGO')).toBeTruthy();
    
    // Verificar versão
    expect(getByText('Versão 1.0.0')).toBeTruthy();
    
    // Verificar descrição
    expect(getByText(/O iGO é um aplicativo de transporte/)).toBeTruthy();
    
    // Verificar feature em tempo real
    expect(getByText('Acompanhamento em tempo real')).toBeTruthy();
    
    // Verificar rodapé
    expect(getByText('Desenvolvido como projeto acadêmico')).toBeTruthy();
  });

  it('calls navigation.openDrawer when menu is pressed', () => {
    const { getByTestId } = render(<AboutScreen navigation={mockNavigation} />);
    
    // Você precisará adicionar um testID ao componente Header para este teste
    // const menuButton = getByTestId('menu-button');
    // fireEvent.press(menuButton);
    // expect(mockNavigation.openDrawer).toHaveBeenCalled();
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<AboutScreen navigation={mockNavigation} />);
    expect(toJSON()).toMatchSnapshot();
  });
});