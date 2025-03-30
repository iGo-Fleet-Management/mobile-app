const sequelize = require('../config/db');
const { User, Address } = require('../models');
const UserRepository = require('../repositories/userRepository');
const AddressRepository = require('../repositories/addressRepository');

// Helper genérico para transações
const withTransaction = async (existingTransaction, callback) => {
  const transaction = existingTransaction || (await sequelize.transaction());
  try {
    const result = await callback(transaction);
    if (!existingTransaction) await transaction.commit();
    return result;
  } catch (error) {
    if (!existingTransaction && transaction) await transaction.rollback();
    throw error;
  }
};

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

exports.getProfileById = async (userId) => {
  if (!userId) throw new Error('ID do usuário não fornecido');
  const user = await getUserWithAddresses(userId);
  if (!user) throw new Error('Usuário não encontrado');
  return user;
};

exports.saveProfile = async (userId, userData, options = {}) =>
  withTransaction(options.transaction, async (transaction) => {
    await checkUserExists(userId, transaction);

    if (options.isInitialCompletion) {
      userData = {
        cpf: userData.cpf,
        birthdate: userData.birthdate,
        phone: userData.phone,
      };
    }

    if (userData && Object.keys(userData).length > 0) {
      await UserRepository.update(userId, userData, { transaction });
    }

    return getUserWithAddresses(userId, transaction);
  });

exports.saveAddress = async (userId, addressUpdates, options = {}) =>
  withTransaction(options.transaction, async (transaction) => {
    await checkUserExists(userId, transaction);

    const addressesToProcess = options.isInitialCompletion
      ? [{ ...addressUpdates, user_id: userId }]
      : addressUpdates.map((addr) => ({
          ...addr,
          user_id: addr.address_id ? undefined : userId,
        }));

    await Promise.all(
      addressesToProcess.map((addrData) =>
        AddressRepository.updateOrCreate(addrData, {
          transaction,
          where: addrData.address_id ? { user_id: userId } : undefined,
        })
      )
    );

    return getUserWithAddresses(userId, transaction);
  });

exports.createProfile = async (userId, userData, addressData) =>
  withTransaction(null, async (transaction) => {
    await checkUserExists(userId, transaction);

    if (userData?.length)
      await UserRepository.update(userId, userData, { transaction });
    if (addressData)
      await AddressRepository.create(
        { ...addressData, user_id: userId },
        { transaction }
      );

    return getUserWithAddresses(userId, transaction);
  });

exports.deleteUser = async (userId) =>
  withTransaction(null, async (transaction) => {
    await checkUserExists(userId, transaction);
    await UserRepository.delete(userId, { transaction });
    return { message: 'Usuário deletado com sucesso' };
  });
