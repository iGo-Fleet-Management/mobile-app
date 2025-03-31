const express = require('express');
const router = express.Router();
const { validate } = require('../middlewares/validationMiddleware');
const { authenticate } = require('../middlewares/authMiddleware');
const {
  createStopSchema,
  updateStopSchema,
  checkAvailabilitySchema,
  stopParamsSchema,
} = require('../validators/stopValidation');
const controller = require('../controllers/stopController');

router.use(authenticate);

// Rota para criar nova parada
router.post(
  '/stops',
  validate(createStopSchema), // Valida o body
  controller.createStop
);

// Rota para atualizar parada
router.put(
  '/stops/:stopId',
  validate(stopParamsSchema, 'params'), // Valida o ID na URL
  validate(updateStopSchema), // Valida o body
  controller.updateStop
);

// Rota para buscar paradas de um usuário
router.get(
  '/stops/user/:userId',
  validate(stopParamsSchema, 'params'), // Valida user_id como UUID
  controller.getUserStops
);

// Rota para buscar paradas de uma viagem
router.get(
  '/stops/trip/:tripId',
  validate(stopParamsSchema, 'params'), // Valida trip_id como UUID
  controller.getTripStops
);

// Rota para verificar disponibilidade
router.post(
  '/stops/check-availability/:tripId',
  validate(stopParamsSchema, 'params'), // Valida trip_id
  validate(checkAvailabilitySchema), // Valida body com stop_date
  controller.checkAvailability
);

// Rota para cancelar parada
router.delete(
  '/stops/:stopId',
  validate(stopParamsSchema, 'params'), // Valida stop_id
  controller.cancelStop
);

module.exports = router;
