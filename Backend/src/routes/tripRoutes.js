// tripRoutes.js
const express = require('express');
const controller = require('../controllers/tripController');
const { validate } = require('../middlewares/validationMiddleware');
const { authenticate } = require('../middlewares/authMiddleware');
const {
  tripParamsSchema,
  dailyTripsSchema,
} = require('../validators/tripValidation');

const router = express.Router();

router.use(authenticate);

router.get('/daily', validate(dailyTripsSchema), controller.getDailyTrips);

router.get(
  '/:tripId',
  validate(tripParamsSchema, 'params'),
  controller.getTrip
);

router.delete(
  '/:tripId',
  validate(tripParamsSchema, 'params'),
  controller.deleteTrip
);
module.exports = router;
