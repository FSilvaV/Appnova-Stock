// ============================================================
// SERVER.JS — punto de entrada del backend
// Configura Express, middlewares, BD y rutas
// ============================================================

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// ── MIDDLEWARES ──
app.use(cors());
app.use(express.json());

// ── RUTAS ──
// Cada archivo de rutas maneja un módulo distinto
// /api/productos → routes/productos.js
const productosRoutes = require('./routes/productos');
app.use('/api/productos', productosRoutes);

// ── RUTA DE PRUEBA ──
app.get('/', (req, res) => {
  res.json({ 
    mensaje: 'AppNova Stock API funcionando',
    version: '1.0.0'
  });
});

// ── INICIA EL SERVIDOR ──
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});