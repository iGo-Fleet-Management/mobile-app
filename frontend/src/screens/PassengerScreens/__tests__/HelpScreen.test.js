import React from 'react';
import { render } from '@testing-library/react-native';
import HelpScreen from '../HelpScreen';

// Mocks atualizados
jest.mock('../../../components/common/Header', () => {
  const { Text, View } = require('react-native');
  return ({ title }) => (
    <View>
      <Text>{title}</Text>
    </View>
  );
});

jest.mock('../../../components/help/HelpItem', () => {
  const { Text, View } = require('react-native');
  return ({ title }) => (
    <View>
      <Text>{title}</Text>
    </View>
  );
});

jest.mock('../../../components/help/ContactSection', () => {
  const { Text, View } = require('react-native');
  return () => (
    <View>
      <Text>Contatar Suporte</Text>
    </View>
  );
});

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 })
}));

describe('HelpScreen', () => {
  const mockNavigation = { goBack: jest.fn() };

  it('deve renderizar o título principal', () => {
    const { getByText } = render(
      <HelpScreen navigation={mockNavigation} />
    );
    expect(getByText('Central de Ajuda')).toBeTruthy();
  });

  it('deve renderizar os itens de ajuda', () => {
    const { getByText } = render(
      <HelpScreen navigation={mockNavigation} />
    );
    expect(getByText('Acompanhamento em tempo real')).toBeTruthy();
    expect(getByText('Status \'Liberado\'')).toBeTruthy();
  });

  it('deve renderizar a seção de contato', () => {
    const { getByText } = render(
      <HelpScreen navigation={mockNavigation} />
    );
    expect(getByText('Contatar Suporte')).toBeTruthy();
  });
});