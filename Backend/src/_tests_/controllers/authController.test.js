const request = require('supertest');
const app = require('../../app'); // Importa o app.js para iniciar o servidor
const authService = require('../../services/authService');
const authController = require('../../controllers/authController');

jest.mock('@services/authService');

describe('Auth Controller - Register', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('Deve registrar um usuário e retornar status 201', async () => {
    const mockUser = { user_id: 1, email: 'test@example.com' };

    req.body = {
      user_type: 'admin',
      name: 'John',
      last_name: 'Doe',
      email: 'test@example.com',
      password: '123456',
      reset_password: false,
    };

    authService.register.mockResolvedValue(mockUser); // Simula a resposta do serviço

    await authController.register(req, res);

    expect(authService.register).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        id: mockUser.user_id,
        email: mockUser.email,
      },
    });
  });

  test('Deve retornar erro 409 se o usuário já estiver registrado', async () => {
    req.body = {
      user_type: 'admin',
      name: 'John',
      last_name: 'Doe',
      email: 'test@example.com',
      password: '123456',
      reset_password: false,
    };

    authService.register.mockRejectedValue(
      new Error('User already registered')
    );

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      code: 'REGISTRATION_ERROR',
      message: expect.any(String), // Pode melhorar mockando this.translateError()
    });
  });

  test('Deve retornar erro 500 para falha interna', async () => {
    req.body = {
      user_type: 'admin',
      name: 'John',
      last_name: 'Doe',
      email: 'test@example.com',
      password: '123456',
      reset_password: false,
    };

    authService.register.mockRejectedValue(
      new Error('Database connection failed')
    );

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      code: 'REGISTRATION_ERROR',
      message: expect.any(String),
    });
  });
  // 🟢 Teste para LOGIN
  describe('Login', () => {
    test('Deve autenticar um usuário e retornar um token', async () => {
      const mockLoginResponse = {
        token: 'fake-jwt-token',
        reset_password: false,
      };

      req.body = {
        email: 'test@example.com',
        password: '123456',
      };

      authService.login.mockResolvedValue(mockLoginResponse); // Simula o login bem-sucedido

      await authController.login(req, res);

      expect(authService.login).toHaveBeenCalledWith(
        req.body.email,
        req.body.password
      );
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          token: mockLoginResponse.token,
          reset_password: mockLoginResponse.reset_password,
        },
      });
    });

    test('Deve retornar erro 401 se as credenciais forem inválidas', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      authService.login.mockRejectedValue(new Error('Invalid credentials'));

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        code: 'AUTHENTICATION_FAILED',
        message: 'Credenciais inválidas',
      });
    });
  });
  describe('Logout', () => {
    let req;
    let res;
  
    beforeEach(() => {
      // Mock do objeto req e res
      req = {
        headers: {}
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
  
      // Mock do método extractToken
      authController.extractToken = jest.fn().mockReturnValue('fake-jwt-token');
    });
  
    test('Deve realizar logout com sucesso e retornar status 200', async () => {
      authService.logout.mockResolvedValue(); // Simula sucesso no logout
  
      await authController.logout(req, res);
  
      expect(authController.extractToken).toHaveBeenCalledWith(req);
      expect(authService.logout).toHaveBeenCalledWith('fake-jwt-token');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Logout realizado com sucesso',
      });
    });
  
    test('Deve retornar erro 401 se o token for inválido', async () => {
      authService.logout.mockRejectedValue(new Error('Token inválido'));
  
      await authController.logout(req, res);
  
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        code: 'LOGOUT_FAILED',
        message: expect.any(String),
      });
    });
  
    test('Deve retornar erro 500 para falha interna', async () => {
      authService.logout.mockRejectedValue(
        new Error('Erro inesperado no logout')
      );
  
      await authController.logout(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        code: 'LOGOUT_FAILED',
        message: expect.any(String),
      });
    });
  });  
});
