const authService = require('../services/authService');

// Controlador para registro de usuários
exports.register = async (req, res) => {
  try {
    // Extrai dados do corpo da requisição
    const { user_type, name, last_name, email, password, reset_password } =
      req.body;

    // Chama o serviço de registro
    const user = await authService.register(
      user_type,
      name,
      last_name,
      email,
      password,
      reset_password
    );

    // Retorna sucesso 201 (Created) com dados do usuário
    res.status(201).json({ user });
  } catch (error) {
    // Tratamento específico para erros conhecidos
    if (error.message === 'O e-mail já está em uso') {
      res.status(409).json({ error: error.message }); // 409 Conflict
    }
    if (error.message === 'Resete sua senha') {
      res.status(403).json({ error: error.message }); // 403 Forbidden
    } else {
      res.status(500).json({ error: error.message }); // Erro genérico para casos inesperados
    }
  }
};

// Controlador para autenticação de usuários
exports.login = async (req, res) => {
  try {
    // Extrai dados do corpo da requisição
    const { email, password } = req.body;

    // Autentica via serviço
    const result = await authService.login(email, password);

    // Retorna token JWT e status de senha
    res.json({
      token: result.token,
      reset_password: result.reset_password,
    });
  } catch (error) {
    // Erro genérico de autenticação
    res.status(401).json({ error: error.message }); // 401 Unauthorized
  }
};

// Controlador para alteração de senha
exports.resetPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { email } = req.user; // Pegamos o email do Usuário autenticado via middleware

    // Validação de campos obrigatórios
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        code: 'MISSING_FIELDS',
        error: 'Campos obrigatórios faltando',
      }); // 400 Bad Request
    }

    // Chama serviço de alteração de senha
    const reset = await authService.resetPassword(
      email,
      currentPassword,
      newPassword
    );

    // Retorno do resultado
    return res.status(200).json(reset);
  } catch (error) {
    // Tipos específicos de erros
    if (error.messages === 'Credenciais inválidas') {
      return res.status(401).json({ error: 'Credenciais inválidas' }); // 401 Unauthorized
    } else if (
      error.message ===
      'Senha deve ter Senha deve ter 8+ caracteres com números e símbolos'
    ) {
      return res.status(400).json({ error: error.message }); // 400 Bad Request
    } else {
      return res.status(500).json({ error: 'Erro ao processar solicitação' }); // Mensagem genérica para outros erros
    }
  }
};
