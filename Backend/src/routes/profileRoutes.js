const express = require('express');
const profileController = require('../controllers/profileController');
const { validate } = require('../middlewares/validation');
const { profileSchema } = require('../validators/profileSchema');
const { checkProfileComplete } = require('../middlewares/checkProfile');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

router.put(
  '/complete-profile',
  authenticate,
  validate(profileSchema),
  profileController.completeRegistration
);

router.get('/check-profile', authenticate, checkProfileComplete, (req, res) => {
  res.status(200).json({ message: 'Perfil completo' });
});

module.exports = router;
