const Joi = require('joi');

// Schema de validação para o perfil do usuário
exports.profileSchema = Joi.object({
  // Validação do CPF
  cpf: Joi.string()
    .length(11) // Deve ter exatamente 11 caracteres
    .pattern(/^\d+$/) // Deve conter apenas números
    .required() // Campo obrigatório
    .messages({
      'string.pattern.base': 'CPF deve conter apenas números',
      'string.length': 'CPF deve ter 11 dígitos',
      'any.required': 'CPF é obrigatório',
    }),

  // Validação da data de nascimento
  birthdate: Joi.date()
    .max(new Date()) // Data não pode ser no futuro
    .required() // Campo obrigatório
    .messages({
      'date.max': 'Data de nascimento inválida',
      'any.required': 'Data de nascimento é obrigatória',
    }),

  // Validação do telefone
  phone: Joi.string()
    .min(10) // Mínimo de 10 caracteres
    .max(20) // Máximo de 20 caracteres
    .required() // Campo obrigatório
    .messages({
      'string.min': 'Telefone deve ter no mínimo 10 caracteres',
      'string.max': 'Telefone deve ter no máximo 20 caracteres',
      'any.required': 'Telefone é obrigatório',
    }),

  // Validação do endereço
  address: Joi.object({
    address_type: Joi.string()
      .required() // Campo obrigatório
      .messages({
        'any.required': 'Tipo de endereço é obrigatório',
      }),

    cep: Joi.string()
      .length(8) // Deve ter exatamente 8 caracteres
      .pattern(/^\d+$/) // Deve conter apenas números
      .required() // Campo obrigatório
      .messages({
        'string.pattern.base': 'CEP deve conter apenas números',
        'string.length': 'CEP deve ter 8 dígitos',
        'any.required': 'CEP é obrigatório',
      }),

    street: Joi.string()
      .required() // Campo obrigatório
      .messages({
        'any.required': 'Rua é obrigatória',
      }),

    number: Joi.number()
      .required() // Campo obrigatório
      .messages({
        'any.required': 'Número é obrigatório',
      }),

    complement: Joi.string()
      .allow('') // Permite string vazia
      .optional(), // Campo opcional

    neighbourhood: Joi.string()
      .required() // Campo obrigatório
      .messages({
        'any.required': 'Bairro é obrigatório',
      }),

    city: Joi.string()
      .required() // Campo obrigatório
      .messages({
        'any.required': 'Cidade é obrigatória',
      }),

    state: Joi.string()
      .length(2) // Deve ter exatamente 2 caracteres
      .required() // Campo obrigatório
      .messages({
        'string.length': 'O estado deve ter 2 caracteres (ex: SP)',
        'any.required': 'Estado é obrigatório',
      }),
  })
    .required() // Endereço é obrigatório
    .messages({
      'any.required': 'Endereço é obrigatório',
    }),
});
