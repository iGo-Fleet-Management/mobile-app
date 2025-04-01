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
      where: { trip_date: tripDate },
      transaction: options.transaction,
    });

    // Verifica corretamente se ambas as viagens (ida e volta) já existem
    const existingIda = existingTrips.some((trip) => trip.trip_type === 'ida');
    const existingVolta = existingTrips.some(
      (trip) => trip.trip_type === 'volta'
    );

    const tripsToCreate = [];

    if (!existingIda) {
      tripsToCreate.push({ trip_type: 'ida', trip_date: tripDate });
    }

    if (!existingVolta) {
      tripsToCreate.push({ trip_type: 'volta', trip_date: tripDate });
    }

    if (tripsToCreate.length === 0) {
      console.log(`Viagens já existem para ${tripDate}`);
      return existingTrips;
    }

    const createdTrips = await this.model.bulkCreate(tripsToCreate, {
      returning: true,
      transaction: options.transaction,
      ...options,
    });

    // Retorna todas as viagens para o dia, tanto existentes quanto recém-criadas
    return [
      ...existingTrips.filter(
        (trip) =>
          (trip.trip_type === 'ida' &&
            !tripsToCreate.some((t) => t.trip_type === 'ida')) ||
          (trip.trip_type === 'volta' &&
            !tripsToCreate.some((t) => t.trip_type === 'volta'))
      ),
      ...createdTrips,
    ];
  }
}

module.exports = new TripRepository();
