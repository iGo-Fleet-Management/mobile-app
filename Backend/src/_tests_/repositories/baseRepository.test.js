const BaseRepository = require('../../repositories/baseRepository');

// Mock para o modelo Sequelize
const mockModel = {
  findByPk: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
  primaryKeyAttribute: 'id',
};

describe('BaseRepository', () => {
  let repository;

  beforeEach(() => {
    // Limpar mocks antes de cada teste
    jest.clearAllMocks();

    // Criar uma nova instância do repositório
    repository = new BaseRepository(mockModel);
  });

  describe('findById', () => {
    it('deve chamar findByPk com o ID correto', async () => {
      // Arrange
      const id = '123';
      const mockData = { id: '123', name: 'Test Item' };
      mockModel.findByPk.mockResolvedValue(mockData);

      // Act
      const result = await repository.findById(id);

      // Assert
      expect(mockModel.findByPk).toHaveBeenCalledWith(id, {});
      expect(result).toEqual(mockData);
    });

    it('deve passar as opções para findByPk', async () => {
      // Arrange
      const id = '123';
      const options = { include: ['relation'], attributes: ['id', 'name'] };
      mockModel.findByPk.mockResolvedValue({});

      // Act
      await repository.findById(id, options);

      // Assert
      expect(mockModel.findByPk).toHaveBeenCalledWith(id, options);
    });

    it('deve retornar null quando o registro não é encontrado', async () => {
      // Arrange
      mockModel.findByPk.mockResolvedValue(null);

      // Act
      const result = await repository.findById('nonexistent');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findByField', () => {
    it('deve chamar findOne com o campo e valor corretos', async () => {
      // Arrange
      const field = 'email';
      const value = 'test@example.com';
      const mockData = { id: '123', email: value };
      mockModel.findOne.mockResolvedValue(mockData);

      // Act
      const result = await repository.findByField(field, value);

      // Assert
      expect(mockModel.findOne).toHaveBeenCalledWith({
        where: { [field]: value },
      });
      expect(result).toEqual(mockData);
    });

    it('deve passar as opções para findOne', async () => {
      // Arrange
      const field = 'email';
      const value = 'test@example.com';
      const options = { include: ['relation'] };
      mockModel.findOne.mockResolvedValue({});

      // Act
      await repository.findByField(field, value, options);

      // Assert
      expect(mockModel.findOne).toHaveBeenCalledWith({
        where: { [field]: value },
        include: ['relation'],
      });
    });

    it('deve retornar null quando o registro não é encontrado', async () => {
      // Arrange
      mockModel.findOne.mockResolvedValue(null);

      // Act
      const result = await repository.findByField(
        'email',
        'nonexistent@example.com'
      );

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('deve chamar create com os dados corretos', async () => {
      // Arrange
      const data = { name: 'New Item', description: 'Test description' };
      const createdData = { id: '123', ...data };
      mockModel.create.mockResolvedValue(createdData);

      // Act
      const result = await repository.create(data);

      // Assert
      expect(mockModel.create).toHaveBeenCalledWith(data, {});
      expect(result).toEqual(createdData);
    });

    it('deve passar as opções para create', async () => {
      // Arrange
      const data = { name: 'New Item' };
      const options = { transaction: 'mockTransaction' };
      mockModel.create.mockResolvedValue({});

      // Act
      await repository.create(data, options);

      // Assert
      expect(mockModel.create).toHaveBeenCalledWith(data, options);
    });
  });

  describe('update', () => {
    it('deve atualizar o registro e retornar o registro atualizado', async () => {
      // Arrange
      const id = '123';
      const data = { name: 'Updated Name' };
      const updatedData = { id, name: 'Updated Name' };

      mockModel.update.mockResolvedValue([1]); // 1 registro afetado
      mockModel.findByPk.mockResolvedValue(updatedData);

      // Act
      const result = await repository.update(id, data);

      // Assert
      expect(mockModel.update).toHaveBeenCalledWith(data, {
        where: { [mockModel.primaryKeyAttribute]: id },
      });
      expect(mockModel.findByPk).toHaveBeenCalledWith(id, {});
      expect(result).toEqual(updatedData);
    });

    it('deve lançar um erro quando nenhum registro é atualizado', async () => {
      // Arrange
      const id = 'nonexistent';
      const data = { name: 'Updated Name' };

      mockModel.update.mockResolvedValue([0]); // 0 registros afetados

      // Act & Assert
      await expect(repository.update(id, data)).rejects.toThrow(
        'Registro não encontrado'
      );
    });

    it('deve passar as opções para update e findById', async () => {
      // Arrange
      const id = '123';
      const data = { name: 'Updated Name' };
      const options = { transaction: 'mockTransaction' };

      mockModel.update.mockResolvedValue([1]);
      mockModel.findByPk.mockResolvedValue({});

      // Act
      await repository.update(id, data, options);

      // Assert
      expect(mockModel.update).toHaveBeenCalledWith(data, {
        where: { [mockModel.primaryKeyAttribute]: id },
        transaction: 'mockTransaction',
      });
      expect(mockModel.findByPk).toHaveBeenCalledWith(id, options);
    });
  });

  describe('delete', () => {
    it('deve excluir o registro e retornar true', async () => {
      // Arrange
      const id = '123';
      mockModel.destroy.mockResolvedValue(1); // 1 registro excluído

      // Act
      const result = await repository.delete(id);

      // Assert
      expect(mockModel.destroy).toHaveBeenCalledWith({
        where: { [mockModel.primaryKeyAttribute]: id },
      });
      expect(result).toBe(true);
    });

    it('deve lançar um erro quando nenhum registro é excluído', async () => {
      // Arrange
      const id = 'nonexistent';
      mockModel.destroy.mockResolvedValue(0); // 0 registros excluídos

      // Act & Assert
      await expect(repository.delete(id)).rejects.toThrow(
        'Registro não encontrado'
      );
    });

    it('deve passar as opções para destroy', async () => {
      // Arrange
      const id = '123';
      const options = { transaction: 'mockTransaction' };
      mockModel.destroy.mockResolvedValue(1);

      // Act
      await repository.delete(id, options);

      // Assert
      expect(mockModel.destroy).toHaveBeenCalledWith({
        where: { [mockModel.primaryKeyAttribute]: id },
        transaction: 'mockTransaction',
      });
    });
  });
});
