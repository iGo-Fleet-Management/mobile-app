import React from 'react';
import { render } from '@testing-library/react-native';
import DateCard from '../DateCard';
import TravelModeSelector from '../TravelModeSelector';

jest.mock('../TravelModeSelector', () => {
  return jest.fn(() => null);
});

describe('DateCard', () => {
  const defaultProps = {
    dayOfWeek: 'Segunda',
    date: '12/04/2025',
    selectedMode: 'car',
    onSelectMode: jest.fn()
  };

  beforeEach(() => {

    jest.clearAllMocks();
  });

  it('renderiza corretamente com as props fornecidas', () => {
    const { getByText } = render(<DateCard {...defaultProps} />);
    
    expect(getByText('Segunda')).toBeTruthy();
    expect(getByText('12/04/2025')).toBeTruthy();
  });

  it('renderiza com valores diferentes para dayOfWeek e date', () => {
    const altProps = {
      ...defaultProps,
      dayOfWeek: 'Terça',
      date: '13/04/2025'
    };
    
    const { getByText } = render(<DateCard {...altProps} />);
    
    expect(getByText('Terça')).toBeTruthy();
    expect(getByText('13/04/2025')).toBeTruthy();
  });

  it('passa as props corretas para o TravelModeSelector', () => {
    render(<DateCard {...defaultProps} />);
    
    expect(TravelModeSelector).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedMode: 'car',
        onSelectMode: expect.any(Function)
      }),
      expect.anything()
    );
  });

  it('passa função onSelectMode que funciona corretamente', () => {
    render(<DateCard {...defaultProps} />);
    
    const passedProps = TravelModeSelector.mock.calls[0][0];
    
    passedProps.onSelectMode('bus');
    

    expect(defaultProps.onSelectMode).toHaveBeenCalledWith('bus');
  });

  it('renderiza com um modo de viagem diferente', () => {
    const altProps = {
      ...defaultProps,
      selectedMode: 'bus'
    };
    
    render(<DateCard {...altProps} />);
    

    expect(TravelModeSelector).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedMode: 'bus'
      }),
      expect.anything()
    );
  });
});