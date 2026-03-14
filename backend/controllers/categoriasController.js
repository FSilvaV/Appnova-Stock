const pool = require('../db');

const getAll = async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT c.*, COUNT(p.id) as total_productos 
       FROM categorias c 
       LEFT JOIN productos p ON p.categoria_id = c.id 
       GROUP BY c.id 
       ORDER BY c.nombre ASC`
    );
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const resultado = await pool.query(
      'INSERT INTO categorias (nombre, descripcion) VALUES ($1, $2) RETURNING *',
      [nombre, descripcion]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    const resultado = await pool.query(
      'UPDATE categorias SET nombre=$1, descripcion=$2 WHERE id=$3 RETURNING *',
      [nombre, descripcion, id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM categorias WHERE id = $1', [id]);
    res.json({ mensaje: 'Categoría eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAll, create, update, remove };