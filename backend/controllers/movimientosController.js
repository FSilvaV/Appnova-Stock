const pool = require('../db');

const getAll = async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT m.*, p.nombre as producto_nombre, p.sku,
             u.nombre as usuario_nombre
      FROM movimientos m
      JOIN productos p ON m.producto_id = p.id
      JOIN usuarios u ON m.usuario_id = u.id
      ORDER BY m.creado_en DESC
    `);
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  const client = await pool.connect();
  try {
    const { producto_id, usuario_id, tipo, cantidad, nota } = req.body;

    await client.query('BEGIN');

    // Obtiene stock actual del producto
    const prodResult = await client.query(
      'SELECT stock FROM productos WHERE id = $1', [producto_id]
    );

    if (prodResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const stock_anterior = prodResult.rows[0].stock;
    let stock_nuevo;

    if (tipo === 'entrada') {
      stock_nuevo = stock_anterior + parseInt(cantidad);
    } else {
      stock_nuevo = stock_anterior - parseInt(cantidad);
      if (stock_nuevo < 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Stock insuficiente' });
      }
    }

    // Actualiza el stock del producto
    await client.query(
      'UPDATE productos SET stock = $1, actualizado_en = NOW() WHERE id = $2',
      [stock_nuevo, producto_id]
    );

    // Registra el movimiento
    const resultado = await client.query(`
      INSERT INTO movimientos (producto_id, usuario_id, tipo, cantidad, stock_anterior, stock_nuevo, nota)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [producto_id, usuario_id, tipo, cantidad, stock_anterior, stock_nuevo, nota]
    );

    await client.query('COMMIT');
    res.status(201).json(resultado.rows[0]);

  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

module.exports = { getAll, create };