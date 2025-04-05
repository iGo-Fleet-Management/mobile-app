const { Address } = require('../../models');
const UserRepository = require('../../repositories/userRepository');

// Helper para buscar usuário com endereços
const getUserWithAddresses = async (userId, transaction) =>
  UserRepository.findById(userId, {
    include: [
      {
        model: Address,
        as: 'addresses',
        attributes: { exclude: ['user_id'] },
      },
    ],
    attributes: { exclude: ['password_hash', 'reset_password'] },
    transaction,
  });

// Verificador de existência de usuário
const checkUserExists = async (userId, transaction) => {
  const user = await UserRepository.findById(userId, { transaction });
  if (!user) throw new Error('Usuário não encontrado');
  return user;
};

module.exports = {
  getUserWithAddresses,
  checkUserExists,
};
