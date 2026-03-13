// ============================================================
// ROUTES/AUTH.JS — ruta de autenticación
// Maneja el login y verifica usuario/contraseña en la BD
// Retorna el rol del usuario para que el frontend
// muestre los módulos correspondientes
// ============================================================

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login — iniciar sesión
router.post('/login', authController.login);

module.exports = router;