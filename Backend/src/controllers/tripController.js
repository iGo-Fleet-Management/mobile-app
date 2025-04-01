const TripService = require('../services/tripService');
const { Op } = require('sequelize');

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
    const trips = await TripService.getDailyTrips(date); // Envia a string, não um Date!

    res.status(200).json({
      status: 'success',
      results: trips.length,
      data: trips,
    });
  } catch (error) {
    console.error('Erro detalhado:', error); // Adicione logs para debug
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar viagens diárias',
    });
  }
};

exports.updateTrip = async (req, res) => {
  try {
    const updatedTrip = await TripService.updateTrip(
      req.params.tripId,
      req.body
    );
    res.status(200).json({
      status: 'success',
      data: updatedTrip,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
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
