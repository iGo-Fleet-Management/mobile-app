const BaseRepository = require('./baseRepository');
const { User } = require('../models');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email, options = {}) {
    return this.findByField('email', email, options);
  }

  async isProfileComplete(userId, options = {}) {
    const user = await this.findById(userId, {
      include: ['addresses'],
      ...options,
    });

    return !!(
      user.cpf &&
      user.birthdate &&
      user.phone &&
      user.addresses?.length > 0
    );
  }
}

module.exports = new UserRepository();
