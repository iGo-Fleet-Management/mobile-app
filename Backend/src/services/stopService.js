const sequelize = require('../config/db');
const { Op } = require('sequelize');
const { Stop, User, Address, Trip } = require('../models');
const StopRepository = require('../repositories/stopRepository');
const UserRepository = require('../repositories/userRepository');
const TripRepository = require('../repositories/tripRepository');
const AddressRepository = require('../repositories/addressRepository');

const withTransaction = async (existingTransaction, callback) => {
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

// Helper para obter paradas existentes de um usuário em uma viagem específica
const getExistingStop = async (userId, tripId, transaction) => {
  return StopRepository.findOne({
    where: {
      user_id: userId,
      trip_id: tripId,
    },
    transaction,
  });
};

// Helper para verificar existência de entidades relacionadas
const validateStopRelations = async (stopData, transaction) => {
  // 1. Buscar entidades relacionadas
  const [user, address, trip] = await Promise.all([
    UserRepository.findById(stopData.user_id, { transaction }),
    AddressRepository.findById(stopData.address_id, { transaction }),
    TripRepository.findById(stopData.trip_id, {
      transaction,
      include: [{ model: Stop, as: 'stops' }], // Carrega paradas para validações extras
    }),
  ]);

  // 2. Validações básicas de existência
  if (!user) throw new Error('Usuário não encontrado');
  if (!address) throw new Error('Endereço não encontrado');
  if (!trip) throw new Error('Viagem não encontrada');

  // 3. Validação de propriedade do endereço
  if (address.user_id !== stopData.user_id) {
    throw new Error('Endereço não pertence ao usuário');
  }

  // 4. Validação específica da viagem (nova!)
  const stopDate = new Date(stopData.stop_date);
  const tripDate = new Date(trip.trip_date);

  // Converter para formato ISO e extrair a parte da data (YYYY-MM-DD)
  const stopDateStr = stopDate.toISOString().split('T')[0];
  const tripDateStr = tripDate.toISOString().split('T')[0];

  if (stopDateStr !== tripDateStr) {
    throw new Error('Data da parada não corresponde à data da viagem');
  }

  // Garantir que a data da parada coincide com a data da viagem
  if (
    stopDate.getUTCFullYear() !== tripDate.getUTCFullYear() ||
    stopDate.getUTCMonth() !== tripDate.getUTCMonth() ||
    stopDate.getUTCDate() !== tripDate.getUTCDate()
  ) {
    throw new Error('Data da parada não corresponde à data da viagem');
  }

  // 5. Validação de capacidade da viagem (opcional)
  if (trip.stops && trip.stops.length >= 10) {
    // Exemplo: limite de 10 paradas
    throw new Error('Viagem atingiu o limite máximo de paradas');
  }
};

// Helper para excluir paradas fora dos tipos especificados
const deleteOtherStops = async (userId, allowedTripIds, date, transaction) => {
  const trips = await TripRepository.findAll({
    where: {
      trip_date: date,
      trip_id: { [Op.notIn]: allowedTripIds },
    },
    attributes: ['trip_id'],
    transaction,
  });

  if (trips.length === 0) return;

  await StopRepository.model.destroy({
    where: {
      user_id: userId,
      trip_id: { [Op.in]: trips.map((t) => t.trip_id) },
    },
    transaction,
  });
};

exports.upsertStop = async (stopData, transaction) => {
  return withTransaction(transaction, async (t) => {
    // Verificar se a parada já existe
    const existingStop = await StopRepository.findOne({
      where: {
        user_id: stopData.user_id,
        trip_id: stopData.trip_id,
      },
      transaction,
    });

    // Fazer upsert (atualizar ou criar)
    if (existingStop) {
      return StopRepository.update(existingStop.stop_id, stopData, {
        transaction: t,
      });
    } else {
      return StopRepository.create(stopData, { transaction: t });
    }
  });
};

// Função para adicionar viagem de ida e volta
exports.addRoundTripStop = async (
  userId,
  date,
  goStopData,
  backStopData,
  options = {}
) => {
  return withTransaction(options.transaction, async (transaction) => {
    const [goTrip, backTrip] = await Promise.all([
      TripRepository.findTripByDateAndType(date, 'ida', { transaction }),
      TripRepository.findTripByDateAndType(date, 'volta', { transaction }),
    ]);

    if (!goTrip || !backTrip) {
      throw new Error(
        'Viagens de ida e/ou volta não encontradas para esta data'
      );
    }

    // Preparar dados das paradas
    const baseData = { user_id: userId };
    const goData = {
      ...baseData,
      ...goStopData,
      trip_id: goTrip.trip_id,
    };
    const backData = {
      ...baseData,
      ...backStopData,
      trip_id: backTrip.trip_id,
    };

    // Validar relações
    await Promise.all([
      validateStopRelations(goData, transaction),
      validateStopRelations(backData, transaction),
    ]);

    // Remover paradas de outros tipos
    await deleteOtherStops(
      userId,
      [goTrip.trip_id, backTrip.trip_id],
      date,
      transaction
    );

    // Processar paradas de ida e volta
    const [goStop, backStop] = await Promise.all([
      exports.upsertStop(goData, transaction), // ✅ Usar exports
      exports.upsertStop(backData, transaction),
    ]);

    return { goStop, backStop };
  });
};
