const User = require('../models/User');

exports.checkProfileComplete = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.user_id);

    if (!user.cpf || !user.birthdate || !user.phone) {
      return res.status(428).json({
        code: 'PROFILE_INCOMPLETE',
        message: 'Complete seu cadastro para continuar',
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Error ao verificar perfil' });
  }
};
