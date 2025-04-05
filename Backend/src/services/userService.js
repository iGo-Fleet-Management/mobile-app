const UserRepository = require('../repositories/userRepository');
const AddressRepository = require('../repositories/addressRepository');
const { withTransaction } = require('./utilities/transactionHelper');
const {
  getUserWithAddresses,
  checkUserExists,
} = require('./utilities/UserHelpers');

exports.deleteUser = async (userId) =>
  withTransaction(null, async (transaction) => {
    await checkUserExists(userId, transaction);
    await UserRepository.delete(userId, { transaction });
    return { message: 'Usuário deletado com sucesso' };
  });
