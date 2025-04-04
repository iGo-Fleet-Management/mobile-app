const Joi = require('joi');
const { uuidRegex } = require('./patterns');

// Schema para parâmetros de URL
const stopParamsSchema = Joi.object({
  stopId: Joi.string().pattern(uuidRegex).required(),
}).options({ stripUnknown: true });

// Schema para criação de parada única (mantido para outros endpoints)
const createStopSchema = Joi.object({
  address_id: Joi.string().pattern(uuidRegex).required(),
  trip_id: Joi.string().pattern(uuidRegex).required(),
  stop_date: Joi.date().iso().required(),
});

// Novo schema para ida e volta (específico para este caso de uso)
const addRoundTripSchema = Joi.object({
  date: Joi.date().iso().required().label('Data da viagem'),
  goStop: Joi.object({
    address_id: Joi.string()
      .pattern(uuidRegex)
      .required()
      .label('Endereço de ida'),
    stop_date: Joi.date().iso().required().raw().label('Data/hora de ida'),
  }).required(),
  backStop: Joi.object({
    address_id: Joi.string()
      .pattern(uuidRegex)
      .required()
      .label('Endereço de volta'),
    stop_date: Joi.date().iso().required().raw().label('Data/hora de volta'),
  }).required(),
}).options({ stripUnknown: true });

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
  addRoundTripSchema,
  updateStopSchema,
  checkAvailabilitySchema,
};
