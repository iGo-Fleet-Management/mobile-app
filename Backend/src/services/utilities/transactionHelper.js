const sequelize = require('../../config/db');

exports.withTransaction = async (existingTransaction, callback) => {
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
