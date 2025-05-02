import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import Card from '../Card'; // Ajuste o caminho conforme necessário

// Mock dos estilos globais
jest.mock('../../../styles/globalStyles', () => ({
  commonStyles: {
    card: {
      backgroundColor: '#ffffff',
      borderRadius: 8,
      padding: 16,
    },
  },
  colors: {
    primary: '#0066cc',
    secondary: '#333333',
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
  shadows: {
    medium: {
      elevation: 4,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
    },
  },
}));

describe('Card', () => {
  it('renderiza os filhos corretamente', () => {
    const { getByText } = render(
      <Card>
        <Text>Conteúdo do Card</Text>
      </Card>
    );
    
    expect(getByText('Conteúdo do Card')).toBeTruthy();
  });

  it('aplica o estilo padrão (default)', () => {
    const { UNSAFE_root } = render(<Card />);
    
    const cardView = UNSAFE_root.findByType('View');
    
    // Verifica se o estilo commonStyles.card é aplicado
    expect(cardView.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: '#ffffff',
          borderRadius: 8,
          padding: 16,
        })
      ])
    );
    
    // Verifica se o shadow NÃO é aplicado no variant default
    expect(cardView.props.style).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          elevation: 4,
        })
      ])
    );
  });

  it('aplica o estilo elevado quando variant é "elevated"', () => {
    const { UNSAFE_root } = render(<Card variant="elevated" />);
    
    const cardView = UNSAFE_root.findByType('View');
    
    // Verifica se o estilo common.card é aplicado
    expect(cardView.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: '#ffffff',
          borderRadius: 8,
          padding: 16,
        })
      ])
    );
    
    // Verifica se o shadow é aplicado
    expect(cardView.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          elevation: 4,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.23,
          shadowRadius: 2.62,
        })
      ])
    );
  });

  it('aplica estilos personalizados quando fornecidos', () => {
    const customStyle = { backgroundColor: 'red', marginTop: 20 };
    const { UNSAFE_root } = render(<Card style={customStyle} />);
    
    const cardView = UNSAFE_root.findByType('View');
    
    // Verifica se o estilo personalizado é aplicado
    expect(cardView.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining(customStyle)
      ])
    );
  });

  it('combina estilos corretamente para variant elevated com estilo personalizado', () => {
    const customStyle = { backgroundColor: 'red', marginTop: 20 };
    const { UNSAFE_root } = render(<Card variant="elevated" style={customStyle} />);
    
    const cardView = UNSAFE_root.findByType('View');
    
    // Verifica se o estilo padrão, shadow e personalizado são aplicados
    expect(cardView.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: '#ffffff',
          borderRadius: 8,
          padding: 16,
        }),
        expect.objectContaining({
          elevation: 4,
          shadowColor: '#000000',
        }),
        expect.objectContaining(customStyle)
      ])
    );
  });
});