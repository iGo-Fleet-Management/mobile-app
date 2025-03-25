import React from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DashboardScreen from '../DashboardScreen';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
};

describe('DashboardScreen', () => {
  it('renders dashboard screen correctly', () => {
    const { getByText } = render(
      <SafeAreaProvider>
        <DashboardScreen navigation={mockNavigation} />
      </SafeAreaProvider>
    );
    
    expect(getByText('Bem-vindo ao Dashboard')).toBeTruthy();
  });

  // Add more dashboard-specific tests as needed
});