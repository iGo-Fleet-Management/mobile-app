// validators/userValidation.js
const Joi = require('joi');
const commonValidations = require('./commonValidations');
const addressValidation = require('./addressValidation');

/**
 * Schema de validação para usuários
 * Centraliza todas as regras de validação de perfil de usuário
 */
const userValidation = {
  /**
   * Schema para criação de perfil completo
   * @returns {Joi.ObjectSchema} - Schema de perfil completo
   */
  completeProfileSchema: () =>
    Joi.object({
      cpf: commonValidations
        .createNumericValidator(11, 'CPF')
        .required()
        .messages({
          'any.required': 'CPF é obrigatório',
        }),

      birthdate: Joi.date().max('now').iso().required().messages({
        'date.max': 'Data de nascimento não pode ser futura',
        'any.required': 'Data de nascimento é obrigatória',
      }),

      phone: commonValidations.phoneValidator().required().messages({
        'any.required': 'Telefone é obrigatório',
      }),

      email: commonValidations.emailValidator().required().messages({
        'any.required': 'Email é obrigatório',
      }),

      name: Joi.string().min(2).required().messages({
        'any.required': 'Nome é obrigatório',
        'string.min': 'Nome deve ter no mínimo 2 caracteres',
      }),

      address: addressValidation.createSchema().required(),
    }),

  /**
   * Schema para atualização parcial de perfil
   * @returns {Joi.ObjectSchema} - Schema de atualização
   */
  updateProfileSchema: () =>
    Joi.object({
      userData: Joi.object({
        name: Joi.string().min(2).optional(),
        last_name: Joi.string().min(2).optional(),
        cpf: commonValidations.createNumericValidator(11, 'CPF').optional(),
        birthdate: Joi.date().max('now').iso().optional(),
        phone: commonValidations.phoneValidator().optional(),
        email: commonValidations.emailValidator().optional(),
      }).min(1),

      addressUpdates: Joi.array()
        .items(
          Joi.alternatives().try(
            addressValidation.createSchema(),
            addressValidation.updateSchema()
          )
        )
        .optional(),
    }).or('userData', 'addressUpdates'),
};

module.exports = userValidation;
