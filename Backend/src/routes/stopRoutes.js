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
} = require('../validators/stopValidation');
const controller = require('../controllers/stopController');

router.use(authenticate);

// Rota para criar nova parada - OK
router.post(
  '/add-roundtrip-stop',
  validate(addRoundTripSchema), // Valida o body
  controller.addRoundTripStop
);

module.exports = router;
