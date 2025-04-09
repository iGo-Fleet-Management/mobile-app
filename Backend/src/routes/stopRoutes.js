const express = require('express');
const router = express.Router();
const { validate } = require('../middlewares/validationMiddleware');
const { authenticate } = require('../middlewares/authMiddleware');
const {
  addRoundTripSchema,
  addOnlyGoStopSchema,
  addOnlyBackStopSchema,
  isReleasedSchema,
} = require('../validators/stopValidation');
const controller = require('../controllers/stopController');

/**
 * @swagger
 * tags:
 *   name: Stops
 *   description: Endpoints para adicionar às viagems as paradas de usuários
 */

router.use(authenticate);

/**
 * @swagger
 * /add-roundtrip-stop:
 *   post:
 *     tags:
 *       - Stops
 *     summary: Cria uma parada de ida e volta
 *     description: Cadastra uma nova parada válida para ambos os trajetos (ida e volta)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stopId:
 *                 type: string
 *               name:
 *                 type: string
 *               coordinates:
 *                 type: array
 *                 items:
 *                   type: number
 *               isReleased:
 *                 type: boolean
 *             example:
 *               stopId: "STP123"
 *               name: "Parada Central"
 *               coordinates: [-23.5505, -46.6333]
 *               isReleased: true
 *     responses:
 *       201:
 *         description: Parada criada com sucesso
 *       400:
 *         description: Validação falhou/Erro na requisição
 *       500:
 *         description: Erro interno no servidor
 */
router.post(
  '/add-roundtrip-stop',
  validate(addRoundTripSchema), // Valida o body
  controller.addRoundTripStop
);

/**
 * @swagger
 * /add-onlygotrip-stop:
 *   post:
 *     tags:
 *       - Stops
 *     summary: Cria uma parada apenas para o trajeto de ida
 *     description: Cadastra uma nova parada válida exclusivamente para o trajeto de ida
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stopId:
 *                 type: string
 *               name:
 *                 type: string
 *               departureTime:
 *                 type: string
 *                 format: time
 *             example:
 *               stopId: "STP456"
 *               name: "Parada Norte"
 *               departureTime: "08:00"
 *     responses:
 *       201:
 *         description: Parada de ida criada com sucesso
 *       400:
 *         description: Dados inválidos ou faltantes
 *       500:
 *         description: Erro no servidor
 */
router.post(
  '/add-onlygotrip-stop',
  validate(addOnlyGoStopSchema), // Valida o body
  controller.addOnlyGoStop
);

/**
 * @swagger
 * /add-onlybacktrip-stop:
 *   post:
 *     tags:
 *       - Stops
 *     summary: Cria uma parada apenas para o trajeto de volta
 *     description: Cadastra uma nova parada válida exclusivamente para o trajeto de volta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stopId:
 *                 type: string
 *               name:
 *                 type: string
 *               returnTime:
 *                 type: string
 *                 format: time
 *             example:
 *               stopId: "STP789"
 *               name: "Parada Sul"
 *               returnTime: "18:30"
 *     responses:
 *       201:
 *         description: Parada de volta criada com sucesso
 *       400:
 *         description: Validação falhou
 *       500:
 *         description: Erro interno
 */
router.post(
  '/add-onlybacktrip-stop',
  validate(addOnlyBackStopSchema), // Valida o body
  controller.addOnlyBackStop
);

router.delete(
  '/remove-stops',
  validate(addRoundTripSchema),
  controller.removeTripStops
);

/**
 * @swagger
 * /update-is-released:
 *   post:
 *     tags:
 *       - Stops
 *     summary: Atualiza o status de liberação de uma parada
 *     description: Altera o status 'isReleased' para controlar a disponibilidade de uma parada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               isReleased:
 *                 type: boolean
 *             example:
 *               id: "65a8b5d9f1a0f83260f4e7d8"
 *               isReleased: false
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       400:
 *         description: ID inválido ou dados faltantes
 *       404:
 *         description: Parada não encontrada
 *       500:
 *         description: Erro ao atualizar
 */
router.post(
  '/update-is-released',
  validate(isReleasedSchema),
  controller.updateIsReleased
);

module.exports = router;
