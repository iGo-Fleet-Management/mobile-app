const authService = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const { user_type, name, last_name, email, password, reset_password } =
      req.body;
    const user = await authService.register(
      user_type,
      name,
      last_name,
      email,
      password,
      reset_password
    );
    res.status(201).json({ user });
  } catch (error) {
    if (error.message === 'O e-mail já está em uso') {
      res.status(409).json({ error: error.message });
    }
    if (error.message === 'Resete sua senha') {
      res.status(403).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({
      token: result.token,
      reset_password: result.reset_password,
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { email } = req.user; // Pegamos o email do usuário autenticado

    // Validação básica dos campos
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        code: 'MISSING_FIELDS',
        error: 'Campos obrigatórios faltando',
      });
    }

    // Chamada ao serviço
    const reset = await authService.resetPassword(
      email,
      currentPassword,
      newPassword
    );
    // Retorno do resultado
    return res.status(200).json(reset);
  } catch (error) {
    if (error.messages === 'Credenciais inválidas') {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    } else if (
      error.message ===
      'Senha deve ter Senha deve ter 8+ caracteres com números e símbolos'
    ) {
      return res.status(400).json({ error: error.message });
    } else {
      // Mensagem genérica para outros erros
      return res.status(500).json({ error: 'Erro ao processar solicitação' });
    }
  }
};
