const sequelize = require('../config/db');
const User = require('../models/User');
const Address = require('../models/Address');

exports.completeProfile = async (userId, userData, addressData) => {
  const transaction = await sequelize.transaction();

  try {
    const [updatedRows] = await User.update(userData, {
      where: { user_id: userId },
      returning: true,
      transaction,
    });

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
        user_id: userId, // Chave estrangeira
      },
      { transaction }
    );

    await transaction.commit();
    return { user: updatedRows[0], address };
  } catch (error) {
    await transaction.rollback();
    error.code = 'Erro na alteração dos dados';
    throw error;
  }
};
