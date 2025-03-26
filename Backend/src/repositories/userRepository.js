// repositories/userRepository.js
const { User, Address } = require('../models');
const { Op } = require('sequelize');

/**
 * Repositório de operações de usuário
 * Centraliza todas as interações diretas com o banco de dados
 */
class UserRepository {
  /**
   * Encontra usuário por ID
   * @param {string} id - ID do usuário
   * @returns {Promise<User>} - Usuário encontrado
   */
  async findById(id, transaction = null) {
    const options = {
      include: [
        {
          model: Address,
          as: 'addresses',
          attributes: { exclude: ['user_id'] },
        },
      ],
      attributes: { exclude: ['password_hash'] },
    };

    if (transaction) {
      options.transaction = transaction;
    }

    return User.findByPk(id, options);
  }

  /**
   * Atualiza dados do usuário
   * @param {string} id - ID do usuário
   * @param {Object} data - Dados para atualização
   * @returns {Promise<User>} - Usuário atualizado
   */
  async update(id, data, transaction = null) {
    const options = {
      where: { user_id: id },
    };

    if (transaction) {
      options.transaction = transaction;
    }

    const [updatedRows] = await User.update(data, options);

    if (updatedRows === 0) {
      throw new Error('Usuário não encontrado');
    }

    return this.findById(id, transaction); // Passa a transação para o findById
  }

  /**
   * Verifica se perfil está completo
   * @param {string} id - ID do usuário
   * @returns {Promise<boolean>} - Status de perfil completo
   */
  async isProfileComplete(id) {
    const user = await this.findById(id);
    return !!(
      user.cpf &&
      user.birthdate &&
      user.phone &&
      user.addresses.length > 0
    );
  }
}

module.exports = new UserRepository();
