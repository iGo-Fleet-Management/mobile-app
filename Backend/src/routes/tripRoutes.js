// tripRoutes.js
const express = require('express');
const controller = require('../controllers/tripController');
const { validate } = require('../middlewares/validationMiddleware');
const { authenticate } = require('../middlewares/authMiddleware');
const {
  createTripSchema,
  tripParamsSchema,
  dailyTripsSchema,
} = require('../validators/tripValidation');

const router = express.Router();

router.use(authenticate);

router.post(
  '/trips/create',
  validate(createTripSchema),
  controller.createDailyTrips
);

router.get(
  '/trips/daily',
  validate(dailyTripsSchema),
  controller.getDailyTrips
);

router.get(
  '/trips/:tripId',
  validate(tripParamsSchema, 'params'),
  controller.getTrip
);

router.put(
  '/trips/:tripId',
  validate(tripParamsSchema, 'params'),
  controller.updateTrip
);
router.delete(
  '/trips/:tripId',
  validate(tripParamsSchema, 'params'),
  controller.deleteTrip
);
module.exports = router;
