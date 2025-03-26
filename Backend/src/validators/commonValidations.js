const Joi = require('joi');
const brazilianStates = require('../config/brazilianStates');

/**
 * Módulo de validações reutilizáveis
 */
const commonValidations = {
  /**
   * Cria um validador genérico para campos numéricos
   * @param {number} length - Comprimento esperado
   * @param {string} fieldName - Nome do campo para mensagens de erro
   * @returns {Joi.StringSchema} - Schema de validação
   */
  createNumericValidator: (length, fieldName) =>
    Joi.string()
      .length(length)
      .pattern(/^\d+$/)
      .messages({
        'string.pattern.base': `${fieldName} deve conter apenas números`,
        'string.length': `${fieldName} deve ter ${length} dígitos`,
      }),

  /**
   * Validador de estado brasileiro
   * @returns {Joi.StringSchema} - Schema de validação de estado
   */
  brazilianStateValidator: () =>
    Joi.string()
      .length(2)
      .custom((value, helpers) => {
        if (!brazilianStates.isValid(value)) {
          return helpers.error('any.invalid');
        }
        return value;
      })
      .messages({
        'string.length': 'Estado deve ter 2 caracteres',
        'any.invalid': 'Estado inválido',
      }),

  /**
   * Validador de email com regras específicas
   * @returns {Joi.StringSchema} - Schema de validação de email
   */
  emailValidator: () =>
    Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'br', 'net'] } })
      .messages({
        'string.email': 'Email inválido',
        'string.domain': 'Domínio de email não suportado',
      }),

  /**
   * Validador de telefone brasileiro
   * @returns {Joi.StringSchema} - Schema de validação de telefone
   */
  phoneValidator: () =>
    Joi.string()
      .pattern(/^[0-9]{10,11}$/)
      .messages({
        'string.pattern.base': 'Telefone inválido. Use DDD + número.',
      }),
};

module.exports = commonValidations;
