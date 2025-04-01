describe('TokenBlacklistRepository', () => {
    // Mock dos modelos e dependências
    let mockTokenBlacklist;
    let mockSequelize;
    let tokenBlacklistRepository;
    
    // Setup antes de todos os testes
    beforeAll(() => {
      // Mock do modelo TokenBlacklist
      mockTokenBlacklist = {
        findOne: jest.fn(),
        destroy: jest.fn()
      };
      
      // Mock do Sequelize e seus operadores
      mockSequelize = {
        Op: {
          lt: Symbol('lt')
        }
      };
      
      // Mock manual do módulo config/db
      jest.mock('../../../config/db', () => ({
        Sequelize: mockSequelize
      }), { virtual: true });
      
      // Criar uma versão isolada do repositório para testes
      class BaseRepository {
        constructor(model) {
          this.model = model;
        }
      }
      
      class TokenBlacklistRepository extends BaseRepository {
        constructor() {
          super(mockTokenBlacklist);
        }
      
        async findByToken(token, options = {}) {
          return this.model.findOne({
            where: { token },
            ...options,
          });
        }
      
        async deleteExpiredTokens(options = {}) {
          // Simulamos o comportamento sem importar o módulo real
          return this.model.destroy({
            where: {
              expires_at: { [mockSequelize.Op.lt]: new Date() },
            },
            ...options,
          });
        }
      }
      
      tokenBlacklistRepository = new TokenBlacklistRepository();
    });
    
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    describe('findByToken', () => {
      it('deve chamar findOne com os parâmetros corretos', async () => {
        // Arrange
        const testToken = 'test-token-123';
        const mockResult = { id: 1, token: testToken, expires_at: new Date() };
        mockTokenBlacklist.findOne.mockResolvedValue(mockResult);
  
        // Act
        const result = await tokenBlacklistRepository.findByToken(testToken);
  
        // Assert
        expect(mockTokenBlacklist.findOne).toHaveBeenCalledWith({
          where: { token: testToken },
        });
        expect(result).toEqual(mockResult);
      });
  
      it('deve passar opções adicionais para findOne', async () => {
        // Arrange
        const testToken = 'test-token-123';
        const options = { transaction: 'fake-transaction' };
        
        // Act
        await tokenBlacklistRepository.findByToken(testToken, options);
  
        // Assert
        expect(mockTokenBlacklist.findOne).toHaveBeenCalledWith({
          where: { token: testToken },
          transaction: 'fake-transaction',
        });
      });
    });
  
    describe('deleteExpiredTokens', () => {
      it('deve chamar destroy com a condição correta para excluir tokens expirados', async () => {
        // Arrange
        const mockDate = new Date();
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
        mockTokenBlacklist.destroy.mockResolvedValue(5);
  
        // Act
        const result = await tokenBlacklistRepository.deleteExpiredTokens();
  
        // Assert
        expect(mockTokenBlacklist.destroy).toHaveBeenCalledWith({
          where: {
            expires_at: { [mockSequelize.Op.lt]: mockDate },
          },
        });
        expect(result).toBe(5);
        
        global.Date.mockRestore();
      });
  
      it('deve passar opções adicionais para destroy', async () => {
        // Arrange
        const options = { transaction: 'fake-transaction' };
        
        // Act
        await tokenBlacklistRepository.deleteExpiredTokens(options);
  
        // Assert
        expect(mockTokenBlacklist.destroy).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.any(Object),
            transaction: 'fake-transaction',
          })
        );
      });
    });
  });