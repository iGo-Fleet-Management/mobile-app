import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import InputText from '../InputText'; // Ajuste o caminho conforme a localização do componente

describe('InputText Component', () => {
  test('renders correctly with default props', () => {
    const { getByPlaceholderText } = render(
      <InputText placeholder="Test placeholder" />
    );
    
    const input = getByPlaceholderText('Test placeholder');
    expect(input).toBeTruthy();
  });
  
  test('displays label when provided', () => {
    const { getByText } = render(
      <InputText label="Email" placeholder="Enter email" />
    );
    
    const label = getByText('Email');
    expect(label).toBeTruthy();
  });
  
  test('calls onChangeText when text changes', () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <InputText 
        placeholder="Enter text" 
        onChangeText={mockOnChangeText} 
      />
    );
    
    const input = getByPlaceholderText('Enter text');
    fireEvent.changeText(input, 'new value');
    
    expect(mockOnChangeText).toHaveBeenCalledWith('new value');
  });
  
  test('displays error message when error prop is provided', () => {
    const errorMessage = 'This field is required';
    const { getByText } = render(
      <InputText 
        placeholder="Test input" 
        error={errorMessage} 
      />
    );
    
    const errorText = getByText(errorMessage);
    expect(errorText).toBeTruthy();
  });
  
  test('applies error styles when error prop is provided', () => {
    const { getByPlaceholderText } = render(
      <InputText 
        placeholder="Test input" 
        error="Error message" 
      />
    );
    
    const input = getByPlaceholderText('Test input');
    const inputContainer = input.parent.parent;
    
    // Verifica se o estilo de erro está aplicado
    expect(inputContainer.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ borderColor: expect.anything() })
      ])
    );
  });
  
  test('disables input when disabled prop is true', () => {
    const { getByPlaceholderText } = render(
      <InputText 
        placeholder="Test input" 
        disabled={true} 
      />
    );
    
    const input = getByPlaceholderText('Test input');
    expect(input.props.editable).toBe(false);
  });
  
  test('applies disabled styles when disabled prop is true', () => {
    const { getByPlaceholderText } = render(
      <InputText 
        placeholder="Test input" 
        disabled={true} 
      />
    );
    
    const input = getByPlaceholderText('Test input');
    const inputContainer = input.parent.parent;
    
    // Verifica se o estilo de desabilitado está aplicado
    expect(inputContainer.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: expect.anything() })
      ])
    );
  });
  
  test('applies loading styles when loading prop is true', () => {
    const { getByPlaceholderText } = render(
      <InputText 
        placeholder="Test input" 
        loading={true} 
      />
    );
    
    const input = getByPlaceholderText('Test input');
    const inputContainer = input.parent.parent;
    
    // Verifica se o estilo de carregamento está aplicado
    expect(inputContainer.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: expect.anything() })
      ])
    );
  });
  
  test('forwards ref to TextInput component', () => {
    const ref = React.createRef();
    render(<InputText ref={ref} placeholder="Test input" />);
    
    expect(ref.current).not.toBeNull();
  });
  
  test('passes custom styles to container', () => {
    const customStyle = { marginTop: 20 };
    const { getByPlaceholderText } = render(
      <InputText 
        placeholder="Test input" 
        style={customStyle} 
      />
    );
    
    const input = getByPlaceholderText('Test input');
    const container = input.parent.parent.parent;
    
    expect(container.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining(customStyle)
      ])
    );
  });
  
  test('passes custom styles to input', () => {
    const customInputStyle = { fontSize: 20 };
    const { getByPlaceholderText } = render(
      <InputText 
        placeholder="Test input" 
        inputStyle={customInputStyle} 
      />
    );
    
    const input = getByPlaceholderText('Test input');
    
    expect(input.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining(customInputStyle)
      ])
    );
  });
  
  test('applies secureTextEntry prop to TextInput', () => {
    const { getByPlaceholderText } = render(
      <InputText 
        placeholder="Password" 
        secureTextEntry={true} 
      />
    );
    
    const input = getByPlaceholderText('Password');
    expect(input.props.secureTextEntry).toBe(true);
  });
  
  test('applies keyboardType prop to TextInput', () => {
    const { getByPlaceholderText } = render(
      <InputText 
        placeholder="Email" 
        keyboardType="email-address" 
      />
    );
    
    const input = getByPlaceholderText('Email');
    expect(input.props.keyboardType).toBe('email-address');
  });
  
  test('applies autoCapitalize prop to TextInput', () => {
    const { getByPlaceholderText } = render(
      <InputText 
        placeholder="Name" 
        autoCapitalize="words" 
      />
    );
    
    const input = getByPlaceholderText('Name');
    expect(input.props.autoCapitalize).toBe('words');
  });
  
  test('passes additional props to TextInput', () => {
    const testID = 'test-input';
    const { getByTestId } = render(
      <InputText 
        placeholder="Test" 
        testID={testID} 
      />
    );
    
    expect(getByTestId(testID)).toBeTruthy();
  });
});