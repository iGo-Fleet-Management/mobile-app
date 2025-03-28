const userService = require('../services/userService');

// Controlador para completar o cadastro do usuário
exports.completeRegistration = async (req, res) => {
  try {
    const { addressUpdates, userData } = req.body; // Extrai `address` separadamente

    const result = await userService.completeProfile(
      req.user.user_id,
      userData,
      addressUpdates // Passa `address` como `addressData`
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      code: 'PROFILE_COMPLETION_ERROR',
      message: this.translateProfileError(error.message),
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const profile = await userService.getProfileById(req.user.user_id);
    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      code: 'PROFILE_NOT_FOUND',
      message: 'Perfil não encontrado',
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { userData, addressUpdates } = req.body;
    const result = await userService.updateProfile(
      req.user.user_id,
      userData,
      addressUpdates
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    const status = error.message.includes('não encontrado') ? 404 : 500;
    res.status(status).json({
      success: false,
      code: 'PROFILE_UPDATE_ERROR',
      message: this.translateProfileError(error.message),
    });
  }
};

exports.translateProfileError = (errorMessage) => {
  const translations = {
    'User not found': 'Usuário não encontrado',
    'Invalid address data': 'Dados de endereço inválidos',
    'Profile incomplete': 'Perfil incompleto',
  };
  return translations[errorMessage] || errorMessage;
};
