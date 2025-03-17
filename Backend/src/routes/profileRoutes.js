const express = require('express');
const { completeRegistration } = require('../controllers/profileController');
const { validate } = require('../middlewares/validation');
const { profileSchema } = require('../validators/profileSchema');
const { checkProfileComplete } = require('../middlewares/checkProfile');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

router.put(
  '/complete-profile',
  authenticate,
  validate(profileSchema),
  completeRegistration
);

router.get('/check-profile', authenticate, checkProfileComplete);

module.exports = router;
