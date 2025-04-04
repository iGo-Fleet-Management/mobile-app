const { withTransaction } = require('./utilities/transactionHelper');
const { validateStopRelations } = require('./utilities/stopValidator');
const stopManager = require('./utilities/stopManager');
const TripRepository = require('../repositories/tripRepository');

exports.upsertStop = async (stopData, transaction) => {
  return withTransaction(transaction, async (t) => {
    return stopManager.upsertStop(stopData, t);
  });
};

// Função para adicionar viagem de ida e volta
exports.addRoundTripStop = async (
  userId,
  date,
  goStopDate,
  backStopDate,
  options = {}
) => {
  return withTransaction(options.transaction, async (transaction) => {
    // Buscar viagens de ida e volta
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
      ...goStopDate,
      trip_id: goTrip.trip_id,
    };
    const backData = {
      ...baseData,
      ...backStopDate,
      trip_id: backTrip.trip_id,
    };

    // Validar relações
    await Promise.all([
      validateStopRelations(goData, transaction),
      validateStopRelations(backData, transaction),
    ]);

    // Remover paradas de outros tipos
    await stopManager.deleteOtherStops(
      userId,
      [goTrip.trip_id, backTrip.trip_id],
      date,
      transaction
    );

    // Processar paradas de ida e volta
    const [goStop, backStop] = await Promise.all([
      stopManager.upsertStop(goData, transaction),
      stopManager.upsertStop(backData, transaction),
    ]);

    return { goStop, backStop };
  });
};
