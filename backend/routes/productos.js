// ============================================================
// ROUTES/PRODUCTOS.JS — rutas de la API para productos
// Define los endpoints que el frontend consultará
// Cada ruta llama a su función en el controller
// ============================================================

const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');

// GET /api/productos — obtener todos los productos
router.get('/', productosController.getAll);

// GET /api/productos/:id — obtener un producto por ID
router.get('/:id', productosController.getById);

// POST /api/productos — crear nuevo producto
router.post('/', productosController.create);

// PUT /api/productos/:id — editar producto
router.put('/:id', productosController.update);

// DELETE /api/productos/:id — eliminar producto
router.delete('/:id', productosController.remove);

module.exports = router;