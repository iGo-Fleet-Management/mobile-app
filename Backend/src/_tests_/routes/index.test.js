const express = require('express');

// Mock dos módulos
jest.mock('express');
jest.mock('../../routes/authRoutes', () => 'mocked-auth-routes');
jest.mock('../../routes/profileRoutes', () => 'mocked-profile-routes');
jest.mock('../../routes/forgotPasswordRoutes', () => 'mocked-forgot-password-routes');

describe('Index Router', () => {
  let router;
  let useSpy;

  beforeEach(() => {
    // Limpar todos os mocks antes de cada teste
    jest.clearAllMocks();
    
    // Configurar o spy para router.use
    useSpy = jest.fn();
    
    // Mock do método Router que retorna um objeto com método use
    express.Router.mockReturnValue({
      use: useSpy
    });
    
    // Importar o módulo após configurar os mocks
    // Isso faz com que o código no arquivo index.js seja executado com nossos mocks
    router = require('../../routes/index');
  });

  test('deve configurar as rotas corretamente', () => {
    // Verificar se Router() foi chamado para criar um novo router
    expect(express.Router).toHaveBeenCalled();
    
    // Verificar se router.use foi chamado com os argumentos corretos
    expect(useSpy).toHaveBeenNthCalledWith(1, '/auth', 'mocked-auth-routes');
    expect(useSpy).toHaveBeenNthCalledWith(2, '/auth', 'mocked-forgot-password-routes');
    expect(useSpy).toHaveBeenNthCalledWith(3, '/profile', 'mocked-profile-routes');
    
    // Verificar número total de chamadas
    expect(useSpy).toHaveBeenCalledTimes(3);
  });
});