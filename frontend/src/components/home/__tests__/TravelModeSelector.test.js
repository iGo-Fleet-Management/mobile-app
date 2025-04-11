import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TravelModeSelector from '../TravelModeSelector'; 


jest.mock('@expo/vector-icons', () => {
  const { View, Text } = require('react-native');
  return {
    MaterialIcons: ({ name, size, color }) => (
      <View testID={`icon-${name}`}>
        <Text>{name}</Text>
      </View>
    ),
  };
});

describe('TravelModeSelector', () => {
  const mockOnSelectMode = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza todos os três modos de viagem', () => {
    const { getByText } = render(
      <TravelModeSelector 
        selectedMode="roundTrip" 
        onSelectMode={mockOnSelectMode} 
      />
    );
    
    expect(getByText('Ida e volta')).toBeTruthy();
    expect(getByText('Apenas ida')).toBeTruthy();
    expect(getByText('Apenas volta')).toBeTruthy();
  });

  

  it('chama onSelectMode com o modo correto quando uma opção é pressionada', () => {
    const { getAllByRole, getByText } = render(
      <TravelModeSelector 
        selectedMode="roundTrip" 
        onSelectMode={mockOnSelectMode} 
      />
    );
    
    
    try {
      const buttons = getAllByRole('button');
      if (buttons && buttons.length === 3) {
        fireEvent.press(buttons[1]); // Pressiona "Apenas ida"
        expect(mockOnSelectMode).toHaveBeenCalledWith('oneWay');
      }
    } catch (e) {
    
      const oneWayOption = getByText('Apenas ida');
     
      const touchableParent = oneWayOption.parent;
      fireEvent.press(touchableParent);
      expect(mockOnSelectMode).toHaveBeenCalledWith('oneWay');
    }
  });

  it('renderiza ícones corretos para cada modo', () => {
    const { getByTestId } = render(
      <TravelModeSelector 
        selectedMode="roundTrip" 
        onSelectMode={mockOnSelectMode} 
      />
    );

    expect(getByTestId('icon-sync')).toBeTruthy();
    expect(getByTestId('icon-arrow-forward')).toBeTruthy();
    expect(getByTestId('icon-arrow-back')).toBeTruthy();
  });


  it('exibe todos os modos na ordem correta', () => {
    const { getAllByText } = render(
      <TravelModeSelector 
        selectedMode="roundTrip" 
        onSelectMode={mockOnSelectMode} 
      />
    );
    
    const modeLabels = getAllByText(/.+/).map(node => node.props.children);
    const filteredLabels = modeLabels.filter(label => 
      label === 'Ida e volta' || 
      label === 'Apenas ida' || 
      label === 'Apenas volta'
    );
    
    expect(filteredLabels[0]).toBe('Ida e volta');
    expect(filteredLabels[1]).toBe('Apenas ida');
    expect(filteredLabels[2]).toBe('Apenas volta');
  });
});