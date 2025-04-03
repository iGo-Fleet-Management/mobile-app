// tripScheduler.js
const { DateTime } = require('luxon');
const cron = require('node-cron');
const { createDailyTrips } = require('../services/tripService');

function startTripScheduler() {
  const scheduleCreation = async () => {
    try {
      // Calcula "amanhã" no fuso correto
      const today = DateTime.now()
        .setZone('America/Sao_Paulo')
        .plus({ days: 0 })
        .toJSDate();

      await createDailyTrips(today);
    } catch (error) {
      console.error('Erro na criação automática de viagens:', error.message);
      // Implementando retry após 1 hora em caso de falha
      setTimeout(scheduleCreation, 60 * 60 * 1000);
      console.log('Agendando nova tentativa em 1 hora');
      console.error(error.stack);
    }
  };

  // Agenda execução diária às 00:00 (meia-noite no timezone do servidor)
  cron.schedule('0 0 * * *', scheduleCreation, {
    timezone: 'America/Sao_Paulo',
  });

  // Executa imediatamente no startup (opcional)
  scheduleCreation();
}

module.exports = startTripScheduler;
