// tripValidator.js
const Joi = require('joi');
const { uuidRegex } = require('./patterns');

const tripParamsSchema = Joi.object({
  tripId: Joi.string().pattern(uuidRegex).required(),
});

const createTripSchema = Joi.object().keys({
  body: Joi.object({
    trip_type: Joi.string().valid('ida', 'volta').required(),
    trip_date: Joi.date().iso().required(),
  }),
  params: Joi.object().optional(),
});

const dailyTripsSchema = Joi.object().keys({
  query: Joi.object({
    date: Joi.date().iso().default(new Date().toISOString()),
  }),
});

module.exports = {
  tripParamsSchema,
  createTripSchema,
  dailyTripsSchema,
};
