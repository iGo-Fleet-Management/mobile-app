const Joi = require('joi');
const { uuidRegex } = require('./patterns');

// Schema para parâmetros de URL
const stopParamsSchema = Joi.object({
  stopId: Joi.string().pattern(uuidRegex).required(),
}).options({ stripUnknown: true });

// Schema para criação de parada
const createStopSchema = Joi.object().keys({
  body: Joi.object({
    address_id: Joi.string().pattern(uuidRegex).required(),
    trip_id: Joi.string().pattern(uuidRegex).required(),
    stop_date: Joi.date().iso().required(),
  }).required(),
});

// Schema para atualização de parada
const updateStopSchema = Joi.object().keys({
  body: Joi.object({
    address_id: Joi.string().pattern(uuidRegex),
    stop_date: Joi.date().iso(),
  }).min(1), // Pelo menos um campo para atualizar
});

// Schema para verificação de disponibilidade
const checkAvailabilitySchema = Joi.object().keys({
  body: Joi.object({
    stop_date: Joi.date().iso().required(),
  }).required(),
});

module.exports = {
  stopParamsSchema,
  createStopSchema,
  updateStopSchema,
  checkAvailabilitySchema,
};
