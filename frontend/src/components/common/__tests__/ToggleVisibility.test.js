import React from 'react';
import { render } from '@testing-library/react-native';
import ToggleVisibility from '../ToggleVisibility';

// Mock do componente Ionicons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: ({ name }) => <View testID={`ionicon-${name}`} />
  };
});

describe('ToggleVisibility', () => {
  it('renderiza o ícone eye-off quando isVisible é true', () => {
    const { queryByTestId } = render(
      <ToggleVisibility isVisible={true} onToggle={() => {}} />
    );
    
    // Verifica se o ícone eye-off está presente
    expect(queryByTestId('ionicon-eye-off')).toBeTruthy();
    
    // Verifica se o ícone eye não está presente
    expect(queryByTestId('ionicon-eye')).toBeNull();
  });
  
  it('renderiza o ícone eye quando isVisible é false', () => {
    const { queryByTestId } = render(
      <ToggleVisibility isVisible={false} onToggle={() => {}} />
    );
    
    // Verifica se o ícone eye está presente
    expect(queryByTestId('ionicon-eye')).toBeTruthy();
    
    // Verifica se o ícone eye-off não está presente
    expect(queryByTestId('ionicon-eye-off')).toBeNull();
  });

  
});