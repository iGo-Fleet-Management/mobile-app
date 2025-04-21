import React from 'react';
import { render, fireEvent, getAllByTestId } from '@testing-library/react-native';
import { View } from 'react-native';
import EditAddressesScreen from '../EditAddressesScreen';

// Mock da navegação
const mockNavigation = {
  goBack: jest.fn(),
};

// Mock dos ícones
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialIcons: jest.fn(({ name, testID }) => {
      return <View testID={testID || `icon-${name}`} />;
    }),
  };
});

describe('EditAddressesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial values', () => {
    const { getByText, getByDisplayValue, getByTestId } = render(
      <EditAddressesScreen navigation={mockNavigation} />
    );

    expect(getByText('Endereço(s):')).toBeTruthy();
    expect(getByText('CEP')).toBeTruthy();
    expect(getByDisplayValue('35123-000')).toBeTruthy();
    expect(getByTestId('icon-chevron-left')).toBeTruthy();
  });
  

  it('updates address fields when typing', () => {
    const { getByDisplayValue } = render(
      <EditAddressesScreen navigation={mockNavigation} />
    );

    const logradouroInput = getByDisplayValue('Rua');
    fireEvent.changeText(logradouroInput, 'Avenida Principal');
    expect(logradouroInput.props.value).toBe('Avenida Principal');
  });

  it('navigates back when back button is pressed', () => {
    const { getByTestId } = render(
      <EditAddressesScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByTestId('icon-chevron-left'));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('navigates back when save button is pressed', () => {
    const { getByText } = render(
      <EditAddressesScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByText('Salvar'));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('displays info icons for relevant fields', () => {
    const { getAllByTestId } = render(
      <EditAddressesScreen navigation={mockNavigation} />
    );

    const infoIcons = getAllByTestId('icon-info-outline');
    expect(infoIcons.length).toBe(3);
  });
});