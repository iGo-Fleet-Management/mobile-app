const { cleanupExpiredTokens } = require('../services/authService');

async function clean() {
  try {
    await cleanupExpiredTokens();
  } catch (error) {
    console.error('Erro ao limpar blacklist:', error);
  }
  //console.log('Limpeza de blacklist concluída');
}

function startBlacklistCleanup() {
  // Executa imediatamente na inicialização
  clean().then(() => {
    // Depois da primeira execução, inicia o intervalo
    setInterval(clean, 100000);
  });
}

module.exports = startBlacklistCleanup;
