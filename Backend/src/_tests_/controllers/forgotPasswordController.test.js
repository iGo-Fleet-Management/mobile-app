const request = require('supertest');
const app = require('../../app'); // Importa a aplicação para testes
const forgotPasswordService = require('../../services/forgotPasswordService');
const forgotPasswordController = require('../../controllers/forgotPasswordController');

// Mockando a função resetPasswordFirstLogin
jest.mock('../../services/forgotPasswordService');

//test resetPasswordFirstLogin

describe('Forgot Password Controller - resetPasswordFirstLogin', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        currentPassword: 'oldPassword123',
        newPassword: 'New@Password123',
      },
      user: {
        email: 'user@example.com',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('Deve retornar sucesso ao redefinir a senha', async () => {
    // Simula o serviço retornando sucesso
    forgotPasswordService.resetPasswordFirstLogin.mockResolvedValue({
      token: 'fake-jwt-token',
    });

    await forgotPasswordController.resetPasswordFirstLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        token: 'fake-jwt-token',
        message: 'Senha atualizada com sucesso',
      },
    });
  });

  it('Deve retornar erro se campos obrigatórios não forem informados', async () => {
    req.body = {}; // Remove os campos obrigatórios

    await forgotPasswordController.resetPasswordFirstLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      code: 'MISSING_REQUIRED_FIELDS',
      message: 'Todos os campos obrigatórios devem ser informados',
    });
  });

  it('Deve retornar erro para credenciais inválidas', async () => {
    forgotPasswordService.resetPasswordFirstLogin.mockRejectedValue({
      code: 'INVALID_CREDENTIALS',
    });

    await forgotPasswordController.resetPasswordFirstLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      code: 'INVALID_CREDENTIALS',
      message: 'Credenciais inválidas',
    });
  });

  it('Deve retornar erro para senha fraca', async () => {
    forgotPasswordService.resetPasswordFirstLogin.mockRejectedValue({
      code: 'WEAK_PASSWORD',
    });

    await forgotPasswordController.resetPasswordFirstLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      code: 'WEAK_PASSWORD',
      message:
        'A senha deve conter pelo menos 8 caracteres com números e símbolos',
    });
  });

  it('Deve retornar erro se a nova senha for igual à antiga', async () => {
    forgotPasswordService.resetPasswordFirstLogin.mockRejectedValue({
      code: 'NEW_PASSWORD_SAME_AS_CURRENT',
    });

    await forgotPasswordController.resetPasswordFirstLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      code: 'NEW_PASSWORD_SAME_AS_CURRENT',
      message: 'A nova senha não pode ser igual à senha atual',
    });
  });

  it('Deve retornar erro genérico para exceções desconhecidas', async () => {
    forgotPasswordService.resetPasswordFirstLogin.mockRejectedValue({
      code: 'UNKNOWN_ERROR',
    });

    await forgotPasswordController.resetPasswordFirstLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      code: 'PASSWORD_RESET_ERROR',
      message: 'Erro ao processar a solicitação de alteração de senha',
    });
  });

  //test requestPassword

  describe('requestPasswordReset', () => {
    it('Deve retornar sucesso ao solicitar recuperação de senha', async () => {
      forgotPasswordService.requestPasswordReset.mockResolvedValue({
        token: 'fake-reset-token',
      });

      await forgotPasswordController.requestPasswordReset(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        token: 'fake-reset-token',
        message:
          'Se o e-mail estiver cadastrado, você receberá um código de verificação. - teste',
      });
    });

    it('Deve retornar erro genérico ao falhar na solicitação', async () => {
      forgotPasswordService.requestPasswordReset.mockRejectedValue(
        new Error('Erro inesperado')
      );

      await forgotPasswordController.requestPasswordReset(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        code: 'PASSWORD_RESET_ERROR',
        message: 'Erro ao processar solicitação de recuperação de senha',
      });
    });
  });

  //test resetPasswordWithToken

  describe('resetPasswordWithToken', () => {
    beforeEach(() => {
      req.body = {
        token: 'valid-token',
        code: '123456',
        newPassword: 'New@Password123',
      };
    });

    it('Deve retornar sucesso ao redefinir a senha com token válido', async () => {
      forgotPasswordService.resetPasswordWithToken.mockResolvedValue();

      await forgotPasswordController.resetPasswordWithToken(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Senha redefinida com sucesso',
      });
    });

    it('Deve retornar erro quando o token estiver expirado', async () => {
      forgotPasswordService.resetPasswordWithToken.mockRejectedValue({
        name: 'TokenExpiredError',
      });

      await forgotPasswordController.resetPasswordWithToken(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        code: 'TOKEN_EXPIRED',
        message: 'Link de recuperação expirado',
      });
    });

    it('Deve retornar erro quando o token for inválido', async () => {
      forgotPasswordService.resetPasswordWithToken.mockRejectedValue({
        name: 'JsonWebTokenError',
      });

      await forgotPasswordController.resetPasswordWithToken(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        code: 'INVALID_TOKEN',
        message: 'Token inválido',
      });
    });

    it('Deve retornar erro quando a senha for fraca', async () => {
      forgotPasswordService.resetPasswordWithToken.mockRejectedValue({
        name: 'WEAK_PASSWORD',
        message:
          'A senha deve conter pelo menos 8 caracteres com números e símbolos',
      });

      await forgotPasswordController.resetPasswordWithToken(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        code: 'WEAK_PASSWORD',
        message:
          'A senha deve conter pelo menos 8 caracteres com números e símbolos',
      });
    });

    it('Deve retornar erro genérico para exceções desconhecidas', async () => {
      forgotPasswordService.resetPasswordWithToken.mockRejectedValue(
        new Error('Erro inesperado')
      );

      await forgotPasswordController.resetPasswordWithToken(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        code: 'SERVER_ERROR',
        message: 'Erro ao redefinir senha',
      });
    });
  });
});
