const express = require('express');
const router = express.Router();
const reportesPdfController = require('../controllers/reportesPdfController');

router.get('/inventario', reportesPdfController.inventario);
router.get('/movimientos', reportesPdfController.movimientos);
router.get('/alertas', reportesPdfController.alertas);

module.exports = router;