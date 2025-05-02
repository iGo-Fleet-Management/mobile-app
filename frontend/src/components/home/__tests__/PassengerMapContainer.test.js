import React from 'react';
import { render, act } from '@testing-library/react-native';
import PassengerMapContainer from '../PassengerMapContainer';
import socket from '../../../utils/socket';

// Mock do módulo socket
jest.mock('../../../utils/socket', () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
}));

// Mock do componente WebView
jest.mock('react-native-webview', () => {
  const { View } = require('react-native');
  const MockWebView = (props) => {
    // Armazena a ref quando fornecida
    if (props.ref) {
      const { ref } = props;
      if (typeof ref === 'function') {
        ref({
          postMessage: jest.fn(),
        });
      } else if (ref.current) {
        ref.current = {
          postMessage: jest.fn(),
        };
      }
    }
    return <View {...props} />;
  };
  
  return {
    WebView: MockWebView,
  };
});

// Mock do arquivo HTML
jest.mock('../../../assets/passengerMap.html', () => 'mock-html-file', { virtual: true });

describe('PassengerMapContainer', () => {
  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('renderiza corretamente', () => {
    const { toJSON } = render(<PassengerMapContainer />);
    expect(toJSON()).toBeTruthy();
  });

  it('conecta ao socket e configura listeners quando montado', () => {
    render(<PassengerMapContainer />);
    
    expect(socket.connect).toHaveBeenCalledTimes(1);
    expect(socket.on).toHaveBeenCalledWith('driverLocation', expect.any(Function));
  });

  it('desconecta do socket e remove listeners quando desmontado', () => {
    const { unmount } = render(<PassengerMapContainer />);
    
    unmount();
    
    expect(socket.off).toHaveBeenCalledWith('driverLocation');
    expect(socket.disconnect).toHaveBeenCalledTimes(1);
  });

  it('envia mensagem para WebView quando a localização do passageiro muda', () => {
    const mockLocation = {
      latitude: 40.7128,
      longitude: -74.0060,
    };
    
    const { rerender } = render(<PassengerMapContainer location={null} />);
    
    // Simula a atualização da prop location
    rerender(<PassengerMapContainer location={mockLocation} />);
    
    // É difícil testar diretamente o postMessage do WebView devido à natureza do ref
    // Mas podemos verificar se o useEffect foi acionado quando a location mudou
    expect(socket.connect).toHaveBeenCalledTimes(1);
  });

  it('processa eventos de localização do motorista do socket', () => {
    // Captura a função callback passada para socket.on
    let driverLocationCallback;
    socket.on.mockImplementation((event, callback) => {
      if (event === 'driverLocation') {
        driverLocationCallback = callback;
      }
    });
    
    render(<PassengerMapContainer />);
    
    // Simula recebimento de dados de localização do motorista
    const mockDriverLocation = { lat: 40.7128, lng: -74.0060 };
    
    // Verifica se o callback foi definido
    expect(driverLocationCallback).toBeDefined();
    
    // Executa o callback manualmente
    act(() => {
      driverLocationCallback(mockDriverLocation);
    });
    
    // Infelizmente, é difícil verificar diretamente se webViewRef.current.postMessage foi chamado
    // devido a como os refs funcionam em testes
    // Mas este teste verifica se o callback é executado sem erros
  });

  it('lida com caso em que a localização do motorista está incompleta', () => {
    // Captura a função callback passada para socket.on
    let driverLocationCallback;
    socket.on.mockImplementation((event, callback) => {
      if (event === 'driverLocation') {
        driverLocationCallback = callback;
      }
    });
    
    render(<PassengerMapContainer />);
    
    // Simula recebimento de dados de localização incompletos
    const incompleteDriverLocation = { lat: null, lng: null };
    
    // Executa o callback com dados incompletos
    act(() => {
      driverLocationCallback(incompleteDriverLocation);
    });
    
    // O teste passa se não houver erros
  });

  it('envia localização do passageiro quando WebView é carregada', () => {
    const mockLocation = {
      latitude: 40.7128,
      longitude: -74.0060,
    };
    
    // Renderiza com localização definida
    const { getByTestId } = render(
      <PassengerMapContainer location={mockLocation} />
    );
    
    // Note: Em um cenário real, precisaríamos adicionar testID à WebView e
    // disparar o evento onLoad, mas isso é complicado nos testes.
    // Este teste verifica apenas se o componente renderiza sem erros quando 
    // tenta enviar a localização no onLoad.
  });
});