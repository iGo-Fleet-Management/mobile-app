const { cleanupExpiredTokens } = require('../services/authService');

function startBlacklistCleanup() {
  setInterval(async () => {
    try {
      await cleanupExpiredTokens();
    } catch (error) {
      console.error('Erro ao limpar blacklist:', error);
    }
    //console.log('Limpeza de blacklist concluída');
  }, 100000);
}

module.exports = startBlacklistCleanup;
