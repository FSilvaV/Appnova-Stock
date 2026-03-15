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
app.use(cors({
  origin: '*'
}));
app.use(express.json());

const path = require('path');
app.use(express.static(path.join(__dirname, '..')));

// ── RUTAS ──

// ── RUTAS ──
const productosRoutes = require('./routes/productos');
app.use('/api/productos', productosRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const categoriasRoutes = require('./routes/categorias');
app.use('/api/categorias', categoriasRoutes);

const proveedoresRoutes = require('./routes/proveedores');
app.use('/api/proveedores', proveedoresRoutes);

const movimientosRoutes = require('./routes/movimientos');
app.use('/api/movimientos', movimientosRoutes);

const usuariosRoutes = require('./routes/usuarios');
app.use('/api/usuarios', usuariosRoutes);

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