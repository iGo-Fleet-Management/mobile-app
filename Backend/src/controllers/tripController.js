const TripService = require('../services/tripService');
const { DateTime } = require('luxon'); // 👈 Importação faltando

//tranformar essa função para buscar paradas
exports.getTrip = async (req, res) => {
  try {
    const trip = await TripService.getTripById(req.params.tripId);
    if (!trip)
      return res
        .status(404)
        .json({ status: 'fail', message: 'Viagem não encontrada' });

    res.status(200).json({
      status: 'success',
      data: trip,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar viagem',
    });
  }
};

exports.getDailyTrips = async (req, res) => {
  try {
    const { date } = req.query;

    const trips = await TripService.getDailyTrips(date);

    res.status(200).json({
      status: 'success',
      results: trips.length,
      data: trips.map((trip) => ({
        ...trip.get({ plain: true }),
        stops: trip.stops.map((stop) => ({
          id: stop.stop_id,
          date: stop.stop_date,
          address: stop.address,
        })),
      })),
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    await TripService.deleteTrip(req.params.tripId);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};
