const userService = require('../services/userService');

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

// exports.completeRegistration = async (req, res) => {
//   try {
//     const { userData, addressUpdates } = req.body;
//     const result = await userService.saveProfile(
//       req.user.user_id,
//       userData,
//       addressUpdates,
//       { isInitialCompletion: true }
//     );

//     res.status(200).json({
//       success: true,
//       data: result,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       code: 'PROFILE_COMPLETION_ERROR',
//       message: this.translateProfileError(error.message),
//     });
//   }
// };

exports.updateProfile = async (req, res) => {
  try {
    const { userData } = req.body;
    const result = await userService.saveProfile(req.user.user_id, userData);

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

exports.updateAddresses = async (req, res) => {
  try {
    const { addressUpdates } = req.body;
    const result = await userService.saveAddress(
      req.user.user_id,
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
      code: 'ADDRESS_UPDATE_ERROR',
      message: this.translateProfileError(error.message),
    });
  }
};

// Controller que mantém a funcionalidade combinada para compatibilidade
exports.createProfile = async (req, res) => {
  try {
    const { userData, addressData } = req.body;
    const result = await userService.createProfile(
      req.user.user_id,
      userData,
      addressData
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

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    // Validação básica do ID
    if (!userId) {
      return res.status(400).json({
        success: false,
        code: 'INVALID_USER_ID',
        message: 'ID de usuário inválido',
      });
    }
    await userService.deleteUser(userId);

    res.status(200).json({
      success: true,
      message: 'Usuário excluído com sucesso',
    });
  } catch (error) {
    // Tratamento específico para usuário não encontrado
    if (
      error.message === 'Usuário não encontrado' ||
      error.message === 'Registro não encontrado'
    ) {
      return res.status(404).json({
        success: false,
        code: 'USER_NOT_FOUND',
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      code: 'USER_DELETION_ERROR',
      message: 'Erro ao deletar usuário',
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
