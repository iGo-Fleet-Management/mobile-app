import React from 'react';
import { render, screen } from '@testing-library/react-native';
import ActiveTripScreen from '../ActiveTripScreen'; // Ajuste o caminho conforme necessário

// Mock do componente DriverMapContainer
jest.mock('../../../components/home/DriverMapContainer', () => {
  return jest.fn(() => {
    return null;
  });
});

describe('ActiveTripScreen', () => {
  beforeEach(() => {
    // Limpa todas as chamadas de mock entre os testes
    jest.clearAllMocks();
  });

  it('renderiza corretamente', () => {
    render(<ActiveTripScreen />);
    // Verificamos se o componente foi renderizado sem erros
    expect(screen.toJSON()).toBeTruthy();
  });

  it('renderiza o componente DriverMapContainer', () => {
    const { UNSAFE_root } = render(<ActiveTripScreen />);
    
    // Verifica se o container principal existe
    const container = UNSAFE_root.findAllByType('View');
    expect(container.length).toBeGreaterThanOrEqual(1);

    // Verificamos se o DriverMapContainer foi chamado
    const DriverMapContainer = require('../../../components/home/DriverMapContainer');
    expect(DriverMapContainer).toHaveBeenCalled();
  });

  it('aplica o estilo correto ao container', () => {
    const { UNSAFE_root } = render(<ActiveTripScreen />);
    
    // Obtém o container principal
    const container = UNSAFE_root.findByType('View');
    
    // Verifica se tem o estilo flex: 1
    expect(container.props.style).toEqual(expect.objectContaining({ flex: 1 }));
  });
});