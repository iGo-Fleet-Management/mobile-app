const sequelize = require('../config/db');
const UserRepository = require('../repositories/userRepository');
const AddressRepository = require('../repositories/addressRepository');
const { User, Address } = require('../models');

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

exports.saveProfile = async (
  userId,
  userData,
  addressUpdates,
  options = {}
) => {
  const { isInitialCompletion = false } = options;
  const transaction = await sequelize.transaction();

  try {
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
    if (Object.keys(userDataToUpdate).length > 0) {
      updatedUser = await UserRepository.update(userId, userDataToUpdate, {
        transaction,
      });
    }

    // Processar endereços
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
