const app = require('./app');
const startBlacklistCleanup = require('./config/blacklistCleanup');
const startTripScheduler = require('./config/tripScheduler');
const PORT = process.env.PORT || 5000;

// Removendo configuração de timezone global, para evitar inconsistências
// process.env.TZ = 'America/Sao_Paulo';

startBlacklistCleanup();
startTripScheduler();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `Usando timezone: America/Sao_Paulo via Luxon em todas as operações de data`
  );
});
