const Joi = require('joi');

exports.profileSchema = Joi.object({
  cpf: Joi.string().length(11).pattern(/^\d+$/).required().messages({
    'string.pattern.base': 'CPF deve conter apenas números',
    'string.length': 'CPF deve ter 11 dígitos',
  }),
  birthdate: Joi.date().max(new Date()).required().messages({
    'date.max': 'Data de nascimento inválida',
  }),
  phone: Joi.string().min(10).max(20).required(),
  address: Joi.object({
    address_type: Joi.string().required(),
    cep: Joi.string().length(8).pattern(/^\d+$/).required(),
    street: Joi.string().required(),
    number: Joi.number().required(),
    complement: Joi.string().allow(''),
    neighbourhood: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().length(2).required().messages({
      'string.length': 'O estado deve ter 2 caracteres (ex: SP)',
    }),
  }).required(),
});
