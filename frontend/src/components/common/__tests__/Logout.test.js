import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LogoutConfirmation from '../Logout';

// Mock para a Modal do React Native
jest.mock('react-native/Libraries/Modal/Modal', () => {
  const { View } = require('react-native');
  return props => {
    return (
      <View testID="modal" visible={props.visible}>
        {props.visible ? props.children : null}
      </View>
    );
  };
});

describe('Componente LogoutConfirmation', () => {
  // Mock para as funções de callback
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('não renderiza conteúdo quando visible é false', () => {
    const { queryByText } = render(
      <LogoutConfirmation 
        visible={false} 
        onConfirm={mockOnConfirm} 
        onCancel={mockOnCancel} 
      />
    );
    
    // Verificar que o texto do modal não está presente
    expect(queryByText('Tem certeza que deseja sair?')).toBeNull();
  });

  it('renderiza conteúdo quando visible é true', () => {
    const { getByText } = render(
      <LogoutConfirmation 
        visible={true} 
        onConfirm={mockOnConfirm} 
        onCancel={mockOnCancel} 
      />
    );
    
    // Verificar que o texto do modal está presente
    expect(getByText('Tem certeza que deseja sair?')).toBeTruthy();
  });

  it('renderiza os botões de confirmação e cancelamento', () => {
    const { getByText } = render(
      <LogoutConfirmation 
        visible={true} 
        onConfirm={mockOnConfirm} 
        onCancel={mockOnCancel} 
      />
    );
    
    // Verificar que os botões estão presentes
    expect(getByText('Sim')).toBeTruthy();
    expect(getByText('Não')).toBeTruthy();
  });

  it('chama onConfirm quando o botão Sim é pressionado', () => {
    const { getByText } = render(
      <LogoutConfirmation 
        visible={true} 
        onConfirm={mockOnConfirm} 
        onCancel={mockOnCancel} 
      />
    );
    
    // Simular clique no botão de confirmação
    fireEvent.press(getByText('Sim'));
    
    // Verificar se onConfirm foi chamado
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnCancel).not.toHaveBeenCalled();
  });

  it('chama onCancel quando o botão Não é pressionado', () => {
    const { getByText } = render(
      <LogoutConfirmation 
        visible={true} 
        onConfirm={mockOnConfirm} 
        onCancel={mockOnCancel} 
      />
    );
    
    // Simular clique no botão de cancelamento
    fireEvent.press(getByText('Não'));
    
    // Verificar se onCancel foi chamado
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('possui estilos corretos para os textos dos botões', () => {
    const { getByText } = render(
      <LogoutConfirmation 
        visible={true} 
        onConfirm={mockOnConfirm} 
        onCancel={mockOnCancel} 
      />
    );
    
    const confirmButtonText = getByText('Sim');
    const cancelButtonText = getByText('Não');
    
    // Verificar se os estilos dos textos dos botões estão sendo aplicados
    expect(confirmButtonText.props.style).toEqual(
      expect.objectContaining({ 
        color: 'white',
        fontWeight: 'bold' 
      })
    );
    
    expect(cancelButtonText.props.style).toEqual(
      expect.objectContaining({ 
        color: '#333',
        fontWeight: 'bold' 
      })
    );
  });

  it('possui o título com estilo correto', () => {
    const { getByText } = render(
      <LogoutConfirmation 
        visible={true} 
        onConfirm={mockOnConfirm} 
        onCancel={mockOnCancel} 
      />
    );
    
    const title = getByText('Tem certeza que deseja sair?');
    
    // Verificar se o estilo do título está sendo aplicado
    expect(title.props.style).toEqual(
      expect.objectContaining({ 
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20
      })
    );
  });

});