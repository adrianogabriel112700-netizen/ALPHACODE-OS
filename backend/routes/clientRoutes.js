const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas de Clientes (Protegidas)
router.get('/', authMiddleware, clientController.getClients);

module.exports = router;