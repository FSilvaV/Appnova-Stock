const PDFDocument = require('pdfkit');
const pool = require('../db');

// Colores AppNova
const AZUL = '#3b82f6';
const GRIS = '#64748b';
const NEGRO = '#1e293b';
const BORDE = '#e2e8f0';

function encabezado(doc, titulo, subtitulo) {
  // Fondo azul superior
  doc.rect(0, 0, 612, 80).fill(AZUL);

  // Logo texto
  doc.fontSize(20).fillColor('white').font('Helvetica-Bold')
    .text('AppNova Stock', 40, 25);
  doc.fontSize(10).fillColor('rgba(255,255,255,0.8)').font('Helvetica')
    .text('by AppNova Solutions', 40, 50);

  // Título del reporte a la derecha
  doc.fontSize(10).fillColor('white').font('Helvetica')
    .text(new Date().toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), 400, 25, { align: 'right', width: 172 });

  // Título principal
  doc.moveDown(2);
  doc.fontSize(16).fillColor(NEGRO).font('Helvetica-Bold')
    .text(titulo, 40, 100);
  doc.fontSize(10).fillColor(GRIS).font('Helvetica')
    .text(subtitulo, 40, 122);

  // Línea separadora
  doc.moveTo(40, 145).lineTo(572, 145).strokeColor(BORDE).stroke();

  return 160; // Y donde empieza el contenido
}

function piePagina(doc) {
  const paginas = doc.bufferedPageRange();
  for (let i = 0; i < paginas.count; i++) {
    doc.switchToPage(i);
    doc.fontSize(8).fillColor(GRIS).font('Helvetica')
      .text('AppNova Solutions · appnova.cl · Reporte generado automáticamente', 40, 780, { align: 'center', width: 532 });
  }
}

// ── REPORTE INVENTARIO COMPLETO ──
const inventario = async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT p.nombre, p.sku, c.nombre as categoria, p.precio, p.stock, p.stock_minimo,
             (p.precio * p.stock) as valor_total
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      ORDER BY p.nombre ASC
    `);
    const productos = resultado.rows;

    const doc = new PDFDocument({ margin: 40, bufferPages: true });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="inventario.pdf"');
    doc.pipe(res);

    let y = encabezado(doc, 'Reporte de Inventario', `Total de productos: ${productos.length}`);

    // Encabezados tabla
    const cols = { nombre: 40, sku: 200, categoria: 290, precio: 380, stock: 450, estado: 510 };
    doc.fontSize(8).fillColor('white').font('Helvetica-Bold');
    doc.rect(40, y, 532, 20).fill(AZUL);
    doc.fillColor('white')
      .text('PRODUCTO', cols.nombre + 4, y + 6)
      .text('SKU', cols.sku + 4, y + 6)
      .text('CATEGORÍA', cols.categoria + 4, y + 6)
      .text('PRECIO', cols.precio + 4, y + 6)
      .text('STOCK', cols.stock + 4, y + 6)
      .text('ESTADO', cols.estado + 4, y + 6);
    y += 20;

    // Filas
    productos.forEach((p, i) => {
      if (y > 720) { doc.addPage(); y = 40; }
      const bg = i % 2 === 0 ? '#f8fafc' : 'white';
      doc.rect(40, y, 532, 18).fill(bg);
      const estado = p.stock < p.stock_minimo ? 'Bajo' : 'Ok';
      const colorEstado = p.stock < p.stock_minimo ? '#ef4444' : '#10b981';
      doc.fontSize(8).font('Helvetica').fillColor(NEGRO)
        .text(p.nombre.substring(0, 22), cols.nombre + 4, y + 5)
        .text(p.sku || '—', cols.sku + 4, y + 5)
        .text(p.categoria || '—', cols.categoria + 4, y + 5)
        .text(`$${Number(p.precio).toLocaleString('es-CL')}`, cols.precio + 4, y + 5)
        .text(String(p.stock), cols.stock + 4, y + 5);
      doc.fillColor(colorEstado).text(estado, cols.estado + 4, y + 5);
      y += 18;
    });

    // Total
    const valorTotal = productos.reduce((acc, p) => acc + Number(p.valor_total), 0);
    y += 10;
    doc.rect(40, y, 532, 24).fill(AZUL);
    doc.fontSize(9).font('Helvetica-Bold').fillColor('white')
      .text(`Valor total del inventario: $${Math.round(valorTotal).toLocaleString('es-CL')}`, 44, y + 7);

    piePagina(doc);
    doc.end();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── REPORTE MOVIMIENTOS ──
const movimientos = async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT m.tipo, m.cantidad, m.stock_anterior, m.stock_nuevo, m.nota, m.creado_en,
             p.nombre as producto, u.nombre as usuario
      FROM movimientos m
      JOIN productos p ON m.producto_id = p.id
      JOIN usuarios u ON m.usuario_id = u.id
      ORDER BY m.creado_en DESC
    `);
    const movs = resultado.rows;

    const doc = new PDFDocument({ margin: 40, bufferPages: true });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="movimientos.pdf"');
    doc.pipe(res);

    let y = encabezado(doc, 'Reporte de Movimientos', `Total: ${movs.length} movimientos`);

    // Encabezados
    const cols = { fecha: 40, producto: 130, tipo: 290, cantidad: 350, usuario: 410, nota: 480 };
    doc.rect(40, y, 532, 20).fill(AZUL);
    doc.fontSize(8).font('Helvetica-Bold').fillColor('white')
      .text('FECHA', cols.fecha + 4, y + 6)
      .text('PRODUCTO', cols.producto + 4, y + 6)
      .text('TIPO', cols.tipo + 4, y + 6)
      .text('CANTIDAD', cols.cantidad + 4, y + 6)
      .text('USUARIO', cols.usuario + 4, y + 6)
      .text('NOTA', cols.nota + 4, y + 6);
    y += 20;

    movs.forEach((m, i) => {
      if (y > 720) { doc.addPage(); y = 40; }
      const bg = i % 2 === 0 ? '#f8fafc' : 'white';
      doc.rect(40, y, 532, 18).fill(bg);
      const colorTipo = m.tipo === 'entrada' ? '#10b981' : '#ef4444';
      doc.fontSize(7).font('Helvetica').fillColor(NEGRO)
        .text(new Date(m.creado_en).toLocaleDateString('es-CL'), cols.fecha + 4, y + 5)
        .text(m.producto.substring(0, 20), cols.producto + 4, y + 5)
        .text(String(m.cantidad), cols.cantidad + 4, y + 5)
        .text(m.usuario.substring(0, 15), cols.usuario + 4, y + 5)
        .text(m.nota ? m.nota.substring(0, 15) : '—', cols.nota + 4, y + 5);
      doc.fillColor(colorTipo).text(m.tipo, cols.tipo + 4, y + 5);
      y += 18;
    });

    piePagina(doc);
    doc.end();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── REPORTE ALERTAS ──
const alertas = async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT p.nombre, p.sku, c.nombre as categoria, p.stock, p.stock_minimo
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.stock < p.stock_minimo
      ORDER BY p.stock ASC
    `);
    const prods = resultado.rows;

    const doc = new PDFDocument({ margin: 40, bufferPages: true });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="alertas-stock.pdf"');
    doc.pipe(res);

    let y = encabezado(doc, 'Reporte de Alertas de Stock', `${prods.length} productos requieren atención`);

    const cols = { nombre: 40, sku: 200, categoria: 290, stock: 390, minimo: 450, diferencia: 510 };
    doc.rect(40, y, 532, 20).fill(AZUL);
    doc.fontSize(8).font('Helvetica-Bold').fillColor('white')
      .text('PRODUCTO', cols.nombre + 4, y + 6)
      .text('SKU', cols.sku + 4, y + 6)
      .text('CATEGORÍA', cols.categoria + 4, y + 6)
      .text('STOCK', cols.stock + 4, y + 6)
      .text('MÍNIMO', cols.minimo + 4, y + 6)
      .text('DIFERENCIA', cols.diferencia + 4, y + 6);
    y += 20;

    prods.forEach((p, i) => {
      if (y > 720) { doc.addPage(); y = 40; }
      const bg = i % 2 === 0 ? '#fef2f2' : 'white';
      doc.rect(40, y, 532, 18).fill(bg);
      const diff = p.stock - p.stock_minimo;
      doc.fontSize(8).font('Helvetica').fillColor(NEGRO)
        .text(p.nombre.substring(0, 22), cols.nombre + 4, y + 5)
        .text(p.sku || '—', cols.sku + 4, y + 5)
        .text(p.categoria || '—', cols.categoria + 4, y + 5)
        .text(String(p.stock), cols.stock + 4, y + 5)
        .text(String(p.stock_minimo), cols.minimo + 4, y + 5);
      doc.fillColor('#ef4444').text(String(diff), cols.diferencia + 4, y + 5);
      y += 18;
    });

    piePagina(doc);
    doc.end();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { inventario, movimientos, alertas };