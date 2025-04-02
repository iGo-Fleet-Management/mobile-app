const request = require('supertest');
const express = require('express');
const authRoutes = require('../../routes/authRoutes');
const authController = require('../../controllers/authController');
const { authenticate } = require('../../middlewares/authMiddleware');

// Mock dos módulos necessários
jest.mock('../../controllers/authController');
jest.mock('../../middlewares/authMiddleware');

describe('Auth Routes', () => {
  let app;

  beforeEach(() => {
    // Limpar todos os mocks antes de cada teste
    jest.clearAllMocks();

    // Configurar uma aplicação Express para testar as rotas
    app = express();
    app.use(express.json());
    app.use('/auth', authRoutes);

    // Mock das funções do controlador
    authController.register.mockImplementation((req, res) => {
      res.status(201).json({
        success: true,
        data: {
          id: 1,
          email: req.body.email,
        },
      });
    });

    authController.login.mockImplementation((req, res) => {
      res.status(200).json({
        success: true,
        data: {
          token: 'fake-token',
          reset_password: req.body.reset_password || false,
        },
      });
    });

    authController.logout.mockImplementation((req, res) => {
      res.status(200).json({
        success: true,
        message: 'Logout realizado com sucesso',
      });
    });

    // Mock do middleware de autenticação
    authenticate.mockImplementation((req, res, next) => {
      req.user = { id: 1, email: 'test@example.com' };
      next();
    });
  });

  describe('POST /auth/register', () => {
    test('deve registrar um novo usuário com sucesso', async () => {
      const userData = {
        user_type: 'cliente',
        name: 'João',
        last_name: 'Silva',
        email: 'joao@example.com',
        password: 'senha123',
        reset_password: false,
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toEqual({
        success: true,
        data: {
          id: 1,
          email: 'joao@example.com',
        },
      });

      expect(authController.register).toHaveBeenCalledTimes(1);
      expect(authController.register).toHaveBeenCalledWith(
        expect.objectContaining({
          body: userData,
        }),
        expect.any(Object),
        expect.any(Function)
      );
    });

    test('deve retornar erro quando email já está em uso', async () => {
      // Sobrescreve a implementação do mock para simular erro
      authController.register.mockImplementation((req, res) => {
        res.status(409).json({
          success: false,
          code: 'EMAIL_IN_USE',
          message: 'Email já está em uso',
        });
      });

      const userData = {
        user_type: 'cliente',
        name: 'Maria',
        last_name: 'Santos',
        email: 'maria@example.com',
        password: 'senha456',
        reset_password: false,
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(409);

      expect(response.body).toEqual({
        success: false,
        code: 'EMAIL_IN_USE',
        message: 'Email já está em uso',
      });
    });
  });

  describe('POST /auth/login', () => {
    test('deve fazer login com sucesso', async () => {
      const loginData = {
        email: 'usuario@example.com',
        password: 'senha123',
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: {
          token: 'fake-token',
          reset_password: false,
        },
      });

      expect(authController.login).toHaveBeenCalledTimes(1);
      expect(authController.login).toHaveBeenCalledWith(
        expect.objectContaining({
          body: loginData,
        }),
        expect.any(Object),
        expect.any(Function)
      );
    });

    test('deve retornar erro quando credenciais são inválidas', async () => {
      // Sobrescreve a implementação do mock para simular erro de credenciais
      authController.login.mockImplementation((req, res) => {
        res.status(401).json({
          success: false,
          code: 'INVALID_CREDENTIALS',
          message: 'Email ou senha inválidos',
        });
      });

      const loginData = {
        email: 'usuario@example.com',
        password: 'senhaerrada',
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toEqual({
        success: false,
        code: 'INVALID_CREDENTIALS',
        message: 'Email ou senha inválidos',
      });
    });

    test('deve indicar quando o usuário precisa redefinir a senha', async () => {
      // Sobrescreve a implementação do mock para simular redefinição de senha
      authController.login.mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          data: {
            token: 'fake-token',
            reset_password: true,
          },
        });
      });

      const loginData = {
        email: 'novo@example.com',
        password: 'senhatemporal',
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: {
          token: 'fake-token',
          reset_password: true,
        },
      });
    });
  });

  describe('POST /auth/logout', () => {
    test('deve fazer logout com sucesso quando autenticado', async () => {
      const response = await request(app)
        .post('/auth/logout')
        .set('Authorization', 'Bearer fake-token')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Logout realizado com sucesso',
      });

      expect(authenticate).toHaveBeenCalledTimes(1);
      expect(authController.logout).toHaveBeenCalledTimes(1);
    });

    test('deve retornar erro quando token é inválido', async () => {
      // Sobrescreve a implementação do mock para simular erro de autenticação
      authenticate.mockImplementation((req, res, next) => {
        return res.status(401).json({
          success: false,
          code: 'INVALID_TOKEN',
          message: 'Token inválido ou expirado',
        });
      });

      const response = await request(app)
        .post('/auth/logout')
        .set('Authorization', 'Bearer invalid-token')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toEqual({
        success: false,
        code: 'INVALID_TOKEN',
        message: 'Token inválido ou expirado',
      });

      expect(authenticate).toHaveBeenCalledTimes(1);
      expect(authController.logout).not.toHaveBeenCalled();
    });

    test('deve retornar erro quando token não é fornecido', async () => {
      // Sobrescreve a implementação do mock para simular falta de token
      authenticate.mockImplementation((req, res, next) => {
        return res.status(401).json({
          success: false,
          code: 'NO_TOKEN',
          message: 'Token de autenticação não fornecido',
        });
      });

      const response = await request(app)
        .post('/auth/logout')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toEqual({
        success: false,
        code: 'NO_TOKEN',
        message: 'Token de autenticação não fornecido',
      });
    });
  });
});
