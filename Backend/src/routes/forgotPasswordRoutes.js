const express = require('express');
const forgotPasswordController = require('../controllers/forgotPasswordController');
const { validate } = require('../middlewares/validationMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const {
  forgotPasswordSchema,
  resetPasswordWithTokenSchema,
} = require('../validators/forgotPasswordValidation');

const router = express.Router();

router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  forgotPasswordController.requestPasswordReset
);

router.post(
  '/reset-password-token',
  validate(resetPasswordWithTokenSchema),
  forgotPasswordController.resetPasswordWithToken
);

// Rota para resetar senha no primeiro login (requer autenticação)
router.post(
  '/reset-password',
  authMiddleware.authenticate,
  forgotPasswordController.resetPasswordFirstLogin
);

module.exports = router;
