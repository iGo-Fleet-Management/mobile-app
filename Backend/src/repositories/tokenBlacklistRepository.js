const BaseRepository = require('./baseRepository');
const { TokenBlacklist } = require('../models/'); // Importação direta

class TokenBlacklistRepository extends BaseRepository {
  constructor() {
    super(TokenBlacklist);
  }

  async findByToken(token, options = {}) {
    return this.model.findOne({
      where: { token },
      ...options,
    });
  }

  async deleteExpiredTokens(options = {}) {
    const { Sequelize } = require('../config/db');
    return this.model.destroy({
      where: {
        expires_at: { [Sequelize.Op.lt]: new Date() },
      },
      ...options,
    });
  }
}

module.exports = new TokenBlacklistRepository();
