// ============================================================
// CONTROLLERS/PRODUCTOSCONTROLLER.JS — lógica de productos
// Cada función recibe la petición, consulta la BD y responde
// req = lo que llega del frontend
// res = lo que devolvemos al frontend
// ============================================================

const pool = require('../db');

// GET todos los productos
const getAll = async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT p.*,
             c.nombre as categoria_nombre,
             pr.nombre as proveedor_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
      ORDER BY p.nombre ASC
    `);
    res.json(resultado.rows);  // ← faltaba esto
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET producto por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query(
      'SELECT * FROM productos WHERE id = $1', [id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST crear producto
const create = async (req, res) => {
  try {
    const { nombre, sku, categoria_id, proveedor_id, precio, stock, stock_minimo, imagen_url } = req.body;
    const resultado = await pool.query(
      `INSERT INTO productos (nombre, sku, categoria_id, proveedor_id, precio, stock, stock_minimo, imagen_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [nombre, sku, categoria_id, proveedor_id, precio, stock, stock_minimo, imagen_url]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT editar producto
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, sku, categoria_id, proveedor_id, precio, stock, stock_minimo, imagen_url } = req.body;
    const resultado = await pool.query(
      `UPDATE productos SET nombre=$1, sku=$2, categoria_id=$3, proveedor_id=$4,
       precio=$5, stock=$6, stock_minimo=$7, imagen_url=$8 WHERE id=$9 RETURNING *`,
      [nombre, sku, categoria_id, proveedor_id, precio, stock, stock_minimo, imagen_url, id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE eliminar producto
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query(
      'DELETE FROM productos WHERE id = $1 RETURNING *', [id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };