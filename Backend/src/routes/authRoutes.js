const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Rota de registro de usuário
router.post('/register', authController.register);

// Rota de login
router.post('/login', authController.login);

// Rota para resetar senha no primeiro login (requer autenticação)
router.post(
  '/reset-password',
  authMiddleware.authenticate,
  authController.resetPassword
);

module.exports = router;
