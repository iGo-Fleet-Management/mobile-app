const sequelize = require('../config/db');
const UserRepository = require('../repositories/userRepository');
const { User, Address } = require('../models');

// Serviço para completar o perfil do usuário
exports.completeProfile = async (user_id, userData, addressData) => {
  //Inicia uma transação para garantir atomicidade
  const transaction = await sequelize.transaction();

  try {
    // Atualiza os dados do usuário
    const user = await UserRepository.update(user_id, userData, transaction);

    // Cria o endereço do usuário
    const address = await Address.create(
      {
        ...addressData,
        user_id,
      },
      { transaction }
    );

    // Confirma a transação
    await transaction.commit();

    //Retorna os dados atualizados
    return { user, address };
  } catch (error) {
    // Em caso de erro, reverte a transação
    await transaction.rollback();

    // Lança erro com código customizado
    error.code = 'Erro na alteração dos dados';
    throw error;
  }
};

exports.getProfileById = async (user_id) => {
  if (!user_id) {
    throw new Error('ID do usuário não fornecido');
  }

  try {
    const user = await UserRepository.findById(user_id);

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return user;
  } catch (error) {
    throw new Error(`Erro ao buscar perfil: ${error.message}`);
  }
};

exports.updateProfile = async (user_id, userData, addressUpdates) => {
  if (!user_id) throw new Error('ID do usuário não fornecido');

  const transaction = await sequelize.transaction();

  try {
    // Atualização do usuário
    const existingUser = await UserRepository.findById(user_id);
    if (!existingUser) throw new Error('Usuario não encontrado');

    let user = existingUser;
    if (userData && Object.keys(userData).length > 0) {
      user = await UserRepository.update(user_id, userData);
    }

    // Nova lógica para endereços (1:N)
    let updatedAddresses = [];
    if (addressUpdates && addressUpdates.length > 0) {
      for (const addrData of addressUpdates) {
        if (addrData.address_id) {
          // Atualizar endereço existente
          const [affectedRows] = await Address.update(addrData, {
            where: {
              address_id: addrData.address_id,
              user_id, // Garante que o endereço pertence ao usuário
            },
            transaction,
          });

          if (affectedRows === 0) {
            throw new Error(
              `Endereço ${addrData.address_id} não encontrado ou não pertence ao usuário`
            );
          }
        } else {
          // Criar novo endereço
          const newAddress = await Address.create(
            {
              ...addrData,
              user_id,
            },
            { transaction }
          );
          updatedAddresses.push(newAddress);
        }
      }
    }

    await transaction.commit();

    // Busca dados atualizados ANTES do commit (dentro da transação)
    const updatedUser = await UserRepository.findById(user_id);

    return {
      user: updatedUser,
    };
  } catch (error) {
    await transaction.rollback();
    throw new Error(`Erro na atualização: ${error.message}`);
  }
};

exports.isProfileComplete = async (user_id) => {
  return UserRepository.isProfileComplete(user_id);
};
