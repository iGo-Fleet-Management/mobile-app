const express = require('express');
const profileController = require('../controllers/profileController');
// Importação dos novos validadores
const userValidation = require('../validators/userValidation');
const { validate } = require('../middlewares/validationMiddleware');
const { authenticate } = require('../middlewares/authMiddleware');
const { checkProfileComplete } = require('../middlewares/profileMiddleware');

const router = express.Router();

router.use(authenticate);

// Atualização para usar o novo schema de validação
router.put(
  '/complete-profile',
  validate(userValidation.completeProfileSchema()),
  profileController.completeRegistration
);

// Rota de atualização de perfil usando novo schema
router.put(
  '/',
  validate(userValidation.updateProfileSchema()),
  profileController.updateProfile
);

// Demais rotas permanecem iguais
router.get('/check-profile', checkProfileComplete);
router.get('/', profileController.getProfile);

module.exports = router;
