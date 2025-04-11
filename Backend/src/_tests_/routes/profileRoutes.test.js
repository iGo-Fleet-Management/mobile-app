const request = require('supertest');
const express = require('express');

// 1. Criar mocks dos controladores
const mockCompleteRegistration = jest.fn((req, res) => res.status(200).json({ success: true }));
const mockUpdateProfile = jest.fn((req, res) => res.status(200).json({ success: true }));
const mockGetProfile = jest.fn((req, res) => res.status(200).json({ success: true, data: {} }));

// 2. Criar mocks dos middlewares
const mockAuthenticate = jest.fn((req, res, next) => next());
const mockValidationMiddleware = jest.fn((req, res, next) => next());
const mockCheckProfileComplete = jest.fn((req, res) => res.status(200).send());

// 3. Criar mocks dos validators como funções
const mockCompleteProfileSchema = jest.fn(() => ({}));
const mockUpdateProfileSchema = jest.fn(() => ({}));

// 4. Mockar o módulo validationMiddleware de forma especial
const mockValidate = jest.fn().mockImplementation((schema) => {
  // Registrar que recebeu um schema
  if (typeof schema === 'function') {
    schema(); // Chamar a função do schema
  }
  return mockValidationMiddleware;
});

// 5. Configurar todos os mocks
jest.mock('../../controllers/profileController', () => ({
  completeRegistration: mockCompleteRegistration,
  updateProfile: mockUpdateProfile,
  getProfile: mockGetProfile
}));

jest.mock('../../middlewares/authMiddleware', () => ({
  authenticate: mockAuthenticate
}));

jest.mock('../../middlewares/validationMiddleware', () => ({
  validate: mockValidate
}));

jest.mock('../../middlewares/profileMiddleware', () => ({
  checkProfileComplete: mockCheckProfileComplete
}));

jest.mock('../../validators/userValidation', () => ({
  completeProfileSchema: mockCompleteProfileSchema,
  updateProfileSchema: mockUpdateProfileSchema
}));

// 6. Importar as rotas depois de configurar todos os mocks
const profileRoutes = require('../../routes/profileRoutes');

describe('Profile Routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/profile', profileRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configurar comportamentos padrão
    mockAuthenticate.mockImplementation((req, res, next) => next());
    mockValidationMiddleware.mockImplementation((req, res, next) => next());
    mockCheckProfileComplete.mockImplementation((req, res) => res.status(200).send());
    
    // Configurar o mock de validate para chamar o schema
    mockValidate.mockImplementation((schema) => {
      if (typeof schema === 'function') {
        schema();
      }
      return mockValidationMiddleware;
    });
  });

  describe('PUT /profile/complete-profile', () => {
    it('deve chamar os middlewares e o controlador corretamente', async () => {
      const testData = {
        userData: {
          cpf: '12345678901',
          birthdate: '1990-01-01',
          phone: '11999999999'
        },
        addressUpdates: {
          street: 'Rua Teste',
          number: '123',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '00000000'
        }
      };

      const response = await request(app)
        .put('/profile/complete-profile')
        .send(testData);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      
      // Verificar se os middlewares foram chamados
      expect(mockAuthenticate).toHaveBeenCalled();
      expect(mockCompleteProfileSchema).toHaveBeenCalled();
      expect(mockValidate).toHaveBeenCalled();
      expect(mockValidationMiddleware).toHaveBeenCalled();
      
      // Verificar se o controlador foi chamado
      expect(mockCompleteRegistration).toHaveBeenCalled();
    });
  });

  describe('PUT /profile', () => {
    it('deve atualizar o perfil com sucesso', async () => {
      const testData = {
        userData: { name: 'Novo Nome' },
        addressUpdates: { city: 'Nova Cidade' }
      };

      const response = await request(app)
        .put('/profile')
        .send(testData);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      
      expect(mockAuthenticate).toHaveBeenCalled();
      expect(mockUpdateProfileSchema).toHaveBeenCalled();
      expect(mockValidate).toHaveBeenCalled();
      expect(mockValidationMiddleware).toHaveBeenCalled();
      expect(mockUpdateProfile).toHaveBeenCalled();
    });
  });

  describe('GET /profile', () => {
    it('deve retornar o perfil do usuário', async () => {
      const response = await request(app)
        .get('/profile');

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      
      expect(mockAuthenticate).toHaveBeenCalled();
      expect(mockGetProfile).toHaveBeenCalled();
    });
  });

  describe('GET /profile/check-profile', () => {
    it('deve verificar o perfil completo', async () => {
      const response = await request(app)
        .get('/profile/check-profile');

      expect(response.statusCode).toBe(200);
      expect(mockAuthenticate).toHaveBeenCalled();
      expect(mockCheckProfileComplete).toHaveBeenCalled();
    });
  });
});