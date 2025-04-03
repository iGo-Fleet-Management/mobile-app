const Joi = require('joi');
const { uuidRegex } = require('./patterns');

// Schema para parâmetros de URL
const stopParamsSchema = Joi.object({
  stopId: Joi.string().pattern(uuidRegex).required(),
}).options({ stripUnknown: true });

// Schema para criação de parada
const createStopSchema = Joi.object({
  address_id: Joi.string().pattern(uuidRegex).required(),
  trip_id: Joi.string().pattern(uuidRegex).required(),
  stop_date: Joi.date().iso().required(),
});

const updateStopSchema = Joi.object({
  address_id: Joi.string().pattern(uuidRegex),
  stop_date: Joi.date().iso(),
}).min(1);

// Schema para verificação de disponibilidade
const checkAvailabilitySchema = Joi.object({
  stop_date: Joi.date().iso().required(),
});

module.exports = {
  stopParamsSchema,
  createStopSchema,
  updateStopSchema,
  checkAvailabilitySchema,
};
