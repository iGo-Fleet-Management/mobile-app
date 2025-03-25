import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PassageirosScreen from '../src/screens/PassageirosScreen';

describe('PassageirosScreen', () => {
  it('renders screen title', () => {
    const { getByText } = render(<PassageirosScreen />);
    expect(getByText('Passageiros')).toBeTruthy();
  });

  it('renders search input', () => {
    const { getByPlaceholderText } = render(<PassageirosScreen />);
    expect(getByPlaceholderText('Procurar passageiro')).toBeTruthy();
  });

  it('displays all passengers initially', () => {
    const { getByText } = render(<PassageirosScreen />);
    
    const passengers = [
      'Hugo de Melo Carvalho',
      'Iago Carro Guimarães',
      'Lucas Barcelos Gomes',
      'Paulo Henrique Reis',
      'Rafael Galinari',
      'Samuel Andrade'
    ];

    passengers.forEach(passenger => {
      expect(getByText(passenger)).toBeTruthy();
    });
  });

  it('filters passengers based on search input', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<PassageirosScreen />);
    
    const searchInput = getByPlaceholderText('Procurar passageiro');
    
    // Search for a specific passenger
    fireEvent.changeText(searchInput, 'Hugo');
    expect(getByText('Hugo de Melo Carvalho')).toBeTruthy();
    expect(queryByText('Iago Carro Guimarães')).toBeNull();
  });

  it('renders "Adicionar passageiro" button', () => {
    const { getByText } = render(<PassageirosScreen />);
    expect(getByText('Adicionar passageiro')).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<PassageirosScreen />);
    expect(toJSON()).toMatchSnapshot();
  });
});