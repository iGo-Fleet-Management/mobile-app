import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LogoutConfirmation from '../Logout';

describe('Logout', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();
  
  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    mockOnConfirm.mockClear();
    mockOnCancel.mockClear();
  });

  it('não deve renderizar quando visible é false', () => {
    const { queryByText } = render(
      <LogoutConfirmation 
        visible={false} 
        onConfirm={mockOnConfirm} 
        onCancel={mockOnCancel} 
      />
    );
    
    expect(queryByText('Tem certeza que deseja sair?')).toBeNull();
  });

  it('deve renderizar quando visible é true', () => {
    const { getByText } = render(
      <LogoutConfirmation 
        visible={true} 
        onConfirm={mockOnConfirm} 
        onCancel={mockOnCancel} 
      />
    );
    
    expect(getByText('Tem certeza que deseja sair?')).toBeTruthy();
    expect(getByText('Sim')).toBeTruthy();
    expect(getByText('Não')).toBeTruthy();
  });

  it('deve chamar onConfirm quando o botão Sim é pressionado', () => {
    const { getByText } = render(
      <LogoutConfirmation 
        visible={true} 
        onConfirm={mockOnConfirm} 
        onCancel={mockOnCancel} 
      />
    );
    
    const confirmButton = getByText('Sim');
    fireEvent.press(confirmButton);
    
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnCancel).not.toHaveBeenCalled();
  });

  it('deve chamar onCancel quando o botão Não é pressionado', () => {
    const { getByText } = render(
      <LogoutConfirmation 
        visible={true} 
        onConfirm={mockOnConfirm} 
        onCancel={mockOnCancel} 
      />
    );
    
    const cancelButton = getByText('Não');
    fireEvent.press(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('deve chamar onRequestClose (onCancel) quando o modal é fechado pelo sistema', () => {
    const { getByText, UNSAFE_getByProps } = render(
      <LogoutConfirmation 
        visible={true} 
        onConfirm={mockOnConfirm} 
        onCancel={mockOnCancel} 
      />
    );
    
    // Testa se o onRequestClose está configurado corretamente
    const modal = UNSAFE_getByProps({ animationType: 'fade' });
    fireEvent(modal, 'requestClose');
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

});