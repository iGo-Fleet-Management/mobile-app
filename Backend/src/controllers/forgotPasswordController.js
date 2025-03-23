const forgotPasswordService = require('../services/forgotPasswordService');
const emailService = require('../services/emailService');

// Controlador para solicitar redefinição de senha
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Busca o usuário pelo email
    const user = await forgotPasswordService.findUserByEmail(email);

    // Gera token JWT para recuperação de senha
    const { resetCode, token } =
      await forgotPasswordService.generatePasswordResetToken(email);

    // Se o usuário existir, gera token e envia email
    if (user) {
      // Envia email com o link de recuperação
      await emailService.sendPasswordResetEmail(email, resetCode);
    }

    // Retorna sempre sucesso (mesmo se email não existir, por segurança)
    // Isso evita enumeração de emails existentes
    res.status(200).json({
      success: true,
      message:
        'Se o email estiver cadastrado, você receberá as instruções para redefinição de senha.',
      token,
    });
  } catch (error) {
    if (error.message === 'Usuário não encontrado') {
      // Mantém a resposta genérica por segurança
      return res.status(200).json({
        success: true,
        message:
          'Se o e-mail estiver cadastrado, você receberá um código de verificação.',
      });
    }
    console.error('Erro ao solicitar recuperação de senha:', error);
    res.status(500).json({
      code: 'SERVER_ERROR',
      message: 'Erro ao processar a solicitação.',
    });
  }
};

// Controlador para redefinir senha com token
exports.resetPasswordWithToken = async (req, res) => {
  try {
    const { token, code, newPassword } = req.body;

    // Redefine a senha usando o token
    const result = await forgotPasswordService.resetPasswordWithToken(
      token,
      code,
      newPassword
    );

    res.status(200).json({
      success: true,
      code: 'PASSWORD_RESET_SUCCESS',
      message: 'Senha redefinida com sucesso.',
    });
  } catch (error) {
    // Tratamento específico para tipos de erro
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        code: 'TOKEN_EXPIRED',
        message: 'O link de recuperação expirou. Solicite um novo link.',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        code: 'INVALID_TOKEN',
        message: 'Link de recuperação inválido.',
      });
    }

    if (
      error.message === 'Senha deve ter 8+ caracteres com números e símbolos'
    ) {
      return res.status(400).json({
        code: 'WEAK_PASSWORD',
        message: error.message,
      });
    }

    // Erro genérico
    res.status(500).json({
      code: 'SERVER_ERROR',
      message: 'Erro ao redefinir a senha.',
    });
  }
};

// Controlador para alteração de senha
exports.resetPasswordFirstLogin = async (req, res) => {
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

    console.log('Alterando senha para:', email);
    console.log('SenhaAtual:', currentPassword);
    console.log('NovaSenha:', newPassword);

    // Chama serviço de alteração de senha
    const reset = await forgotPasswordService.resetPasswordFirstLogin(
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
