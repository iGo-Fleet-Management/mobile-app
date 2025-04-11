import React from 'react';
import { render } from '@testing-library/react-native';
import BottomUserBar from '../BottomUserBar';
import { MaterialIcons } from '@expo/vector-icons';


jest.mock('../../common/UserIcon', () => 'UserIcon');


jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
}));

describe('BottomUserBar', () => {
  it('renderiza corretamente', () => {
    const { getByText } = render(<BottomUserBar userName="João Silva" />);
    expect(getByText('Próximo a embarcar:')).toBeTruthy();
    expect(getByText('João Silva')).toBeTruthy();
  });

  it('mostra o nome do usuário correto', () => {
    const { getByText, rerender } = render(<BottomUserBar userName="João Silva" />);
    expect(getByText('João Silva')).toBeTruthy();
    

    rerender(<BottomUserBar userName="Maria Souza" />);
    expect(getByText('Maria Souza')).toBeTruthy();
  });

  it('renderiza ícone de usuário', () => {
    const { UNSAFE_getByType } = render(<BottomUserBar userName="João Silva" />);
    

    const iconComponent = UNSAFE_getByType('MaterialIcons');
    expect(iconComponent).toBeTruthy();
  });

  it('renderiza corretamente sem nome de usuário', () => {
    const { getByText } = render(<BottomUserBar userName="" />);
    expect(getByText('Próximo a embarcar:')).toBeTruthy();
    expect(getByText('')).toBeTruthy();
  });

  it('mantém a estrutura correta de containers', () => {
    const { toJSON } = render(<BottomUserBar userName="João Silva" />);
    
 
    const tree = toJSON();
   
    expect(tree.type).toBe('View');
    
    expect(tree.children.length).toBeGreaterThanOrEqual(2);
    
    const userContainer = tree.children.find(child => 
      child.type === 'View' && child.props.style
    );
    expect(userContainer).toBeTruthy();
  });
});