const sequelize = require('../config/db');
const UserRepository = require('../repositories/userRepository');
const AddressRepository = require('../repositories/addressRepository');
const { User, Address } = require('../models');
const userRepository = require('../repositories/userRepository');
const addressRepository = require('../repositories/addressRepository');

exports.getProfileById = async (user_id) => {
  if (!user_id) {
    throw new Error('ID do usuário não fornecido');
  }

  try {
    const user = await UserRepository.findById(user_id, {
      include: [
        {
          model: Address,
          as: 'addresses',
          attributes: { exclude: ['user_id'] },
        },
      ],
      attributes: { exclude: ['password_hash', 'reset_password'] },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return user;
  } catch (error) {
    throw new Error(`Erro ao buscar perfil: ${error.message}`);
  }
};

exports.saveProfile = async (userId, userData, options = {}) => {
  const { transaction: existingTransaction, isInitialCompletion = false } =
    options;
  let transaction = existingTransaction;

  try {
    if (!transaction) {
      transaction = await sequelize.transaction();
    }

    // Verificação de existência do usuário
    const existingUser = await UserRepository.findById(userId, { transaction });
    if (!existingUser) {
      throw new Error('Usuário não encontrado');
    }

    // Preparar dados do usuário
    let userDataToUpdate = userData;
    if (isInitialCompletion) {
      userDataToUpdate = {
        cpf: userData.cpf,
        birthdate: userData.birthdate,
        phone: userData.phone,
      };
    }

    // Atualizar usuário se houver dados
    let updatedUser;
    if (userDataToUpdate && Object.keys(userDataToUpdate).length > 0) {
      updatedUser = await UserRepository.update(userId, userDataToUpdate, {
        transaction,
      });
    }

    if (!existingTransaction) {
      await transaction.commit();
    }

    const result = await UserRepository.findById(userId, {
      attributes: { exclude: ['password_hash', 'reset_password'] },
    });
    return result;
  } catch (error) {
    // Rollback apenas se a transação foi criada nesta função
    if (!existingTransaction && transaction) {
      await transaction.rollback();
    }
    throw error;
  }
};

exports.saveAddress = async (userId, addressUpdates, options = {}) => {
  const { transaction: existingTransaction, isInitialCompletion = false } =
    options;
  let transaction = existingTransaction;

  try {
    // Criar transação apenas se não foi fornecida externamente
    if (!transaction) {
      transaction = await sequelize.transaction();
    }

    const existingUser = await UserRepository.findById(userId, { transaction });
    if (!existingUser) {
      throw new Error('Usuário não encontrado');
    }

    const addressesToProcess = isInitialCompletion
      ? [{ ...addressUpdates, user_id: userId }]
      : addressUpdates.map((addr) => ({
          ...addr,
          user_id: !addr.address_id ? userId : undefined,
        }));

    const updatedAddresses = [];
    for (const addrData of addressesToProcess) {
      const address = await AddressRepository.updateOrCreate(addrData, {
        transaction,
        where: addrData.address_id ? { user_id: userId } : undefined,
      });
      updatedAddresses.push(address);
    }

    // Commit apenas se a transação foi criada nesta função
    if (!existingTransaction) {
      await transaction.commit();
    }

    const result = await UserRepository.findById(userId, {
      include: [
        {
          model: Address,
          as: 'addresses',
          attributes: { exclude: ['user_id'] },
        },
      ],
      attributes: { exclude: ['password_hash', 'reset_password'] },
    });
    return result;
  } catch (error) {
    // Rollback apenas se a transação foi criada nesta função
    if (!existingTransaction && transaction) {
      await transaction.rollback();
    }
    throw error;
  }
};

// Método que coordena ambas as operações quando necessário
exports.createProfile = async (userId, userData, addressData, options = {}) => {
  console.log('addressData recebido:', addressData);
  const transaction = await sequelize.transaction();

  try {
    // Verificar existência do usuário
    const existingUser = await UserRepository.findById(userId, { transaction });
    if (!existingUser) {
      throw new Error('Usuário não encontrado');
    }

    // Atualizar dados do usuário
    let updatedUser = null;
    if (userData && Object.keys(userData).length > 0) {
      updatedUser = await UserRepository.update(userId, userData, {
        transaction,
      });
    }

    // Criar endereço (note que addressData é um objeto único, não um array)
    if (addressData) {
      // Adicionar user_id ao endereço
      const addressToCreate = {
        ...addressData,
        user_id: userId,
      };

      console.log('addressToCreate:', addressToCreate);
      // Usar o método create do AddressRepository
      await AddressRepository.create(addressToCreate, { transaction });
    }

    await transaction.commit();

    // Retornar o usuário com endereços
    const result = await UserRepository.findById(userId, {
      include: [
        {
          model: Address,
          as: 'addresses',
          attributes: { exclude: ['user_id'] },
        },
      ],
      attributes: { exclude: ['password_hash', 'reset_password'] },
    });
    return result;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.deleteUser = async (userId) => {
  const transaction = await sequelize.transaction();
  try {
    const existingUser = await UserRepository.findById(userId, { transaction });
    if (!existingUser) {
      throw new Error('Usuário não encontrado');
    }

    const result = await UserRepository.delete(userId, { transaction });

    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
