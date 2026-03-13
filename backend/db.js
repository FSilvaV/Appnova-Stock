// ============================================================
// DB.JS — conexión a la base de datos PostgreSQL
// Usa las variables del archivo .env para conectarse
// Este archivo se importa en cada ruta que necesite la BD
// ============================================================

const { Pool } = require('pg');
require('dotenv').config();

// Pool: maneja múltiples conexiones simultáneas a la BD
// En vez de abrir y cerrar una conexión por cada consulta,
// el pool reutiliza conexiones existentes — más eficiente
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Prueba la conexión al iniciar
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error conectando a PostgreSQL:', err.message);
  } else {
    console.log('Conectado a PostgreSQL correctamente');
    release();
  }
});

module.exports = pool;