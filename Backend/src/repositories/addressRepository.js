const BaseRepository = require('./baseRepository');
const { Address } = require('../models');

class AddressRepository extends BaseRepository {
  constructor() {
    super(Address);
  }

  async findByUserId(userId, options = {}) {
    return this.model.findAll({
      where: { user_id: userId },
      ...options,
    });
  }

  async updateOrCreate(addressData, options = {}) {
    const { transaction } = options;
    // Garantir que user_id está presente
    if (addressData.address_id) {
      return this.update(addressData.address_id, addressData, { transaction });
    }

    // Se não existe, criar novo endereço
    return this.create(addressData, { transaction });
  }
}

module.exports = new AddressRepository();
