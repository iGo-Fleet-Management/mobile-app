const express = require('express');
const profileController = require('../controllers/profileController');
// Importação dos novos validadores
const userValidation = require('../validators/userValidation');
const addressValidation = require('../validators/addressValidation');
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
 * /profile:
 *   get:
 *     summary: Obter perfil completo
 *     description: Retorna todos os dados do perfil incluindo endereços
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil recuperado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Perfil não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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
router.get('/check', checkProfileComplete);

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
  '/create',
  validate(userValidation.createProfileSchema()),
  profileController.createProfile
);

/**
 * @swagger
 * /profile/update-profile:
 *   put:
 *     summary: Atualizar dados do usuário
 *     description: Atualiza informações básicas do perfil do usuário
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
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: João Silva
 *                   phone:
 *                     type: string
 *                     example: 31999999999
 *                 description: Dados pessoais para atualização
 *     responses:
 *       200:
 *         description: Dados atualizados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
  '/update-profile',
  validate(userValidation.updateUserDataSchema()),
  profileController.updateProfile
);

/**
 * @swagger
 * /profile/update-address:
 *   put:
 *     summary: Atualizar endereços
 *     description: Atualiza ou cria novos endereços (envie address_id para atualizar)
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
 *               addressUpdates:
 *                 type: array
 *                 items:
 *                   oneOf:
 *                     - type: object
 *                       properties:
 *                         address_id:
 *                           type: string
 *                           format: uuid
 *                           example: d6890194-eba3-47b2-8294-f99f0e8735ac
 *                         address_type:
 *                           type: string
 *                           example: Casa
 *                         cep:
 *                           type: string
 *                           example: "35164099"
 *                         street:
 *                           type: string
 *                           example: Rua Pretoria
 *                         number:
 *                           type: integer
 *                           example: 123
 *                         complement:
 *                           type: string
 *                           example: Apt 101
 *                         neighbourhood:
 *                           type: string
 *                           example: Bethânia
 *                         city:
 *                           type: string
 *                           example: Ipatinga
 *                         state:
 *                           type: string
 *                           example: MG
 *                       required:
 *                         - address_id
 *                     - type: object
 *                       properties:
 *                         address_type:
 *                           type: string
 *                           required: true
 *                           example: Trabalho
 *                         cep:
 *                           type: string
 *                           required: true
 *                           example: "30130001"
 *                         street:
 *                           type: string
 *                           required: true
 *                           example: Av. Paulista
 *                         number:
 *                           type: integer
 *                           required: true
 *                           example: 1000
 *                         complement:
 *                           type: string
 *                           example: ""
 *                         neighbourhood:
 *                           type: string
 *                           required: true
 *                           example: Bela Vista
 *                         city:
 *                           type: string
 *                           required: true
 *                           example: São Paulo
 *                         state:
 *                           type: string
 *                           required: true
 *                           example: SP
 *                 minItems: 1
 *     responses:
 *       200:
 *         description: Endereços atualizados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Erro ao atualizar endereços
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *               examples:
 *                 address-not-found:
 *                   value:
 *                     success: false
 *                     code: ADDRESS_UPDATE_ERROR
 *                     message: Endereço não encontrado
 */
router.put(
  '/update-address',
  validate(addressValidation.updateAddressSchema()),
  profileController.updateAddresses
);

/**
 * @swagger
 * /api/profile/delete-user/{id}:
 *   delete:
 *     summary: Exclui um usuário pelo ID
 *     description: Remove permanentemente um usuário do sistema utilizando seu UUID único.
 *     tags:
 *       - Profile
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID do usuário a ser excluído
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 151bee6a-c53f-4e7a-90a8-c3771c5ae930
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Usuário excluído com sucesso
 *       400:
 *         description: ID de usuário inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 code:
 *                   type: string
 *                   example: INVALID_USER_ID
 *                 message:
 *                   type: string
 *                   example: ID de usuário inválido
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 code:
 *                   type: string
 *                   example: USER_NOT_FOUND
 *                 message:
 *                   type: string
 *                   example: Usuário não encontrado
 *       500:
 *         description: Erro interno ao deletar usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 code:
 *                   type: string
 *                   example: USER_DELETION_ERROR
 *                 message:
 *                   type: string
 *                   example: Erro ao deletar usuário
 */
router.delete('/delete-user/:id', profileController.deleteUser);

module.exports = router;
