-- ============================================================
-- DATABASE.SQL — script de creación de la base de datos
-- Ejecutar en pgAdmin o psql para crear las tablas
-- Orden importante: primero tablas sin dependencias,
-- luego las que dependen de otras (foreign keys)
-- ============================================================


-- Crea la base de datos si no existe
-- Ejecuta esto primero por separado en pgAdmin
-- CREATE DATABASE appnova_stock;


-- ============================================================
-- TABLA: categorias
-- Sin dependencias, se crea primero
-- ============================================================
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,           -- ID autoincremental
  nombre VARCHAR(100) NOT NULL,    -- nombre de la categoría
  descripcion TEXT,                -- descripción opcional
  activa BOOLEAN DEFAULT true,     -- para activar/desactivar
  creado_en TIMESTAMP DEFAULT NOW()
);


-- ============================================================
-- TABLA: proveedores
-- Sin dependencias, se crea antes que productos
-- ============================================================
CREATE TABLE IF NOT EXISTS proveedores (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  rut VARCHAR(20),
  contacto VARCHAR(100),           -- nombre del contacto
  telefono VARCHAR(20),
  email VARCHAR(100),
  activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMP DEFAULT NOW()
);


-- ============================================================
-- TABLA: productos
-- Depende de categorias y proveedores (foreign keys)
-- ============================================================
CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  sku VARCHAR(50) UNIQUE,          -- código único del producto
  descripcion TEXT,
  categoria_id INT REFERENCES categorias(id),    -- FK a categorias
  proveedor_id INT REFERENCES proveedores(id),   -- FK a proveedores
  precio DECIMAL(10,2) DEFAULT 0,  -- precio con 2 decimales
  stock INT DEFAULT 0,             -- cantidad actual
  stock_minimo INT DEFAULT 0,      -- alerta cuando baje de este valor
  imagen_url TEXT,                 -- URL de la imagen del producto
  activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMP DEFAULT NOW(),
  actualizado_en TIMESTAMP DEFAULT NOW()
);


-- ============================================================
-- TABLA: usuarios
-- Maneja roles: vendedor, supervisor, admin, superadmin
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,     -- contraseña encriptada, nunca texto plano
  rol VARCHAR(20) DEFAULT 'vendedor' CHECK (rol IN ('vendedor', 'supervisor', 'admin', 'superadmin')),
  activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMP DEFAULT NOW(),
  ultimo_acceso TIMESTAMP
);


-- ============================================================
-- TABLA: movimientos
-- Registra cada entrada o salida de stock
-- Depende de productos y usuarios
-- ============================================================
CREATE TABLE IF NOT EXISTS movimientos (
  id SERIAL PRIMARY KEY,
  producto_id INT REFERENCES productos(id) NOT NULL,
  usuario_id INT REFERENCES usuarios(id) NOT NULL,
  tipo VARCHAR(10) CHECK (tipo IN ('entrada', 'salida')),
  cantidad INT NOT NULL,
  stock_anterior INT NOT NULL,     -- stock antes del movimiento
  stock_nuevo INT NOT NULL,        -- stock después del movimiento
  nota TEXT,                       -- comentario opcional
  creado_en TIMESTAMP DEFAULT NOW()
);


-- ============================================================
-- TABLA: permisos_modulos
-- Controla qué módulos puede ver cada cliente (white label)
-- Solo visible y editable por superadmin (tú)
-- ============================================================
CREATE TABLE IF NOT EXISTS permisos_modulos (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id),
  modulo VARCHAR(50) NOT NULL,     -- nombre del módulo
  activo BOOLEAN DEFAULT true,     -- on/off por cliente
  creado_en TIMESTAMP DEFAULT NOW()
);


-- ============================================================
-- DATOS DE PRUEBA — para testear el sistema
-- Puedes borrar esto cuando tengas datos reales
-- ============================================================

-- Categorías de ejemplo
INSERT INTO categorias (nombre, descripcion) VALUES
  ('Herramientas', 'Martillos, destornilladores, llaves y más'),
  ('Ferretería', 'Tornillos, tuercas, pernos y accesorios'),
  ('Materiales', 'Pinturas, lijas, selladores y más'),
  ('Seguridad', 'Guantes, cascos, lentes de protección'),
  ('Electricidad', 'Cables, enchufes, interruptores');

-- Proveedor de ejemplo
INSERT INTO proveedores (nombre, rut, contacto, telefono, email) VALUES
  ('Ferretería Central Ltda.', '76.123.456-7', 'Juan Pérez', '+56 9 1234 5678', 'contacto@ferrcentral.cl');

-- Usuario admin de prueba
-- IMPORTANTE: en producción la contraseña debe estar encriptada con bcrypt
-- Por ahora usamos texto plano solo para pruebas
INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES
  ('Francisco Silva', 'admin@stock.cl', '1234', 'admin'),
  ('María González', 'vendedor@stock.cl', '1234', 'vendedor');

-- Productos de ejemplo
INSERT INTO productos (nombre, sku, categoria_id, proveedor_id, precio, stock, stock_minimo) VALUES
  ('Martillo Stanley 16oz', 'MART-001', 1, 1, 8990, 45, 10),
  ('Tornillos 1/2" (caja x100)', 'TORN-002', 2, 1, 2490, 8, 15),
  ('Lija 120 (unidad)', 'LIJA-003', 3, 1, 390, 2, 10);