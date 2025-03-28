const express = require('express');
const profileController = require('../controllers/profileController');
// Importação dos novos validadores
const userValidation = require('../validators/userValidation');
const { validate } = require('../middlewares/validationMiddleware');
const { authenticate } = require('../middlewares/authMiddleware');
const { checkProfileComplete } = require('../middlewares/profileMiddleware');

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: Endpoints para gerenciamento de perfis de usuários
 */
const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /profile/complete-profile:
 *   put:
 *     summary: Completar registro do perfil
 *     description: Rota para completar o registro inicial do perfil do usuário
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userData:
 *                 type: object
 *                 description: Dados do usuário para completar o perfil
 *                 properties:
 *                   cpf:
 *                     type: string
 *                     description: CPF do usuário
 *                   birthdate:
 *                     type: string
 *                     format: date
 *                     description: Data de nascimento
 *                   phone:
 *                     type: string
 *                     description: Número de telefone
 *               addressUpdates:
 *                 type: object
 *                 description: Informações de endereço
 *                 properties:
 *                   street:
 *                     type: string
 *                     description: Rua
 *                   number:
 *                     type: string
 *                     description: Número
 *                   city:
 *                     type: string
 *                     description: Cidade
 *                   state:
 *                     type: string
 *                     description: Estado
 *                   zipCode:
 *                     type: string
 *                     description: Código postal
 *     responses:
 *       200:
 *         description: Perfil completado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   description: Dados do perfil atualizado
 *       400:
 *         description: Erro na conclusão do perfil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 code:
 *                   type: string
 *                   example: PROFILE_COMPLETION_ERROR
 *                 message:
 *                   type: string
 */
router.put(
  '/complete-profile',
  validate(userValidation.completeProfileSchema()),
  profileController.completeRegistration
);

/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Atualizar perfil do usuário
 *     description: Rota para atualizar informações do perfil
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userData:
 *                 type: object
 *                 description: Dados do usuário para atualização
 *               addressUpdates:
 *                 type: object
 *                 description: Informações de endereço para atualização
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   description: Dados do perfil atualizado
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 code:
 *                   type: string
 *                   example: PROFILE_UPDATE_ERROR
 *                 message:
 *                   type: string
 *       500:
 *         description: Erro interno do servidor
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
 *   get:
 *     summary: Obter perfil do usuário
 *     description: Rota para recuperar informações do perfil do usuário autenticado
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil recuperado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   description: Detalhes do perfil do usuário
 *       404:
 *         description: Perfil não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 code:
 *                   type: string
 *                   example: PROFILE_NOT_FOUND
 *                 message:
 *                   type: string
 */
router.put(
  '/',
  validate(userValidation.updateProfileSchema()),
  profileController.updateProfile
);
router.get('/', profileController.getProfile);

/**
 * @swagger
 * /profile/check-profile:
 *   get:
 *     summary: Verificar completude do perfil
 *     description: Verifica se o perfil do usuário está completamente preenchido
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil completamente preenchido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: SUCCESS
 *                 message:
 *                   type: string
 *       428:
 *         description: Perfil incompleto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: PROFILE_INCOMPLETE
 *                 message:
 *                   type: string
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/check-profile', checkProfileComplete);

module.exports = router;
