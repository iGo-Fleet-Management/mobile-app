import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AboutScreen from '../AboutScreen';
import { FontAwesome5 } from '@expo/vector-icons';

// Mock da navegação
const mockNavigation = {
  goBack: jest.fn(),
};

// Mock do Header
jest.mock('../../../components/common/Header', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return ({ title, onArrowBackPress }) => (
    <View testID="header">
      <TouchableOpacity testID="backButton" onPress={onArrowBackPress}>
        <Text>{title}</Text>
      </TouchableOpacity>
    </View>
  );
});

// Mock dos ícones
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    FontAwesome5: jest.fn(({ name, size, color, testID }) => {
      return <View testID={testID || `icon-${name}`} />;
    }),
  };
});

describe('Tela Sobre', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar corretamente todos os elementos', () => {
    const { getByText, getByTestId } = render(
      <AboutScreen navigation={mockNavigation} />
    );

    expect(getByText('Sobre o iGO')).toBeTruthy();
    expect(getByText('iGO')).toBeTruthy();
    expect(getByText('Versão 1.0.0')).toBeTruthy();
    expect(getByText('Acompanhamento em tempo real')).toBeTruthy();
    expect(getByTestId('icon-map-marked-alt')).toBeTruthy();
  });

  it('deve aplicar os estilos corretamente', () => {
    const { getByText } = render(
      <AboutScreen navigation={mockNavigation} />
    );

    const title = getByText('iGO');
    expect(title).toHaveStyle({
      fontSize: 22,
      fontWeight: 'bold',
      color: '#3f51b5',
      textAlign: 'center'
    });

    const version = getByText('Versão 1.0.0');
    expect(version).toHaveStyle({
      fontSize: 14,
      color: '#757575',
      textAlign: 'center',
      marginBottom: 20
    });
  });

  it('deve voltar para tela anterior quando botão de voltar é pressionado', () => {
    const { getByTestId } = render(
      <AboutScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByTestId('backButton'));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('deve exibir o item de feature com estilo correto', () => {
    const { getByText } = render(
      <AboutScreen navigation={mockNavigation} />
    );

    const featureItem = getByText('Acompanhamento em tempo real').parent;
    expect(featureItem).toHaveStyle({
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15
    });
  });

  it('deve corresponder ao snapshot', () => {
    const { toJSON } = render(
      <AboutScreen navigation={mockNavigation} />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});