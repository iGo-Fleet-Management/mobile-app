const BaseRepository = require('./baseRepository');
const { Trip } = require('../models');

class TripRepository extends BaseRepository {
  constructor() {
    super(Trip);
  }

  async findTripsByDate(startDate, endDate, options = {}) {
    return this.model.findAll({
      where: {
        trip_date: {
          [Op.between]: [startDate, endDate],
        },
      },
      ...options,
    });
  }

  async findTripsByType(tripType, options = {}) {
    return this.findByField('trip_type', tripType, options);
  }

  async getStopsForTrip(tripId, options = {}) {
    return this.findById(tripId, {
      include: ['stops'],
      ...options,
    });
  }

  async findTripByDateAndType(date, tripType, options = {}) {
    return this.model.findOne({
      where: {
        trip_date: date,
        trip_type: tripType,
      },
      ...options,
    });
  }

  async createDailyTrips(tripDate, options = {}) {
    const existingTrips = await this.model.findAll({
      where: {
        trip_date: tripDate,
      },
    });

    if (existingTrips.length >= 2) return existingTrips;

    const tripsToCreate = [
      { trip_type: 'ida', trip_date: tripDate },
      { trip_type: 'volta', trip_date: tripDate },
    ];

    return this.model.bulkCreate(tripsToCreate, options);
  }
}

module.exports = new TripRepository();
