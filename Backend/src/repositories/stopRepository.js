const BaseRepository = require('./baseRepository');
const { Stop } = require('../models');
const { Op } = require('sequelize');

class StopRepository extends BaseRepository {
  constructor() {
    super(Stop);
  }

  async findStopsByUserId(userId, options = {}) {
    return this.model.findAll({
      where: { user_id: userId },
      ...options,
    });
  }

  async findStopsByAddressId(addressId, options = {}) {
    return this.findByField('address_id', addressId, options);
  }

  async findStopsByTripId(tripId, options = {}) {
    return this.findByField('trip_id', tripId, options);
  }

  async checkStopExists(userId, tripId, stopDate, options = {}) {
    return this.model.findOne({
      where: {
        user_id: userId,
        trip_id: tripId,
        stop_date: stopDate,
      },
      ...options,
    });
  }

  async deleteUserOtherStopsForTrips(userId, date, tripIds, transaction) {
    return this.model.destroy({
      where: {
        user_id: userId,
        stop_date: date,
        trip_id: { [Op.in]: tripIds },
      },
      transaction,
    });
  }

  async removeAllUserStops(userId, tripIds, transaction) {
    return this.model.destroy({
      where: {
        user_id: userId,
        trip_id: { [Op.in]: tripIds },
      },
      transaction,
    });
  }
}

module.exports = new StopRepository();
