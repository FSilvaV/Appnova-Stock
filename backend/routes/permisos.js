const express = require('express');
const router = express.Router();
const permisosController = require('../controllers/permisosController');

router.get('/:usuario_id', permisosController.getByUsuario);
router.post('/:usuario_id', permisosController.guardar);

module.exports = router;