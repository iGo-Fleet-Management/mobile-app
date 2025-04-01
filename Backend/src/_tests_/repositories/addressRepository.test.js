const addressRepository = require('../../repositories/addressRepository');
const { Address } = require('../../models');

// Mock do modelo Address
jest.mock('../../models', () => {
  return {
    Address: {
      findAll: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    },
  };
});

describe('Address Repository', () => {
  beforeEach(() => {
    // Limpar todos os mocks antes de cada teste
    jest.clearAllMocks();
  });

  describe('findByUserId', () => {
    it('Deve buscar endereços por ID do usuário', async () => {
      // Arrange
      const userId = '123';
      const mockAddresses = [
        { address_id: '1', street: 'Rua A', user_id: userId },
        { address_id: '2', street: 'Rua B', user_id: userId },
      ];
      Address.findAll.mockResolvedValue(mockAddresses);

      // Act
      const result = await addressRepository.findByUserId(userId);

      // Assert
      expect(Address.findAll).toHaveBeenCalledWith({
        where: { user_id: userId },
      });
      expect(result).toEqual(mockAddresses);
    });

    it('Deve aceitar opções adicionais', async () => {
      // Arrange
      const userId = '123';
      const options = {
        include: ['SomeRelation'],
        order: [['createdAt', 'DESC']],
      };
      Address.findAll.mockResolvedValue([]);

      // Act
      await addressRepository.findByUserId(userId, options);

      // Assert
      expect(Address.findAll).toHaveBeenCalledWith({
        where: { user_id: userId },
        include: ['SomeRelation'],
        order: [['createdAt', 'DESC']],
      });
    });

    it('Deve retornar um array vazio se não encontrar endereços', async () => {
      // Arrange
      const userId = '456';
      Address.findAll.mockResolvedValue([]);

      // Act
      const result = await addressRepository.findByUserId(userId);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('updateOrCreate', () => {
    it('Deve atualizar um endereço existente quando address_id estiver presente', async () => {
      // Arrange
      const addressData = {
        address_id: '1',
        street: 'Rua Atualizada',
        city: 'Cidade Nova',
        user_id: '123',
      };
      const updatedAddress = { ...addressData, updatedAt: new Date() };

      // Mock do método update para simular a implementação real
      const originalUpdate = addressRepository.update;
      jest
        .spyOn(addressRepository, 'update')
        .mockImplementation((id, data, options) =>
          Promise.resolve(updatedAddress)
        );

      // Act
      const result = await addressRepository.updateOrCreate(addressData);

      // Assert
      expect(addressRepository.update).toHaveBeenCalledWith(
        addressData.address_id,
        addressData,
        { transaction: undefined }
      );
      expect(result).toEqual(updatedAddress);

      // Restaurar o método original
      addressRepository.update = originalUpdate;
    });

    it('Deve criar um novo endereço quando address_id não estiver presente', async () => {
      // Arrange
      const addressData = {
        street: 'Nova Rua',
        city: 'Nova Cidade',
        user_id: '123',
      };
      const createdAddress = {
        address_id: '5',
        ...addressData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock do método create para simular a implementação real
      const originalCreate = addressRepository.create;
      jest
        .spyOn(addressRepository, 'create')
        .mockImplementation((data, options) => Promise.resolve(createdAddress));

      // Act
      const result = await addressRepository.updateOrCreate(addressData);

      // Assert
      expect(addressRepository.create).toHaveBeenCalledWith(addressData, {
        transaction: undefined,
      });
      expect(result).toEqual(createdAddress);

      // Restaurar o método original
      addressRepository.create = originalCreate;
    });

    it('Deve passar a transação para o método update', async () => {
      // Arrange
      const addressData = {
        address_id: '1',
        street: 'Rua com Transação',
        user_id: '123',
      };
      const mockTransaction = { commit: jest.fn(), rollback: jest.fn() };

      // Mock do método update
      const originalUpdate = addressRepository.update;
      jest
        .spyOn(addressRepository, 'update')
        .mockImplementation((id, data, options) => Promise.resolve({}));

      // Act
      await addressRepository.updateOrCreate(addressData, {
        transaction: mockTransaction,
      });

      // Assert
      expect(addressRepository.update).toHaveBeenCalledWith(
        addressData.address_id,
        addressData,
        { transaction: mockTransaction }
      );

      // Restaurar o método original
      addressRepository.update = originalUpdate;
    });

    it('Deve passar a transação para o método create', async () => {
      // Arrange
      const addressData = {
        street: 'Rua com Transação',
        user_id: '123',
      };
      const mockTransaction = { commit: jest.fn(), rollback: jest.fn() };

      // Mock do método create
      const originalCreate = addressRepository.create;
      jest
        .spyOn(addressRepository, 'create')
        .mockImplementation((data, options) => Promise.resolve({}));

      // Act
      await addressRepository.updateOrCreate(addressData, {
        transaction: mockTransaction,
      });

      // Assert
      expect(addressRepository.create).toHaveBeenCalledWith(addressData, {
        transaction: mockTransaction,
      });

      // Restaurar o método original
      addressRepository.create = originalCreate;
    });
  });

  // Adicionando testes para os métodos da BaseRepository
  describe('Métodos da BaseRepository', () => {
    it('Deve chamar o método findByPk do modelo ao chamar get', async () => {
      // Arrange
      const addressId = '1';
      const mockAddress = { address_id: addressId, street: 'Rua Teste' };
      Address.findByPk.mockResolvedValue(mockAddress);

      // Act
      const result = await addressRepository.get(addressId);

      // Assert
      expect(Address.findByPk).toHaveBeenCalledWith(addressId);
      expect(result).toEqual(mockAddress);
    });

    it('Deve chamar o método create do modelo ao chamar create', async () => {
      // Arrange
      const addressData = {
        street: 'Nova Rua',
        city: 'Nova Cidade',
        user_id: '123',
      };
      const createdAddress = {
        address_id: '10',
        ...addressData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      Address.create.mockResolvedValue(createdAddress);

      // Act
      const result = await addressRepository.create(addressData);

      // Assert
      expect(Address.create).toHaveBeenCalledWith(addressData, {});
      expect(result).toEqual(createdAddress);
    });

    it('Deve chamar o método update do modelo ao chamar update', async () => {
      // Arrange
      const addressId = '1';
      const addressData = { street: 'Rua Atualizada' };
      Address.update.mockResolvedValue([1]);
      const updatedAddress = {
        address_id: addressId,
        ...addressData,
        updatedAt: new Date(),
      };
      Address.findByPk.mockResolvedValue(updatedAddress);

      // Act
      const result = await addressRepository.update(addressId, addressData);

      // Assert
      expect(Address.update).toHaveBeenCalledWith(addressData, {
        where: { address_id: addressId },
      });
      expect(Address.findByPk).toHaveBeenCalledWith(addressId);
      expect(result).toEqual(updatedAddress);
    });

    it('Deve chamar o método destroy do modelo ao chamar delete', async () => {
      // Arrange
      const addressId = '1';
      Address.destroy.mockResolvedValue(1);

      // Act
      const result = await addressRepository.delete(addressId);

      // Assert
      expect(Address.destroy).toHaveBeenCalledWith({
        where: { address_id: addressId },
      });
      expect(result).toBe(1);
    });
  });
});
