const express = require('express');
const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');
const forgotPasswordRoutes = require('./forgotPasswordRoutes');

const router = express.Router();

// Agrupamento de rotas de autenticação
router.use('/auth', authRoutes);

router.use('/auth', forgotPasswordRoutes);

// Agrupamento de rotas de perfil
router.use('/profile', profileRoutes);

module.exports = router;
