import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../Button'; // Ajuste o caminho conforme necessário

// Mock dos estilos globais
jest.mock('../../../styles/globalStyles', () => ({
  colors: {
    primary: '#0066cc',
    secondary: '#333333',
    white: '#ffffff',
    gray: {
      300: '#d1d5db',
      600: '#4b5563'
    }
  },
  spacing: {
    md: 12,
    lg: 16,
    xl: 20
  },
  typography: {
    fontWeights: {
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  }
}));

describe('Button', () => {
  it('renderiza um botão com o título correto', () => {
    const { getByText } = render(<Button title="Teste" />);
    expect(getByText('Teste')).toBeTruthy();
  });

  it('chama a função onPress quando pressionado', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button title="Teste" onPress={onPressMock} />);
    
    fireEvent.press(getByText('Teste').parent);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('não chama onPress quando o botão está desabilitado', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Teste" onPress={onPressMock} disabled={true} />
    );
    
    fireEvent.press(getByText('Teste').parent);
    expect(onPressMock).not.toHaveBeenCalled();
  });


  it('mostra um indicador de atividade quando loading é true', () => {
    const { UNSAFE_root } = render(<Button title="Teste" loading={true} />);
    
    const activityIndicator = UNSAFE_root.findByType('ActivityIndicator');
    expect(activityIndicator).toBeTruthy();
  });

  it('não mostra o texto quando loading é true', () => {
    const { queryByText } = render(<Button title="Teste" loading={true} />);
    
    expect(queryByText('Teste')).toBeFalsy();
  });



  
  it('aplica estilos personalizados no texto quando fornecidos', () => {
    const customTextStyle = { fontSize: 20, fontWeight: 'bold' };
    const { UNSAFE_root } = render(<Button title="Teste" textStyle={customTextStyle} />);
    
    const text = UNSAFE_root.findByType('Text');
    
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining(customTextStyle)
      ])
    );
  });

  it('tem a cor de indicador de carregamento correta para botões primários', () => {
    const { UNSAFE_root } = render(<Button title="Teste" loading={true} />);
    
    const activityIndicator = UNSAFE_root.findByType('ActivityIndicator');
    expect(activityIndicator.props.color).toBe('#ffffff'); // colors.white
  });

  it('tem a cor de indicador de carregamento correta para botões outline', () => {
    const { UNSAFE_root } = render(<Button title="Teste" loading={true} variant="outline" />);
    
    const activityIndicator = UNSAFE_root.findByType('ActivityIndicator');
    expect(activityIndicator.props.color).toBe('#0066cc'); // colors.primary
  });
});