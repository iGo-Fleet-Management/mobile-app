// Chamada manual para teste
const TripService = require('../services/tripService');

// Cria viagens para amanhã
TripService.createDailyTrips(new Date())
  .then((trips) => console.log('Viagens criadas:', trips))
  .catch((error) => console.error('Erro:', error.message));
