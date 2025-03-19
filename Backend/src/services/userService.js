const sequelize = require('../config/db');
const User = require('../models/User');
const Address = require('../models/Address');

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
