import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import StatusSwitch from '../StatusSwitch'; 

jest.mock('../../common/IconButton', () => {
  return jest.fn(({ onPress, name }) => (
    <mockIconButton testID="icon-button" onPress={onPress} name={name} />
  ));
});

describe('StatusSwitch', () => {
  const mockOnValueChange = jest.fn();
  const mockOnHelpPress = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza corretamente com valor true', () => {
    const { getByText, getByTestId } = render(
      <StatusSwitch 
        value={true} 
        onValueChange={mockOnValueChange} 
        onHelpPress={mockOnHelpPress} 
      />
    );
    
    expect(getByText('Liberado')).toBeTruthy();
    

    const switchComponent = getByTestId('icon-button').parent.parent.children[0];
    expect(switchComponent).toBeTruthy();
  });

  it('renderiza corretamente com valor false', () => {
    const { getByText } = render(
      <StatusSwitch 
        value={false} 
        onValueChange={mockOnValueChange} 
        onHelpPress={mockOnHelpPress} 
      />
    );
    
    expect(getByText('Liberado')).toBeTruthy();
  });

  it('chama onValueChange quando o Switch é alterado', () => {
    const { UNSAFE_getByType } = render(
      <StatusSwitch 
        value={false} 
        onValueChange={mockOnValueChange} 
        onHelpPress={mockOnHelpPress} 
      />
    );
    
    // Como o Switch não tem testID padrão, usamos UNSAFE_getByType para encontrá-lo
    const switchElement = UNSAFE_getByType('RCTSwitch');
    fireEvent(switchElement, 'valueChange', true);
    
    expect(mockOnValueChange).toHaveBeenCalledWith(true);
  });

  it('chama onHelpPress quando o IconButton é clicado', () => {
    const { getByTestId } = render(
      <StatusSwitch 
        value={true} 
        onValueChange={mockOnValueChange} 
        onHelpPress={mockOnHelpPress} 
      />
    );
    
    const iconButton = getByTestId('icon-button');
    fireEvent.press(iconButton);
    
    expect(mockOnHelpPress).toHaveBeenCalled();
  });


});