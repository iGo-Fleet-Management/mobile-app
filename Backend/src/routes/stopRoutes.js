const express = require('express');
const router = express.Router();
const { validate } = require('../middlewares/validationMiddleware');
const { authenticate } = require('../middlewares/authMiddleware');
const {
  createStopSchema,
  updateStopSchema,
  checkAvailabilitySchema,
  stopParamsSchema,
  addRoundTripSchema,
  addOnlyGoStopSchema,
  addOnlyBackStopSchema,
} = require('../validators/stopValidation');
const controller = require('../controllers/stopController');

router.use(authenticate);

// Rota para criar parada de ida e volta - OK
router.post(
  '/add-roundtrip-stop',
  validate(addRoundTripSchema), // Valida o body
  controller.addRoundTripStop
);

// Rota para criar parada de ida
router.post(
  '/add-onlygotrip-stop',
  validate(addOnlyGoStopSchema), // Valida o body
  controller.addOnlyGoStop
);

// Rota para criar parada de volta
router.post(
  '/add-onlybacktrip-stop',
  validate(addOnlyBackStopSchema), // Valida o body
  controller.addOnlyBackStop
);

module.exports = router;
