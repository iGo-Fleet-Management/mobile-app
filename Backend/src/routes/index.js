const express = require('express');
const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');
const forgotPasswordRoutes = require('./forgotPasswordRoutes');
const tripRoutes = require('./tripRoutes');
const stopRoutes = require('./stopRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

// Agrupamento de rotas de autenticação
router.use('/auth', authRoutes);

router.use('/auth', forgotPasswordRoutes);

// Agrupamento de rotas de perfil
router.use('/profile', profileRoutes);

router.use('/trips', tripRoutes);

router.use('/stops', stopRoutes);

router.use('/users', userRoutes);

module.exports = router;
