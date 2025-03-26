const userService = require('../services/userService');

// Controlador para completar o cadastro do usuário
exports.completeRegistration = async (req, res) => {
  try {
    // Obtém o ID do usuário autenticado a partir do token JWT
    const { user_id } = req.user;

    // Extrai dados do corpo da requisição
    const { cpf, birthdate, phone, address } = req.body;

    // Chama o serviço para completar o perfil
    const result = await userService.completeProfile(
      user_id, // ID do usuário
      { cpf, birthdate, phone }, // Dados pessoais
      address // Endereço
    );

    // Retorna sucesso 200 com o resultado
    res.status(200).json(result);
  } catch (error) {
    // Retorna erro 400 (Bad Request) com detalhes
    res.status(400).json({
      code: error.code || 'SERVER_ERROR',
      message: error.message,
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await userService.getProfileById(req.user.user_id);
    res.status(200).json({ 'perfil encontrado': user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { userData, addressUpdates } = req.body;

    const result = await userService.updateProfile(
      req.user.user_id,
      userData || {},
      addressUpdates || []
    );

    res.status(200).json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      user: result.user,
    });
  } catch (error) {
    const statusCode = error.message.includes('não encontrado') ? 404 : 500;
    res.status(statusCode).json({ success: false, message: error.message });
  }
};
