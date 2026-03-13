// ============================================================
// SERVER.JS — punto de entrada del backend
// Configura Express, middlewares y rutas
// ============================================================

// Carga las variables de entorno del archivo .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ── MIDDLEWARES ──
// cors: permite que el frontend se comunique con el backend
// express.json: permite recibir datos en formato JSON
app.use(cors());
app.use(express.json());


// ── RUTA DE PRUEBA ──
// Para verificar que el servidor está funcionando
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
