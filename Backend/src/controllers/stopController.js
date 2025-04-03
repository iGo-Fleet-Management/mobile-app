const StopService = require('../services/stopService');

exports.createStop = async (req, res) => {
  try {
    const stopData = {
      ...req.body,
      user_id: req.user.user_id, // Supondo autenticação implementada
    };

    const newStop = await StopService.createStop(stopData);
    res.status(201).json({
      status: 'success',
      data: newStop,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.updateStop = async (req, res) => {
  try {
    const updatedStop = await StopService.updateStop(
      req.params.stopId,
      req.body
    );
    res.status(200).json({
      status: 'success',
      data: updatedStop,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.getUserStops = async (req, res) => {
  try {
    const stops = await StopService.getUserStops(req.params.userId);
    res.status(200).json({
      status: 'success',
      results: stops.length,
      data: stops,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar paradas do usuário',
    });
  }
};

exports.getTripStops = async (req, res) => {
  try {
    const stops = await StopService.getTripStops(req.params.tripId);
    res.status(200).json({
      status: 'success',
      results: stops.length,
      data: stops,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar paradas da viagem',
    });
  }
};

exports.checkAvailability = async (req, res) => {
  try {
    const isAvailable = await StopService.checkStopAvailability(
      req.params.tripId,
      new Date(req.body.stopDate)
    );

    res.status(200).json({
      status: 'success',
      available: isAvailable,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.cancelStop = async (req, res) => {
  try {
    await StopService.cancelStop(req.params.stopId);
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
