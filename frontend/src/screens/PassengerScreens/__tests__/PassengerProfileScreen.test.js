import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import PassengerProfileScreen from '../PassengerProfileScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock do módulo @env com sua URL real
jest.mock('../../../../env', () => ({
  API_IGO: 'https://backend-igo.onrender.com/api/'
}));
// Mock do navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

// Mock da resposta da API
const mockUserData = {
  success: true,
  data: {
    name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone: '11999999999',
    birth_date: '1990-01-01',
    addresses: [
      {
        address_type: 'Casa',
        street: 'Rua das Flores',
        number: '123',
        neighbourhood: 'Centro',
        city: 'São Paulo',
      },
    ],
  },
};

describe('PassengerProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue('mock-token');
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUserData),
      })
    );
  });

  it('should render loading state initially', () => {
    const { getByTestId } = render(
      <PassengerProfileScreen navigation={mockNavigation} />
    );
    
    expect(getByTestId('skeleton-loader')).toBeTruthy();
  });

  it('should fetch and display user profile data', async () => {
    const { findByText } = render(
      <PassengerProfileScreen navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://backend-igo.onrender.com/api/profile',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer mock-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    expect(await findByText('John Doe')).toBeTruthy();
    expect(await findByText('Passageiro')).toBeTruthy();
    expect(await findByText('john.doe@example.com')).toBeTruthy();
  });

  it('should handle API error', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Network error'))
    );

    const { findByText } = render(
      <PassengerProfileScreen navigation={mockNavigation} />
    );

    expect(await findByText(/Erro ao carregar perfil/)).toBeTruthy();
    expect(await findByText('Tentar novamente')).toBeTruthy();
  });

  it('should allow retrying after error', async () => {
    global.fetch = jest.fn()
      .mockRejectedValueOnce(new Error('First error'))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUserData),
      });

    const { findByText, getByText } = render(
      <PassengerProfileScreen navigation={mockNavigation} />
    );

    const retryButton = await findByText('Tentar novamente');
    fireEvent.press(retryButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(getByText('John Doe')).toBeTruthy();
    });
  });

  it('should navigate to EditProfile with user data', async () => {
    const { findByText } = render(
      <PassengerProfileScreen navigation={mockNavigation} />
    );

    await waitFor(() => {}); // Wait for data to load

    const editButton = await findByText('Editar Perfil');
    fireEvent.press(editButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('EditProfile', {
      userData: mockUserData.data,
    });
  });

  it('should show logout confirmation modal', async () => {
    const { findByText, getByText } = render(
      <PassengerProfileScreen navigation={mockNavigation} />
    );

    await waitFor(() => {}); // Wait for data to load

    const logoutButton = await findByText('Sair');
    fireEvent.press(logoutButton);

    expect(getByText('Confirmar logout')).toBeTruthy();
  });

  it('should handle logout confirmation', async () => {
    const { findByText } = render(
      <PassengerProfileScreen navigation={mockNavigation} />
    );

    await waitFor(() => {}); // Wait for data to load

    const logoutButton = await findByText('Sair');
    fireEvent.press(logoutButton);

    // Simulate confirming logout
    await act(async () => {
      fireEvent.press(await findByText('Confirmar'));
    });

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('userToken');
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
  });

  it('should calculate age correctly', async () => {
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 30, today.getMonth(), today.getDate());
    const birthDateString = birthDate.toISOString().split('T')[0];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          ...mockUserData,
          data: {
            ...mockUserData.data,
            birth_date: birthDateString,
          },
        }),
      })
    );

    const { findByText } = render(
      <PassengerProfileScreen navigation={mockNavigation} />
    );

    expect(await findByText('30 anos')).toBeTruthy();
  });
});