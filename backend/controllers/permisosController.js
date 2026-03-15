const pool = require('../db');

// Obtiene permisos de un usuario
const getByUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const resultado = await pool.query(
      'SELECT modulo, activo FROM permisos_modulos WHERE usuario_id = $1',
      [usuario_id]
    );
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Guarda permisos de un usuario
// Reemplaza todos los permisos existentes
const guardar = async (req, res) => {
  const client = await pool.connect();
  try {
    const { usuario_id } = req.params;
    const { permisos } = req.body;

    await client.query('BEGIN');

    // Elimina permisos anteriores
    await client.query(
      'DELETE FROM permisos_modulos WHERE usuario_id = $1',
      [usuario_id]
    );

    // Inserta los nuevos permisos
    for (const permiso of permisos) {
      await client.query(
        'INSERT INTO permisos_modulos (usuario_id, modulo, activo) VALUES ($1, $2, $3)',
        [usuario_id, permiso.modulo, permiso.activo]
      );
    }

    await client.query('COMMIT');
    res.json({ mensaje: 'Permisos guardados correctamente' });

  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

module.exports = { getByUsuario, guardar };