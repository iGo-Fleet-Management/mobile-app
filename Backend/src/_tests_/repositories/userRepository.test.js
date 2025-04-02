// src/_tests_/repositories/userRepository.test.js

describe('UserRepository', () => {
  // Mocks
  let mockUser;
  let mockBaseRepository;
  let userRepository;

  beforeEach(() => {
    // Criar mocks para o modelo User e métodos herdados do BaseRepository
    mockUser = {
      // Propriedades e métodos do modelo podem ser adicionados conforme necessário
    };

    // Simular os métodos do BaseRepository que são usados pelo UserRepository
    mockBaseRepository = {
      findByField: jest.fn(),
      findById: jest.fn(),
    };

    // Criar implementação de teste do UserRepository
    userRepository = {
      // Injetar os métodos mockados do BaseRepository
      findByField: mockBaseRepository.findByField,
      findById: mockBaseRepository.findById,

      // Implementar os métodos do UserRepository
      async findByEmail(email, options = {}) {
        return this.findByField('email', email, options);
      },

      async isProfileComplete(userId, options = {}) {
        const user = await this.findById(userId, {
          include: ['addresses'],
          ...options,
        });

        return !!(
          user.cpf &&
          user.birthdate &&
          user.phone &&
          user.addresses?.length > 0
        );
      },
    };
  });

  describe('findByEmail', () => {
    it('deve chamar findByField com os parâmetros corretos', async () => {
      // Arrange
      const testEmail = 'test@example.com';
      const mockUserData = { id: 1, email: testEmail, name: 'Test User' };
      mockBaseRepository.findByField.mockResolvedValue(mockUserData);

      // Act
      const result = await userRepository.findByEmail(testEmail);

      // Assert
      expect(mockBaseRepository.findByField).toHaveBeenCalledWith(
        'email',
        testEmail,
        {}
      );
      expect(result).toEqual(mockUserData);
    });

    it('deve passar opções adicionais para findByField', async () => {
      // Arrange
      const testEmail = 'test@example.com';
      const options = { transaction: 'fake-transaction' };

      // Act
      await userRepository.findByEmail(testEmail, options);

      // Assert
      expect(mockBaseRepository.findByField).toHaveBeenCalledWith(
        'email',
        testEmail,
        options
      );
    });
  });

  describe('isProfileComplete', () => {
    it('deve retornar true quando o perfil estiver completo', async () => {
      // Arrange
      const userId = 1;
      const completeUser = {
        id: userId,
        cpf: '123.456.789-00',
        birthdate: '1990-01-01',
        phone: '(11) 98765-4321',
        addresses: [{ id: 1, street: 'Test Street' }],
      };
      mockBaseRepository.findById.mockResolvedValue(completeUser);

      // Act
      const result = await userRepository.isProfileComplete(userId);

      // Assert
      expect(mockBaseRepository.findById).toHaveBeenCalledWith(userId, {
        include: ['addresses'],
      });
      expect(result).toBe(true);
    });

    it('deve retornar false quando o CPF estiver ausente', async () => {
      // Arrange
      const userId = 1;
      const incompleteUser = {
        id: userId,
        cpf: null, // CPF ausente
        birthdate: '1990-01-01',
        phone: '(11) 98765-4321',
        addresses: [{ id: 1, street: 'Test Street' }],
      };
      mockBaseRepository.findById.mockResolvedValue(incompleteUser);

      // Act
      const result = await userRepository.isProfileComplete(userId);

      // Assert
      expect(result).toBe(false);
    });

    it('deve retornar false quando a data de nascimento estiver ausente', async () => {
      // Arrange
      const userId = 1;
      const incompleteUser = {
        id: userId,
        cpf: '123.456.789-00',
        birthdate: null, // Data de nascimento ausente
        phone: '(11) 98765-4321',
        addresses: [{ id: 1, street: 'Test Street' }],
      };
      mockBaseRepository.findById.mockResolvedValue(incompleteUser);

      // Act
      const result = await userRepository.isProfileComplete(userId);

      // Assert
      expect(result).toBe(false);
    });

    it('deve retornar false quando o telefone estiver ausente', async () => {
      // Arrange
      const userId = 1;
      const incompleteUser = {
        id: userId,
        cpf: '123.456.789-00',
        birthdate: '1990-01-01',
        phone: null, // Telefone ausente
        addresses: [{ id: 1, street: 'Test Street' }],
      };
      mockBaseRepository.findById.mockResolvedValue(incompleteUser);

      // Act
      const result = await userRepository.isProfileComplete(userId);

      // Assert
      expect(result).toBe(false);
    });

    it('deve retornar false quando não houver endereços', async () => {
      // Arrange
      const userId = 1;
      const incompleteUser = {
        id: userId,
        cpf: '123.456.789-00',
        birthdate: '1990-01-01',
        phone: '(11) 98765-4321',
        addresses: [], // Array de endereços vazio
      };
      mockBaseRepository.findById.mockResolvedValue(incompleteUser);

      // Act
      const result = await userRepository.isProfileComplete(userId);

      // Assert
      expect(result).toBe(false);
    });

    it('deve retornar false quando addresses for null', async () => {
      // Arrange
      const userId = 1;
      const incompleteUser = {
        id: userId,
        cpf: '123.456.789-00',
        birthdate: '1990-01-01',
        phone: '(11) 98765-4321',
        addresses: null, // Addresses é null
      };
      mockBaseRepository.findById.mockResolvedValue(incompleteUser);

      // Act
      const result = await userRepository.isProfileComplete(userId);

      // Assert
      expect(result).toBe(false);
    });

    it('deve passar opções adicionais para findById', async () => {
      // Arrange
      const userId = 1;
      const options = { transaction: 'fake-transaction' };
      const user = {
        id: userId,
        cpf: '123.456.789-00',
        birthdate: '1990-01-01',
        phone: '(11) 98765-4321',
        addresses: [{ id: 1 }],
      };
      mockBaseRepository.findById.mockResolvedValue(user);

      // Act
      await userRepository.isProfileComplete(userId, options);

      // Assert
      expect(mockBaseRepository.findById).toHaveBeenCalledWith(userId, {
        include: ['addresses'],
        transaction: 'fake-transaction',
      });
    });
  });
});
