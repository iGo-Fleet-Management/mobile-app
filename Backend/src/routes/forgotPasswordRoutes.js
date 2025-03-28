const express = require('express');
const forgotPasswordController = require('../controllers/forgotPasswordController');
const { validate } = require('../middlewares/validationMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const forgotPasswordValidation = require('../validators/forgotPasswordValidation');

const router = express.Router();

router.post(
  '/forgot-password',
  validate(forgotPasswordValidation.forgotPasswordSchema()),
  forgotPasswordController.requestPasswordReset
);

router.post(
  '/reset-password-token',
  validate(forgotPasswordValidation.resetPasswordSchema()),
  forgotPasswordController.resetPasswordWithToken
);

// Rota para resetar senha no primeiro login (requer autenticação)
router.post(
  '/reset-password',
  authMiddleware.authenticate,
  forgotPasswordController.resetPasswordFirstLogin
);

module.exports = router;
