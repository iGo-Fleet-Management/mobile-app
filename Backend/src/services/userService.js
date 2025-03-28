const sequelize = require('../config/db');
const UserRepository = require('../repositories/userRepository');
const AddressRepository = require('../repositories/addressRepository');
const { User, Address } = require('../models');

// Serviço para completar o perfil do usuário
exports.completeProfile = async (userId, userData, addressUpdates) => {
  // Preparar dados do usuário considerando campos obrigatórios
  const mappedUserData = {
    cpf: userData.cpf,
    birthdate: userData.birthdate,
    phone: userData.phone,
  };

  const transaction = await sequelize.transaction();
  try {
    // Verificação adicional de existência do usuário
    const existingUser = await User.findByPk(userId);
    if (!existingUser) {
      throw new Error('Usuário não encontrado');
    }

    // Atualizar usuário
    await existingUser.update(mappedUserData, { transaction });

    // Criar endereço
    await AddressRepository.updateOrCreate(
      { ...addressUpdates, user_id: userId },
      { transaction }
    );

    await transaction.commit();
    return UserRepository.findById(userId, {
      include: [
        {
          model: Address,
          as: 'addresses',
          attributes: { exclude: ['user_id'] },
        },
      ],
      attributes: { exclude: ['password_hash', 'reset_password'] },
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

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

exports.updateProfile = async (userId, userData, addressUpdates = []) => {
  const transaction = await sequelize.transaction();
  try {
    // Verifique se o usuário existe
    const existingUser = await UserRepository.findById(userId, { transaction });
    if (!existingUser) {
      throw new Error('Usuário não encontrado');
    }
    // Atualizar usuário
    let updatedUser;
    if (Object.keys(userData).length > 0) {
      updatedUser = await UserRepository.update(userId, userData, {
        transaction,
      });
    }

    // Processar endereços
    const updatedAddresses = [];
    for (const addrData of addressUpdates) {
      if (!addrData.address_id) {
        addrData.user_id = userId;
      }
      const address = await AddressRepository.updateOrCreate(addrData, {
        transaction,
        where: addrData.address_id ? { user_id: userId } : undefined,
      });
      updatedAddresses.push(address);
    }

    await transaction.commit();
    return UserRepository.findById(userId, {
      include: [
        {
          model: Address,
          as: 'addresses',
          attributes: { exclude: ['user_id'] },
        },
      ],
      attributes: { exclude: ['password_hash', 'reset_password'] },
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
