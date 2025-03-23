const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rota de registro de usuário
router.post('/register', authController.register);

// Rota de login
router.post('/login', authController.login);

router.post('/logout', authenticate, authController.logout);

module.exports = router;
