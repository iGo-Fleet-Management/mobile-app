const express = require('express');
const profileController = require('../controllers/profileController');
const { validate } = require('../middlewares/validationMiddleware');
const {
  updateProfileSchema,
  profileSchema,
} = require('../validators/profileSchema');
const { checkProfileComplete } = require('../middlewares/profileMiddleware');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authenticate);

// Rota para completar o cadastro do perfil
router.put(
  '/complete-profile',
  validate(profileSchema),
  profileController.completeRegistration
);

// Rota para verificar se o perfil está completo
router.get('/check-profile', checkProfileComplete);

// Rota para obter o perfil do usuário
router.get('/', profileController.getProfile);
// Rota para alterar o perfil do usuário
router.put('/', validate(updateProfileSchema), profileController.updateProfile);

module.exports = router;
