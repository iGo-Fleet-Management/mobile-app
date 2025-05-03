import React from 'react';
import { Alert, ActivityIndicator } from 'react-native';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import EditProfileScreen from '../EditProfileScreen';
import * as AuthService from '../../../auth/AuthService';

// Nota: Ainda precisamos mockar alguns módulos básicos, já que estamos testando em Node.js, não em um dispositivo real
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn((key) => {
    if (key === 'userToken') return Promise.resolve('real-token-value');
    return Promise.resolve(null);
  }),
  setItem: jest.fn(() => Promise.resolve()),
}));

// Mock necessário para o ambiente de teste - não podemos fazer requisições HTTP reais em testes Jest
global.fetch = jest.fn();

// Mock mínimo para o Alert, já que não podemos mostrar alertas reais em ambiente de teste
jest.spyOn(Alert, 'alert');

describe('EditProfileScreen', () => {
  // Configuração para cada teste
  beforeEach(() => {
    // Preparar respostas realistas da API para simular o comportamento real
    fetch.mockImplementation((url, options) => {
      // Dados realistas que seriam retornados pela API
      if (url.includes('/profile') && options.method === 'GET') {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            success: true,
            data: {
              name: 'João',
              last_name: 'Silva',
              cpf: '12345678901',
              birthdate: '01/01/1990',
              email: 'joao.silva@exemplo.com',
              phone: '11987654321'
            }
          })
        });
      } 
      else if (url.includes('/profile/update-profile') && options.method === 'PUT') {
        // Verificar se os dados enviados são válidos
        const body = JSON.parse(options.body);
        if (body && body.userData && body.userData.name && body.userData.email) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({
              success: true,
              message: 'Perfil atualizado com sucesso!'
            })
          });
        } else {
          return Promise.resolve({
            ok: false,
            status: 400,
            json: () => Promise.resolve({
              success: false,
              message: 'Dados inválidos'
            })
          });
        }
      }
      
      // Resposta padrão para outras requisições
      return Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ success: false, message: 'Endpoint não encontrado' })
      });
    });
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza corretamente com os dados iniciais', async () => {
    // Criar um objeto navigation simples com as funções necessárias
    const navigation = {
      navigate: jest.fn(),
      goBack: jest.fn()
    };
    
    // Renderizar o componente com props mínimas
    const { getByText, findByText, getByPlaceholderText } = render(
      <EditProfileScreen navigation={navigation} />
    );
    
    // Verificar estado inicial - carregando
    expect(getByText('Carregando dados do perfil...')).toBeTruthy();
    
    // Esperar que os dados carreguem e o componente seja atualizado
    await waitFor(() => {
      expect(getByText('Editar Perfil')).toBeTruthy();
    });
    
    // Verificar se os campos foram preenchidos com os dados da API
    expect(getByPlaceholderText('Digite seu nome').props.value).toBe('João');
    expect(getByPlaceholderText('Digite seu sobrenome').props.value).toBe('Silva');
    expect(getByPlaceholderText('seuemail@exemplo.com').props.value).toBe('joao.silva@exemplo.com');
    
    // Verificar se a API foi chamada
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/profile'), expect.any(Object));
  });

  test('atualiza os dados do formulário quando o texto é alterado', async () => {
    const navigation = { navigate: jest.fn(), goBack: jest.fn() };
    
    // Renderizar o componente
    const { getByPlaceholderText, queryByText } = render(
      <EditProfileScreen navigation={navigation} />
    );
    
    // Esperar que os dados sejam carregados
    await waitFor(() => {
      expect(getByPlaceholderText('Digite seu nome')).toBeTruthy();
    });
    
    // Alterar os valores dos campos
    const nameInput = getByPlaceholderText('Digite seu nome');
    fireEvent.changeText(nameInput, 'Pedro');
    
    const emailInput = getByPlaceholderText('seuemail@exemplo.com');
    fireEvent.changeText(emailInput, 'pedro@exemplo.com');
    
    // Verificar se os valores foram atualizados
    expect(nameInput.props.value).toBe('Pedro');
    expect(emailInput.props.value).toBe('pedro@exemplo.com');
  });

  test('navega para tela anterior ao pressionar o botão de voltar', async () => {
    const navigation = { navigate: jest.fn(), goBack: jest.fn() };
    
    // Renderizar o componente
    const { getByText, UNSAFE_getAllByType } = render(
      <EditProfileScreen navigation={navigation} />
    );
    
    // Esperar que os dados sejam carregados
    await waitFor(() => {
      expect(getByText('Editar Perfil')).toBeTruthy();
    });
    
    // Encontrar o botão de voltar (que é o primeiro TouchableOpacity na tela)
    const touchables = UNSAFE_getAllByType('TouchableOpacity');
    const backButton = touchables[0]; // Primeiro botão é o botão de voltar
    
    // Pressionar o botão
    fireEvent.press(backButton);
    
    // Verificar se a navegação foi chamada
    expect(navigation.goBack).toHaveBeenCalled();
  });

  test('navega para tela de endereços ao pressionar o botão Endereços', async () => {
    const navigation = { navigate: jest.fn(), goBack: jest.fn() };
    
    // Renderizar o componente
    const { findByText } = render(
      <EditProfileScreen navigation={navigation} />
    );
    
    // Esperar que os dados sejam carregados e encontrar o botão de endereços
    const addressesButton = await findByText('Endereços');
    
    // Pressionar o botão
    fireEvent.press(addressesButton);
    
    // Verificar se a navegação foi chamada com o destino correto
    expect(navigation.navigate).toHaveBeenCalledWith('EditAddresses');
  });

  test('salva o perfil e volta para a tela anterior ao pressionar Salvar Perfil', async () => {
    const navigation = { navigate: jest.fn(), goBack: jest.fn() };
    
    // Renderizar o componente
    const { findByText } = render(
      <EditProfileScreen navigation={navigation} />
    );
    
    // Esperar que os dados sejam carregados e encontrar o botão de salvar
    const saveButton = await findByText('Salvar Perfil');
    
    // Simular o Alert.alert para executar o callback do botão OK
    Alert.alert.mockImplementation((title, message, buttons) => {
      if (buttons && buttons.length > 0 && buttons[0].onPress) {
        buttons[0].onPress();
      }
    });
    
    // Pressionar o botão
    await act(async () => {
      fireEvent.press(saveButton);
    });
    
    // Esperar que a atualização seja processada
    await waitFor(() => {
      // Verificar se a API foi chamada para atualizar o perfil
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/profile/update-profile'),
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
      
      // Verificar se o alerta foi mostrado
      expect(Alert.alert).toHaveBeenCalledWith(
        'Sucesso',
        'Perfil atualizado com sucesso!',
        expect.arrayContaining([
          expect.objectContaining({
            text: 'OK'
          })
        ])
      );
      
      // Verificar se navegou de volta
      expect(navigation.goBack).toHaveBeenCalled();
    });
  });
});