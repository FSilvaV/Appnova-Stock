const express = require('express');
const router = express.Router();
const movimientosController = require('../controllers/movimientosController');

router.get('/', movimientosController.getAll);
router.post('/', movimientosController.create);

module.exports = router;