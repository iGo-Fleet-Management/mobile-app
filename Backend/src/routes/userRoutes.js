const express = require('express');
const userController = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Endpoints para gerenciamento usuários
 */
const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/user/get-all-users:
 *   get:
 *     summary: Obtém todos os usuários
 *     description: Retorna uma lista de todos os usuários cadastrados no sistema.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Lista de usuários obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: 151bee6a-c53f-4e7a-90a8-c3771c5ae930
 */
router.get('/get-all-users', userController.getAllUsers);

/**
 * @swagger
 * /api/user/delete-user/{id}:
 *   delete:
 *     summary: Exclui um usuário pelo ID
 *     description: Remove permanentemente um usuário do sistema utilizando seu UUID único.
 *     tags:
 *       - User
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
router.delete('/delete-user/:id', userController.deleteUser);

module.exports = router;
