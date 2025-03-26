const sequelize = require('../config/db');
const { User, Address } = require('../models');

// Serviço para completar o perfil do usuário
exports.completeProfile = async (user_id, userData, addressData) => {
  //Inicia uma transação para garantir atomicidade
  const transaction = await sequelize.transaction();

  try {
    // Atualiza os dados do usuário
    const [updatedRows] = await User.update(userData, {
      where: { user_id: user_id },
      returning: true, // Retorna os dados atualizados
      transaction, // Associa a transação
    });

    // Cria o endereço do usuário
    const address = await Address.create(
      {
        address_type: addressData.address_type,
        cep: addressData.cep,
        street: addressData.street,
        number: addressData.number,
        complement: addressData.complement || null, // Campo opcional
        neighbourhood: addressData.neighbourhood,
        city: addressData.city,
        state: addressData.state,
        user_id: user_id, // Chave estrangeira
      },
      { transaction } // Associa a transação
    );

    // Confirma a transação
    await transaction.commit();

    //Retorna os dados atualizados
    return { user: updatedRows[0], address };
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
    const user = await User.findByPk(user_id, {
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

exports.updateProfile = async (user_id, userData, addressUpdates) => {
  if (!user_id) throw new Error('ID do usuário não fornecido');

  const transaction = await sequelize.transaction();

  try {
    // Atualização do usuário
    const user = await User.findByPk(user_id, { transaction });
    if (!user) throw new Error('Usuário não encontrado');

    if (userData && Object.keys(userData).length > 0) {
      await User.update(userData, {
        where: { user_id },
        transaction,
      });
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

    // Busca dados atualizados ANTES do commit (dentro da transação)
    const updatedUser = await User.findByPk(user_id, {
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          model: Address,
          as: 'addresses',
          attributes: { exclude: ['user_id'] },
        },
      ],
      transaction,
    });

    await transaction.commit();

    return {
      user: updatedUser,
    };
  } catch (error) {
    await transaction.rollback();
    throw new Error(`Erro na atualização: ${error.message}`);
  }
};
