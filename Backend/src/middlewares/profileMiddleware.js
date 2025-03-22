const User = require('../models/User');

// Middleware para verificar se o perfil do usuário está completo
exports.checkProfileComplete = async (req, res) => {
  try {
    // Busca o usuário no banco de dados
    const user = await User.findByPk(req.user.user_id);

    // Verifica se os campos obrigatórios estão preenchidos
    if (!user.cpf || !user.birthdate || !user.phone) {
      return res.status(428).json({
        code: 'PROFILE_INCOMPLETE',
        message: 'Complete seu cadastro para continuar',
      }); // HTTP 428 - Precondition Required
    } else {
      return res.status(200).json({
        code: 'SUCCESS',
        message: 'Cadastro completo',
      });
    }
  } catch (error) {
    // Retorna erro genérico
    res.status(500).json({ error: 'Error ao verificar perfil' });
  }
};
