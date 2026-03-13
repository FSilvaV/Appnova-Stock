// ============================================================
// CONTROLLERS/AUTHCONTROLLER.JS — lógica de autenticación
// Verifica usuario y contraseña en la BD
// Retorna datos del usuario y su rol
// En el futuro se agregará JWT para mayor seguridad
// ============================================================

const pool = require('../db');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación básica de campos vacíos
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son requeridos' 
      });
    }

    // Busca el usuario en la BD por email
    const resultado = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1 AND activo = true',
      [email]
    );

    // Si no existe el usuario
    if (resultado.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Credenciales incorrectas' 
      });
    }

    const usuario = resultado.rows[0];

    // Verifica la contraseña
    // NOTA: por ahora comparamos texto plano
    // En producción usaremos bcrypt para encriptar
    if (usuario.password_hash !== password) {
      return res.status(401).json({ 
        error: 'Credenciales incorrectas' 
      });
    }

    // Actualiza último acceso
    await pool.query(
      'UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = $1',
      [usuario.id]
    );

    // Retorna datos del usuario sin la contraseña
    res.json({
      mensaje: 'Login exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { login };