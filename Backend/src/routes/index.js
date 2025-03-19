const express = require('express');
const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');

const router = express.Router();

// Agrupamento de rotas de autenticação
router.use('/auth', authRoutes);

// Agrupamento de rotas de perfil
router.use('/profile', profileRoutes);

module.exports = router;
