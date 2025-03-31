// tripScheduler.js
const { createDailyTrips } = require('../services/tripService');

function startTripScheduler() {
  // Agenda a criação de viagens todos os dias às 00:00 (meia-noite)
  const intervalMs = 10000; // 24 horas em milissegundos
  // const intervalMs = 24 * 60 * 60 * 1000; // 24 horas em milissegundos

  // Executa imediatamente no startup e depois no intervalo
  const scheduleCreation = async () => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1); // Cria para o próximo dia
      await createDailyTrips(tomorrow);
    } catch (error) {
      console.error('Erro na criação automática de viagens:', error.message);
    }
  };

  // Primeira execução
  scheduleCreation();

  // Agendamento periódico
  setInterval(scheduleCreation, intervalMs);
}

module.exports = startTripScheduler;
