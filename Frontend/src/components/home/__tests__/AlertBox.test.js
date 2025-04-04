import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AlertBox from '../AlertBox';

// Mock do componente MaterialIcons para os testes
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
}));

describe('AlertBox', () => {
  it('renderiza corretamente com a mensagem fornecida', () => {
    const message = 'Erro de conexão';
    const { getByText } = render(<AlertBox message={message} />);
    
    expect(getByText(message)).toBeTruthy();
  });

  it('não renderiza o botão de edição quando onEditPress não é fornecido', () => {
    const { queryByTestId } = render(
      <AlertBox message="Mensagem de teste" />
    );
    
    // Adicione um testID no TouchableOpacity ou verifique outro método
    const editButton = queryByTestId('edit-button');
    expect(editButton).toBeNull();
  });



  it('renderiza o ícone de erro', () => {
    const { UNSAFE_getAllByType } = render(
      <AlertBox message="Mensagem de teste" />
    );
    
    const icons = UNSAFE_getAllByType('MaterialIcons');
    expect(icons.length).toBeGreaterThan(0);
    expect(icons[0].props.name).toBe('error-outline');
    expect(icons[0].props.color).toBe('red');
  });

  it('renderiza o ícone correto no botão de edição', () => {
    const onEditPressMock = jest.fn();
    const { UNSAFE_getAllByType } = render(
      <AlertBox message="Mensagem de teste" onEditPress={onEditPressMock} />
    );
    
    const icons = UNSAFE_getAllByType('MaterialIcons');
    expect(icons.length).toBe(2);
    expect(icons[1].props.name).toBe('error-outline');
    expect(icons[1].props.color).toBe('black');
  });

  it('passa as props corretamente para os componentes filhos', () => {
    const message = 'Mensagem de teste';
    const { getByText, UNSAFE_getAllByType } = render(
      <AlertBox message={message} onEditPress={() => {}} />
    );
    
    expect(getByText(message)).toBeTruthy();
    
    const icons = UNSAFE_getAllByType('MaterialIcons');
    expect(icons[0].props.size).toBe(24);
    expect(icons[1].props.size).toBe(20);
  });

});