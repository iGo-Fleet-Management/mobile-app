const { Address } = require('../models');

class BaseRepository {
  constructor(model, primaryKey) {
    this.model = model;
    this.primaryKey = primaryKey;
  }

  async get(id) {
    return await this.model.findByPk(id);
  }

  async create(data, options = {}) {
    return await this.model.create(data, options);
  }

  async update(id, data, options = {}) {
    const whereClause = { where: { [this.primaryKey]: id } };
    await this.model.update(data, whereClause);
    return await this.model.findByPk(id);
  }

  async delete(id) {
    return await this.model.destroy({
      where: { [this.primaryKey]: id },
    });
  }
}

class AddressRepository extends BaseRepository {
  constructor() {
    super(Address, 'address_id');
  }

  async findByUserId(userId, options = {}) {
    return await Address.findAll({
      where: { user_id: userId },
      ...options,
    });
  }

  async updateOrCreate(addressData, options = {}) {
    const { transaction } = options;

    if (addressData.address_id) {
      return await this.update(addressData.address_id, addressData, {
        transaction,
      });
    } else {
      return await this.create(addressData, { transaction });
    }
  }
}

module.exports = new AddressRepository();
