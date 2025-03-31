const TripService = require('../services/tripService');
const { Op } = require('sequelize');

exports.createDailyTrips = async (req, res) => {
  try {
    const { date } = req.body;
    const trips = await TripService.createDailyTrips(
      date ? new Date(date) : new Date()
    );
    res.status(201).json({
      status: 'success',
      data: trips,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

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
    const trips = await TripService.getDailyTrips(
      date ? new Date(date) : new Date()
    );

    res.status(200).json({
      status: 'success',
      results: trips.length,
      data: trips,
    });
  } catch (error) {
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
