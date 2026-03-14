const express = require('express');
const router = express.Router();
const proveedoresController = require('../controllers/proveedoresController');

router.get('/', proveedoresController.getAll);
router.post('/', proveedoresController.create);
router.put('/:id', proveedoresController.update);
router.delete('/:id', proveedoresController.remove);

module.exports = router;