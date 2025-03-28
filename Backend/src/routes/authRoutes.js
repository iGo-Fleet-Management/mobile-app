const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Endpoints para registro, login e logout de usuários
 */
const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_type:
 *                 type: string
 *                 description: Tipo de usuário
 *               name:
 *                 type: string
 *                 description: Primeiro nome do usuário
 *               last_name:
 *                 type: string
 *                 description: Sobrenome do usuário
 *               email:
 *                 type: string
 *                 format: email
 *                 description: E-mail do usuário
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Senha do usuário
 *               reset_password:
 *                 type: boolean
 *                 description: Flag para redefinição de senha
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     email:
 *                       type: string
 *       409:
 *         description: Usuário já registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autenticar usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: E-mail do usuário
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Senha do usuário
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     reset_password:
 *                       type: boolean
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout do usuário
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Token inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/logout', authenticate, authController.logout);

module.exports = router;
