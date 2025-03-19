const express = require('express');
const { completeRegistration } = require('../controllers/profileController');
const { validate } = require('../middlewares/validation');
const { profileSchema } = require('../validators/profileSchema');
const { checkProfileComplete } = require('../middlewares/checkProfile');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rota para completar o cadastro do perfil
router.put(
  '/complete-profile',
  authenticate,
  validate(profileSchema),
  completeRegistration
);

// Rota para verificar se o perfil está completo
router.get('/check-profile', authenticate, checkProfileComplete);

module.exports = router;
