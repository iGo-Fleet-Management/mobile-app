const { Op } = require('sequelize');
const { DateTime } = require('luxon');
const sequelize = require('../config/db');
const { Stop } = require('../models');
const TripRepository = require('../repositories/tripRepository');
const StopRepository = require('../repositories/stopRepository');
const StopService = require('./stopService');

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

exports.createDailyTrips = async (tripDate = new Date()) => {
  return withTransaction(async (transaction) => {
    const zone = 'America/Sao_Paulo';
    const parsedDate = DateTime.fromJSDate(tripDate).setZone(zone);
    const now = DateTime.now().setZone(zone);

    if (parsedDate < now.startOf('day')) {
      throw new Error('Não é possível criar viagens para datas passadas');
    }

    const dateOnly = parsedDate.toFormat('yyyy-MM-dd');
    return TripRepository.createDailyTrips(dateOnly, { transaction });
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

// Método para obter viagens do dia
exports.getDailyTrips = async (date) => {
  const zoneDate = date
    ? DateTime.fromISO(date, { zone: 'America/Sao_Paulo' })
    : DateTime.now().setZone('America/Sao_Paulo');

  if (!zoneDate.isValid) {
    throw new Error('Data inválida');
  }

  const dateOnly = zoneDate.toFormat('yyyy-MM-dd');

  const trips = await TripRepository.model.findAll({
    where: {
      trip_date: dateOnly,
    },
  });

  return trips;
};
