// validators/forgotPasswordValidation.js
const Joi = require('joi');
const commonValidations = require('./commonValidations');

/**
 * Módulo de validação para recuperação e redefinição de senha
 * Centraliza as regras de validação para processos de esqueci minha senha
 */
const forgotPasswordValidation = {
  /**
   * Schema para solicitação de recuperação de senha
   * Valida o email para recuperação
   * @returns {Joi.ObjectSchema} - Schema de recuperação de senha
   */
  forgotPasswordSchema: () =>
    Joi.object({
      email: commonValidations.emailValidator().required().messages({
        'any.required': 'Email para recuperação é obrigatório',
      }),
    }),

  /**
   * Schema para redefinição de senha com token
   * Inclui validações complexas para segurança
   * @returns {Joi.ObjectSchema} - Schema de redefinição de senha
   */
  resetPasswordSchema: () =>
    Joi.object({
      // Validação do token de recuperação
      token: Joi.string()
        .pattern(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/) // Garante que seja um UUID válido
        .required()
        .messages({
          'string.guid': 'Token de recuperação inválido',
          'any.required': 'Token de recuperação é obrigatório',
        }),

      // Validação do código de verificação
      code: Joi.string().length(6).pattern(/^\d+$/).required().messages({
        'string.length': 'Código de verificação deve ter exatamente 6 dígitos',
        'string.pattern.base': 'Código deve conter apenas números',
        'any.required': 'Código de verificação é obrigatório',
      }),

      // Validação da nova senha com regras de segurança
      newPassword: Joi.string()
        .min(8)
        .max(30) // Limita tamanho máximo
        .pattern(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
        )
        .required()
        .messages({
          'string.min': 'Senha deve ter no mínimo 8 caracteres',
          'string.max': 'Senha deve ter no máximo 30 caracteres',
          'string.pattern.base':
            'Senha deve conter letras, números e pelo menos um caractere especial',
          'any.required': 'Nova senha é obrigatória',
        }),

      // Campo opcional para confirmação de senha
      confirmPassword: Joi.string()
        .valid(Joi.ref('newPassword')) // Deve ser igual à nova senha
        .required()
        .messages({
          'any.only': 'Confirmação de senha não corresponde',
          'any.required': 'Confirmação de senha é obrigatória',
        }),
    }).with('newPassword', 'confirmPassword'), // Garante que ambos sejam fornecidos juntos
};

module.exports = forgotPasswordValidation;
