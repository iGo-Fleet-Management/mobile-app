// validators/addressValidation.js
const Joi = require('joi');
const commonValidations = require('./commonValidations');

/**
 * Schema de validação para endereços
 * Separa a lógica de validação de endereços
 */
const addressValidation = {
  /**
   * Schema para criação de endereço
   * @returns {Joi.ObjectSchema} - Schema completo de endereço
   */
  createSchema: () =>
    Joi.object({
      address_type: Joi.string().required().messages({
        'any.required': 'Tipo de endereço é obrigatório',
      }),

      cep: commonValidations
        .createNumericValidator(8, 'CEP')
        .required()
        .messages({
          'any.required': 'CEP é obrigatório',
        }),

      street: Joi.string().min(3).required().messages({
        'any.required': 'Rua é obrigatória',
        'string.min': 'Rua deve ter no mínimo 3 caracteres',
      }),

      number: Joi.number().required().messages({
        'any.required': 'Número é obrigatório',
      }),

      complement: Joi.string().allow('').optional(),

      neighbourhood: Joi.string().min(2).required().messages({
        'any.required': 'Bairro é obrigatório',
        'string.min': 'Bairro deve ter no mínimo 2 caracteres',
      }),

      city: Joi.string().min(2).required().messages({
        'any.required': 'Cidade é obrigatória',
        'string.min': 'Cidade deve ter no mínimo 2 caracteres',
      }),

      state: commonValidations.brazilianStateValidator().required().messages({
        'any.required': 'Estado é obrigatório',
      }),
    }),

  /**
   * Schema para atualização de endereço
   * @returns {Joi.ObjectSchema} - Schema de atualização
   */
  updateSchema: () =>
    Joi.object({
      address_id: Joi.string().uuid().required(),

      // Mesmos campos do createSchema, mas todos opcionais
      address_type: Joi.string().optional(),
      cep: commonValidations.createNumericValidator(8, 'CEP').optional(),
      street: Joi.string().optional(),
      number: Joi.number().optional(),
      complement: Joi.string().allow('').optional(),
      neighbourhood: Joi.string().optional(),
      city: Joi.string().optional(),
      state: commonValidations.brazilianStateValidator().optional(),
    }).min(1), // Requer pelo menos um campo
};

module.exports = addressValidation;
