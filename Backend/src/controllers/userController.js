const userService = require('../services/userService');

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
    console.error('[Erro ao deletar usuário]', error);
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

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('[Erro ao obter usuários]', error);
    res.status(500).json({
      success: false,
      code: 'USER_RETRIEVAL_ERROR',
      message: 'Erro ao obter usuários',
    });
  }
};
