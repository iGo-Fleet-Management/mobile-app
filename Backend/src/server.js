const app = require('./app');
const startBlacklistCleanup = require('./config/blacklistCleanup');
const startTripScheduler = require('./config/tripScheduler'); // <-- Novo
const PORT = process.env.PORT || 5000; // Usa porta do ambiente ou 5000
process.env.TZ = 'America/Sao_Paulo';

startBlacklistCleanup();
startTripScheduler();

console.log('Server timezone:', process.env.TZ);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
