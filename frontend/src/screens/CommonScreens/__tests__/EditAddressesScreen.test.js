import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import EditAddressesScreen from '../EditAddressesScreen';
import { checkAuthAndRedirect, authHeader } from '../../../auth/AuthService';
import { API_IGO } from '@env';

// Mock do InputCep
jest.mock('../../../components/common/InputCep', () => {
  const { TextInput } = require('react-native');
  return {
    InputCep: (props) => <TextInput testID="inputCep" {...props} />
  };
});

jest.mock('../../../auth/AuthService', () => ({
  checkAuthAndRedirect: jest.fn(),
  authHeader: jest.fn()
}));

jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons'
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: View,
    useSafeAreaInsets: jest.fn(() => ({ top: 0, right: 0, bottom: 0, left: 0 }))
  };
});

// Mock the InputCep component
jest.mock('../../../components/common/InputCep', () => {
  const { TextInput } = require('react-native');
  return {
    InputCep: (props) => <TextInput testID="inputCep" {...props} />
  };
});

// Mock fetch
global.fetch = jest.fn();

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
  if (buttons && buttons.length > 0 && buttons[0].onPress) {
    buttons[0].onPress();
  }
});

describe('EditAddressesScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mocks for auth functions
    checkAuthAndRedirect.mockResolvedValue(true);
    authHeader.mockResolvedValue({
      'Authorization': 'Bearer test-token'
    });
    
    // Default fetch response for profile data
    global.fetch.mockImplementation((url) => {
      if (url === `${API_IGO}profile`) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            success: true,
            data: {
              addresses: [{
                address_id: '123',
                address_type: 'Casa',
                cep: '12345-678',
                street: 'Rua Teste',
                number: '123',
                complement: 'Apto 101',
                neighbourhood: 'Bairro',
                city: 'Cidade',
                state: 'SP'
              }]
            }
          }),
          headers: {
            get: () => 'application/json'
          }
        });
      }
      return Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ success: false }),
        headers: {
          get: () => 'application/json'
        }
      });
    });
  });

  it('renders loading state initially', async () => {
    const { getByText, queryByText } = render(
      <EditAddressesScreen navigation={mockNavigation} />
    );

    expect(getByText('Carregando dados do endereço...')).toBeTruthy();
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(queryByText('Carregando dados do endereço...')).toBeNull();
    });
  });
  
  it('loads address data on mount', async () => {
    const { getByText, getByTestId } = render(
      <EditAddressesScreen navigation={mockNavigation} />
    );
    
    await waitFor(() => {
      expect(getByText('Editar Endereços')).toBeTruthy();
    });
    
    expect(global.fetch).toHaveBeenCalledWith(`${API_IGO}profile`, {
      method: 'GET',
      headers: { 'Authorization': 'Bearer test-token' }
    });
  });

  it('handles address type switching', async () => {
    // Mock two different address types
    global.fetch.mockImplementationOnce((url) => {
      if (url === `${API_IGO}profile`) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            success: true,
            data: {
              addresses: [
                {
                  address_id: '123',
                  address_type: 'Casa',
                  cep: '12345-678',
                  street: 'Rua Teste',
                  number: '123',
                  complement: 'Apto 101',
                  neighbourhood: 'Bairro',
                  city: 'Cidade',
                  state: 'SP'
                },
                {
                  address_id: '456',
                  address_type: 'Outro',
                  cep: '87654-321',
                  street: 'Av. Exemplo',
                  number: '456',
                  complement: 'Sala 202',
                  neighbourhood: 'Centro',
                  city: 'Outra Cidade',
                  state: 'RJ'
                }
              ]
            }
          }),
          headers: {
            get: () => 'application/json'
          }
        });
      }
    });

    const { getByText, queryByTestId } = render(
      <EditAddressesScreen navigation={mockNavigation} />
    );
    
    await waitFor(() => {
      expect(getByText('Editar Endereços')).toBeTruthy();
    });
    
    // Switch to "Outro" address type
    fireEvent.press(getByText('Outro'));
    
    await waitFor(() => {
      const inputCep = queryByTestId('inputCep');
      // Check if the address type switch worked
      expect(inputCep.props.value).toBe('87654-321');
    });
  });

  it('validates form fields before saving', async () => {
    const { getByText, getAllByText } = render(
      <EditAddressesScreen navigation={mockNavigation} />
    );
    
    await waitFor(() => {
      expect(getByText('Editar Endereços')).toBeTruthy();
    });
    
    // Try to save with empty fields (mock an empty address)
    global.fetch.mockImplementationOnce((url) => {
      if (url === `${API_IGO}profile`) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            success: true,
            data: {
              addresses: [{
                address_id: '123',
                address_type: 'Casa',
                cep: '',
                street: '',
                number: '',
                complement: '',
                neighbourhood: '',
                city: '',
                state: ''
              }]
            }
          }),
          headers: {
            get: () => 'application/json'
          }
        });
      }
    });
    
    // Re-render with empty fields
    await act(async () => {
      await waitFor(() => {
        fireEvent.press(getByText('Salvar Endereço'));
      });
    });
    
    // Validation alert should be shown
    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Por favor, preencha todos os campos obrigatórios.');
  });

  it('handles CEP search correctly', async () => {
    // Mock the ViaCEP API response
    global.fetch.mockImplementation((url) => {
      if (url.includes('viacep.com.br')) {
        return Promise.resolve({
          json: () => Promise.resolve({
            cep: '12345-678',
            logradouro: 'Rua Nova',
            bairro: 'Bairro Novo',
            localidade: 'Nova Cidade',
            uf: 'MG'
          })
        });
      }
      
      // Default profile response
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          success: true,
          data: {
            addresses: [{
              address_id: '123',
              address_type: 'Casa',
              cep: '12345-678',
              street: '',
              number: '',
              complement: '',
              neighbourhood: '',
              city: '',
              state: ''
            }]
          }
        }),
        headers: {
          get: () => 'application/json'
        }
      });
    });

    const { getByTestId } = render(
      <EditAddressesScreen navigation={mockNavigation} />
    );
    
    await waitFor(() => {
      expect(getByTestId('inputCep')).toBeTruthy();
    });
    
    // Trigger search CEP
    fireEvent(getByTestId('inputCep'), 'onSearch');
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('viacep.com.br'),
        expect.any(Object)
      );
    });
  });

  it('successfully saves address data', async () => {
    // Mock successful update response
    global.fetch.mockImplementation((url) => {
      if (url === `${API_IGO}profile/update-address`) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            success: true,
            message: 'Endereço atualizado com sucesso'
          }),
          headers: {
            get: () => 'application/json'
          }
        });
      }
      
      // Default profile response
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          success: true,
          data: {
            addresses: [{
              address_id: '123',
              address_type: 'Casa',
              cep: '12345-678',
              street: 'Rua Teste',
              number: '123',
              complement: 'Apto 101',
              neighbourhood: 'Bairro',
              city: 'Cidade',
              state: 'SP'
            }]
          }
        }),
        headers: {
          get: () => 'application/json'
        }
      });
    });

    const { getByText } = render(
      <EditAddressesScreen navigation={mockNavigation} />
    );
    
    await waitFor(() => {
      expect(getByText('Editar Endereços')).toBeTruthy();
    });
    
    // Submit the form
    fireEvent.press(getByText('Salvar Endereço'));
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_IGO}profile/update-address`,
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token'
          })
        })
      );
      
      expect(Alert.alert).toHaveBeenCalledWith(
        'Sucesso',
        'Endereço atualizado com sucesso!',
        expect.anything()
      );
      
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });
  
  it('handles API errors when saving address', async () => {
    // Mock API error response
    global.fetch.mockImplementation((url) => {
      if (url === `${API_IGO}profile/update-address`) {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({
            success: false,
            message: 'Erro interno do servidor'
          }),
          headers: {
            get: () => 'application/json'
          }
        });
      }
      
      // Default profile response
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          success: true,
          data: {
            addresses: [{
              address_id: '123',
              address_type: 'Casa',
              cep: '12345-678',
              street: 'Rua Teste',
              number: '123',
              complement: 'Apto 101',
              neighbourhood: 'Bairro',
              city: 'Cidade',
              state: 'SP'
            }]
          }
        }),
        headers: {
          get: () => 'application/json'
        }
      });
    });

    const { getByText } = render(
      <EditAddressesScreen navigation={mockNavigation} />
    );
    
    await waitFor(() => {
      expect(getByText('Editar Endereços')).toBeTruthy();
    });
    
    // Submit the form
    fireEvent.press(getByText('Salvar Endereço'));
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Erro',
        'Erro interno do servidor'
      );
    });
  });

  it('handles unauthorized error and redirects', async () => {
    // Mock 401 unauthorized response
    global.fetch.mockImplementation((url) => {
      return Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.resolve({
          success: false,
          message: 'Não autorizado'
        }),
        headers: {
          get: () => 'application/json'
        }
      });
    });

    // Mock checkAuthAndRedirect to handle the 401
    checkAuthAndRedirect.mockResolvedValueOnce(true).mockResolvedValueOnce(false);

    const { getByText } = render(
      <EditAddressesScreen navigation={mockNavigation} />
    );
    
    await waitFor(() => {
      expect(getByText('Editar Endereços')).toBeTruthy();
    });
    
    // Submit the form to trigger the 401 error
    fireEvent.press(getByText('Salvar Endereço'));
    
    await waitFor(() => {
      // Check if checkAuthAndRedirect was called to handle the 401
      expect(checkAuthAndRedirect).toHaveBeenCalledTimes(2);
    });
  });
  
  it('handles network errors gracefully', async () => {
    // Mock network error
    global.fetch.mockImplementationOnce(() => {
      return Promise.reject(new Error('Network request failed'));
    });

    const { getByText } = render(
      <EditAddressesScreen navigation={mockNavigation} />
    );
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Erro de Conexão',
        'Verifique sua conexão com a internet e tente novamente.'
      );
    });
  });

  it('handles back button press', async () => {
    const { getByText } = render(
      <EditAddressesScreen navigation={mockNavigation} />
    );
    
    await waitFor(() => {
      expect(getByText('Editar Endereços')).toBeTruthy();
    });
    
    // Get back button by MaterialIcons mock
    const backButton = getByText('Editar Endereços').parentNode.children[0];
    fireEvent.press(backButton);
    
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});