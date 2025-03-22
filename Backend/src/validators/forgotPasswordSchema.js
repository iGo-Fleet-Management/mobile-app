const Joi = require('joi');

// Schema para validar requisição de recuperação de senha
exports.forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Formato de email inválido',
    'any.required': 'Email é obrigatório',
  }),
});

// Schema para validar redefinição de senha com token
exports.resetPasswordWithTokenSchema = Joi.object({
  token: Joi.string().required().messages({
    'any.required': 'Token é obrigatório',
  }),

  code: Joi.string()
    .length(6)
    .pattern(/^\d+$/) // Apenas dígitos numéricos
    .required()
    .messages({
      'string.length': 'Código deve ter exatamente 6 dígitos',
      'string.pattern.base': 'Códivo deve conter apenas números',
      'any.required': 'Código é obrigatório',
    }),

  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .required()
    .messages({
      'string.min': 'Senha deve ter no mínimo 8 caracteres',
      'string.pattern.base':
        'Senha deve conter letras, números e pelo menos um caractere especial',
      'any.required': 'Nova senha é obrigatória',
    }),
});
