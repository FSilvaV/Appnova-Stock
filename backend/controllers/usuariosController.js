const pool = require('../db');

const getAll = async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT id, nombre, email, rol, activo, creado_en, ultimo_acceso FROM usuarios ORDER BY nombre ASC'
    );
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    const resultado = await pool.query(
      'INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol, activo',
      [nombre, email, password, rol]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, rol, activo } = req.body;
    const resultado = await pool.query(
      'UPDATE usuarios SET nombre=$1, email=$2, rol=$3, activo=$4 WHERE id=$5 RETURNING id, nombre, email, rol, activo',
      [nombre, email, rol, activo, id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAll, create, update, remove };