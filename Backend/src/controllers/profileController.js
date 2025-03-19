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
