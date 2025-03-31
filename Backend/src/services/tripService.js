const { Op } = require('sequelize');
const { DateTime } = require('luxon');
const sequelize = require('../config/db');
const { Trip, Stop } = require('../models');
const TripRepository = require('../repositories/tripRepository');
const StopRepository = require('../repositories/stopRepository');

// Helper genérico para transações
const withTransaction = async (callback, existingTransaction = null) => {
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

// Helper para buscar viagem com paradas
const getTripWithStops = async (tripId, transaction) =>
  TripRepository.findById(tripId, {
    include: [
      {
        model: Stop,
        as: 'stops',
        // Usar a mesma estrutura de includes do StopService
        include: [
          { model: User, as: 'user' },
          { model: Address, as: 'address' },
        ],
      },
    ],
    transaction,
  });

// Verificador de existência de viagem
const checkTripExists = async (tripId, transaction) => {
  const trip = await TripRepository.findById(tripId, { transaction });
  if (!trip) throw new Error('Viagem não encontrada');
  return trip;
};

const setDefaultTime = (date, hours) => {
  const baseDate = DateTime.fromJSDate(date).setZone('America/Sao_Paulo');
  return baseDate.set({ hour: hours, minute: 0, second: 0 }).toJSDate();
};

exports.createDailyTrips = async (tripDate = new Date()) => {
  return withTransaction(async (transaction) => {
    // Validação de data
    const parsedDate =
      DateTime.fromJSDate(tripDate).setZone('America/Sao_Paulo');
    if (parsedDate < DateTime.now().setZone('America/Sao_Paulo')) {
      throw new Error('Não é possível criar viagens para datas passadas');
    }

    // Define período de 24h
    const dateStart = parsedDate.startOf('day').toJSDate();
    const dateEnd = parsedDate.endOf('day').toJSDate();

    // Verifica viagens existentes
    const existingTrips = await TripRepository.model.findAll({
      where: {
        trip_date: {
          [Op.between]: [dateStart, dateEnd],
        },
      },
      transaction,
    });

    // Retorna existentes se já houver 2
    if (existingTrips.length >= 2) {
      console.log(`Viagens já existem para ${parsedDate.toISODate()}`);
      return existingTrips.map((trip) => trip.get({ plain: true }));
    }

    // Cria novas viagens
    const tripsToCreate = [
      {
        trip_type: 'ida',
        trip_date: setDefaultTime(tripDate, 8),
        status: 'pending',
      },
      {
        trip_type: 'volta',
        trip_date: setDefaultTime(tripDate, 18),
        status: 'pending',
      },
    ];

    const createdTrips = await TripRepository.model.bulkCreate(tripsToCreate, {
      returning: true,
      transaction,
    });

    console.log(
      `Viagens criadas para ${parsedDate.toISODate()}:`,
      createdTrips.map((trip) => trip.trip_type)
    );

    return createdTrips.map((trip) => trip.get({ plain: true }));
  });
};

exports.getTripById = async (tripId) => {
  if (!tripId) throw new Error('ID da viagem não fornecido');
  const trip = await getTripWithStops(tripId);
  if (!trip) throw new Error('Viagem não encontrada');
  return trip;
};

exports.updateTrip = async (tripId, tripData, options = {}) =>
  withTransaction(options.transaction, async (transaction) => {
    await checkTripExists(tripId, transaction);
    await TripRepository.update(tripId, tripData, { transaction });
    return getTripWithStops(tripId, transaction);
  });

exports.addStopToTrip = async (tripId, stopData, options = {}) =>
  withTransaction(options.transaction, async (transaction) => {
    await checkTripExists(tripId, transaction);

    // Usar o StopService em vez do repository diretamente
    const newStop = await StopService.createStop(
      { ...stopData, trip_id: tripId },
      { transaction }
    );

    return this.getTripById(tripId, { transaction });
  });

exports.deleteTrip = async (tripId) =>
  withTransaction(null, async (transaction) => {
    try {
      await checkTripExists(tripId, transaction);
      const stopCount = await StopRepository.model.count({
        where: { trip_id: tripId },
        transaction,
      });

      if (stopCount > 0) {
        throw new Error(
          'Não é possível deletar viagens com paradas associadas'
        );
      }

      await TripRepository.delete(tripId, { transaction });
      return { message: 'Viagem deletada com sucesso' };
    } catch (error) {
      throw new Error(`Falha ao deletar viagem: ${error.message}`);
    }
  });

// Helper para definir horário padrão
exports.setDefaultTime = (date, hours) => {
  const newDate = new Date(date);
  newDate.setHours(hours, 0, 0, 0);
  return newDate;
};

// Método para obter viagens do dia
exports.getDailyTrips = async (date = new Date()) => {
  const trips = await TripRepository.model.findAll({
    where: {
      trip_date: {
        [Op.between]: [
          new Date(date.setHours(0, 0, 0, 0)),
          new Date(date.setHours(23, 59, 59, 999)),
        ],
      },
    },
  });

  return Promise.all(
    trips.map(async (trip) => ({
      ...trip.get({ plain: true }),
      stops: await StopService.getTripStops(trip.trip_id),
    }))
  );
};
