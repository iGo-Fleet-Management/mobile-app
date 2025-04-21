import React from 'react';
import { render } from '@testing-library/react-native';
import { MaterialIcons } from '@expo/vector-icons';
import HelpItem from '../HelpItem';

// Mock para o componente MaterialIcons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialIcons: jest.fn(({ name, size, color }) => {
      return <View testID={`icon-${name}`} data-color={color} data-size={size} />;
    })
  };
});

describe('HelpItem', () => {
  const defaultProps = {
    icon: 'help-outline',
    title: 'Ajuda e Suporte',
    description: 'Como podemos te ajudar hoje?'
  };

  it('deve renderizar corretamente com as props padrão', () => {
    const { getByText, getByTestId } = render(<HelpItem {...defaultProps} />);
    
    expect(getByText('Ajuda e Suporte')).toBeTruthy();
    expect(getByText('Como podemos te ajudar hoje?')).toBeTruthy();
    expect(getByTestId('icon-help-outline')).toBeTruthy();
  });

  it('deve usar a cor padrão do ícone (#4285F4) quando não especificada', () => {
    const { getByTestId } = render(<HelpItem {...defaultProps} />);
    
    const icon = getByTestId('icon-help-outline');
    expect(icon.props['data-color']).toBe('#4285F4');
  });

  it('deve usar a cor personalizada do ícone quando especificada', () => {
    const customColor = '#FF5733';
    const { getByTestId } = render(
      <HelpItem {...defaultProps} iconColor={customColor} />
    );
    
    const icon = getByTestId('icon-help-outline');
    expect(icon.props['data-color']).toBe(customColor);
  });

  it('deve renderizar diferentes ícones quando especificados', () => {
    const { getByTestId } = render(
      <HelpItem {...defaultProps} icon="settings" />
    );
    
    expect(getByTestId('icon-settings')).toBeTruthy();
  });

  it('deve renderizar o título e descrição corretamente', () => {
    const customProps = {
      icon: 'info',
      title: 'Informações',
      description: 'Detalhes sobre o aplicativo'
    };
    
    const { getByText } = render(<HelpItem {...customProps} />);
    
    expect(getByText('Informações')).toBeTruthy();
    expect(getByText('Detalhes sobre o aplicativo')).toBeTruthy();
  });

  it('deve passar o tamanho correto para o ícone', () => {
    const { getByTestId } = render(<HelpItem {...defaultProps} />);
    
    const icon = getByTestId('icon-help-outline');
    expect(icon.props['data-size']).toBe(24);
  });

});