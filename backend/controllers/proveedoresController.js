const pool = require('../db');

const getAll = async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM proveedores ORDER BY nombre ASC'
    );
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { nombre, rut, contacto, telefono, email } = req.body;
    const resultado = await pool.query(
      'INSERT INTO proveedores (nombre, rut, contacto, telefono, email) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, rut, contacto, telefono, email]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, rut, contacto, telefono, email } = req.body;
    const resultado = await pool.query(
      'UPDATE proveedores SET nombre=$1, rut=$2, contacto=$3, telefono=$4, email=$5 WHERE id=$6 RETURNING *',
      [nombre, rut, contacto, telefono, email, id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM proveedores WHERE id = $1', [id]);
    res.json({ mensaje: 'Proveedor eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAll, create, update, remove };