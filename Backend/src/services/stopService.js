const sequelize = require('../config/db');
const { Stop, User, Address, Trip } = require('../models');
const StopRepository = require('../repositories/stopRepository');
const UserRepository = require('../repositories/userRepository');
const TripRepository = require('../repositories/tripRepository');
const AddressRepository = require('../repositories/addressRepository');

// Helper genérico para transações (já existente, mantido para contexto)
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

// Helper para verificar existência de entidades relacionadas
const validateStopRelations = async (stopData, transaction) => {
  const [user, address, trip] = await Promise.all([
    UserRepository.findById(stopData.user_id, { transaction }),
    AddressRepository.findById(stopData.address_id, { transaction }),
    TripRepository.findById(stopData.trip_id, { transaction }),
  ]);

  if (!user) throw new Error('Usuário não encontrado');
  if (!address) throw new Error('Endereço não encontrado');
  if (!trip) throw new Error('Viagem não encontrada');

  if (address.user_id !== stopData.user_id) {
    throw new Error('Endereço não pertence ao usuário');
  }
};

// Helper para carregar relações completas
const getStopWithRelations = async (stopId, transaction) =>
  StopRepository.findById(stopId, {
    include: [{ model: Trip, as: 'trip' }],
    transaction,
  });

exports.createStop = async (stopData, options = {}) =>
  withTransaction(options.transaction, async (transaction) => {
    // Validação do perfil completo
    const user = await UserRepository.findById(stopData.user_id);

    if (!user) {
      throw new Error('Usuário não encontrado'); // ✅ Lança erro se não existir
    }

    await validateStopRelations(stopData, transaction);

    // Verifica conflito de horário
    const existingStop = await StopRepository.checkStopExists(
      stopData.user_id,
      stopData.trip_id,
      stopData.stop_date,
      { transaction }
    );

    if (existingStop) {
      throw new Error('Já existe uma parada para este usuário na mesma data');
    }

    const newStop = await StopRepository.create(stopData, { transaction });
    return getStopWithRelations(newStop.stop_id, transaction);
  });

exports.updateStop = async (stopId, updateData, options = {}) =>
  withTransaction(options.transaction, async (transaction) => {
    const stop = await StopRepository.findById(stopId, { transaction });
    if (!stop) throw new Error('Parada não encontrada');

    if (updateData.user_id && updateData.user_id !== stop.user_id) {
      throw new Error('Não é permitido alterar o usuário da parada');
    }

    await validateStopRelations({ ...stop.get(), ...updateData }, transaction);

    await StopRepository.update(stopId, updateData, { transaction });
    return getStopWithRelations(stopId, transaction);
  });

exports.getUserStops = async (userId, options = {}) =>
  withTransaction(options.transaction, async (transaction) => {
    const stops = await StopRepository.findStopsByUserId(userId, {
      include: ['trip', 'address'],
      transaction,
    });
    return stops.map((stop) => stop.get({ plain: true }));
  });

exports.getTripStops = async (tripId, options = {}) =>
  withTransaction(options.transaction, async (transaction) => {
    const stops = await StopRepository.findStopsByTripId(tripId, {
      include: ['user', 'address'],
      transaction,
    });
    return stops.map((stop) => stop.get({ plain: true }));
  });

exports.cancelStop = async (stopId, options = {}) =>
  withTransaction(options.transaction, async (transaction) => {
    const stop = await StopRepository.findById(stopId, { transaction });
    if (!stop) throw new Error('Parada não encontrada');

    // Lógica adicional antes de deletar (ex: notificações)
    await StopRepository.delete(stopId, { transaction });
    return { message: 'Parada cancelada com sucesso' };
  });

// Método para verificar disponibilidade em uma parada
exports.checkStopAvailability = async (tripId, stopDate, options = {}) => {
  const stopsCount = await StopRepository.model.count({
    where: {
      trip_id: tripId,
      stop_date: {
        [Op.between]: [
          new Date(stopDate.getTime() - 30 * 60000), // 30 minutos antes
          new Date(stopDate.getTime() + 30 * 60000), // 30 minutos depois
        ],
      },
    },
    ...options,
  });

  return stopsCount < 10; // Exemplo: limite de 10 paradas por janela de tempo
};
