// ============================================================
// DATOS DE MUESTRA — sin backend por ahora
// Reemplazar por fetch('/api/...') cuando el backend esté listo
// ============================================================
const DEMO = {
  productos: [
    { id:1, nombre:'Martillo Stanley 16oz', sku:'MART-001', categoria_nombre:'Herramientas', precio:8990,  precio_venta:8990,  precio_compra:5000, stock:45, stock_minimo:10 },
    { id:2, nombre:'Tornillos 1/2" (caja)', sku:'TORN-002', categoria_nombre:'Ferretería',   precio:2490,  precio_venta:2490,  precio_compra:1200, stock:8,  stock_minimo:20 },
    { id:3, nombre:'Lija grano 120',        sku:'LIJA-003', categoria_nombre:'Abrasivos',    precio:390,   precio_venta:390,   precio_compra:200,  stock:29, stock_minimo:15 },
    { id:4, nombre:'Pintura latex 1L',      sku:'PINT-004', categoria_nombre:'Pinturas',     precio:4200,  precio_venta:4200,  precio_compra:2800, stock:2,  stock_minimo:10 },
    { id:5, nombre:'Destornillador plano',  sku:'DEST-005', categoria_nombre:'Herramientas', precio:3500,  precio_venta:3500,  precio_compra:1800, stock:15, stock_minimo:5  },
    { id:6, nombre:'Cinta métrica 5m',      sku:'CINT-006', categoria_nombre:'Medición',     precio:6990,  precio_venta:6990,  precio_compra:3500, stock:0,  stock_minimo:8  },
  ],
  movimientos: [
    { id:1, creado_en:'2026-06-01T10:30:00', producto_nombre:'Martillo Stanley 16oz', sku:'MART-001', tipo:'entrada',  cantidad:20, stock_anterior:25, stock_nuevo:45, usuario_nombre:'Francisco S.', nota:'Compra proveedor' },
    { id:2, creado_en:'2026-06-01T11:15:00', producto_nombre:'Tornillos 1/2"',        sku:'TORN-002', tipo:'salida',   cantidad:12, stock_anterior:20, stock_nuevo:8,  usuario_nombre:'Francisco S.', nota:'Venta cliente' },
    { id:3, creado_en:'2026-06-02T09:00:00', producto_nombre:'Lija grano 120',        sku:'LIJA-003', tipo:'entrada',  cantidad:30, stock_anterior:0,  stock_nuevo:29, usuario_nombre:'Francisco S.', nota:'Reposición' },
    { id:4, creado_en:'2026-06-02T14:20:00', producto_nombre:'Pintura latex 1L',      sku:'PINT-004', tipo:'salida',   cantidad:8,  stock_anterior:10, stock_nuevo:2,  usuario_nombre:'Francisco S.', nota:'Venta' },
    { id:5, creado_en:'2026-06-03T08:45:00', producto_nombre:'Cinta métrica 5m',      sku:'CINT-006', tipo:'salida',   cantidad:3,  stock_anterior:3,  stock_nuevo:0,  usuario_nombre:'Francisco S.', nota:'Venta' },
  ],
  categorias: [
    { id:1, nombre:'Herramientas', descripcion:'Herramientas manuales y eléctricas', total_productos:2, activa:true },
    { id:2, nombre:'Ferretería',   descripcion:'Tornillos, tuercas y accesorios',    total_productos:1, activa:true },
    { id:3, nombre:'Abrasivos',    descripcion:'Lijas y discos de corte',            total_productos:1, activa:true },
    { id:4, nombre:'Pinturas',     descripcion:'Pinturas y diluyentes',              total_productos:1, activa:true },
    { id:5, nombre:'Medición',     descripcion:'Instrumentos de medición',           total_productos:1, activa:true },
  ],
  proveedores: [
    { id:1, nombre:'Distribuidora Central', contacto:'Carlos Rojas',  telefono:'+56 9 8765 4321', email:'ventas@distcentral.cl', activo:true },
    { id:2, nombre:'Ferretería del Norte',  contacto:'Ana Muñoz',     telefono:'+56 9 7654 3210', email:'pedidos@ferdelnorte.cl', activo:true },
    { id:3, nombre:'Pinturas Arcoíris',     contacto:'Luis Vega',     telefono:'+56 9 6543 2109', email:'luis@arcoiris.cl',       activo:false },
  ],
  usuarios: [
    { id:1, nombre:'Francisco Silva', email:'fsilva@appnova.cl',  rol:'Administrador', ultimo_acceso:'2026-06-03T08:45:00', activo:true },
    { id:2, nombre:'María González',  email:'mgonzalez@demo.cl',  rol:'Supervisor',    ultimo_acceso:'2026-06-02T17:30:00', activo:true },
    { id:3, nombre:'Pedro Ramírez',   email:'pramirez@demo.cl',   rol:'Vendedor',      ultimo_acceso:'2026-06-01T12:00:00', activo:true },
  ]
};

// ============================================================
// FECHA ACTUAL
// ============================================================
function mostrarFecha() {
  const ahora = new Date();
  const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('currentDate').textContent = ahora.toLocaleDateString('es-CL', opciones);
}
mostrarFecha();

// ============================================================
// CONFIGURACIÓN DE SECCIONES
// ============================================================
const secciones = {
  dashboard:   { titulo: 'Dashboard',         subtitulo: 'Resumen general del inventario',         btnAccion: '+ Agregar producto' },
  productos:   { titulo: 'Productos',          subtitulo: 'Gestión de productos e inventario',      btnAccion: '+ Agregar producto' },
  movimientos: { titulo: 'Movimientos',        subtitulo: 'Entradas y salidas de inventario',       btnAccion: '+ Registrar movimiento' },
  alertas:     { titulo: 'Alertas de stock',   subtitulo: 'Productos bajo el stock mínimo',         btnAccion: null },
  categorias:  { titulo: 'Categorías',         subtitulo: 'Gestión de categorías de productos',     btnAccion: '+ Agregar categoría' },
  proveedores: { titulo: 'Proveedores',        subtitulo: 'Gestión de proveedores',                 btnAccion: '+ Agregar proveedor' },
  reportes:    { titulo: 'Reportes',           subtitulo: 'Informes y estadísticas del inventario', btnAccion: null },
  usuarios:    { titulo: 'Usuarios',           subtitulo: 'Gestión de usuarios y permisos',         btnAccion: '+ Agregar usuario' }
};

const pageTitle    = document.getElementById('pageTitle');
const pageSubtitle = document.getElementById('pageSubtitle');
const btnAccion    = document.getElementById('btnAccion');
const mainBody     = document.getElementById('mainBody');

// ============================================================
// EVENTO BOTÓN DE ACCIÓN
// ============================================================
btnAccion.addEventListener('click', () => {
  const seccionActual = document.querySelector('.sidebar-item.active').getAttribute('data-section');
  if (seccionActual === 'productos')   abrirModalProducto();
  if (seccionActual === 'categorias')  abrirModalCategoria();
  if (seccionActual === 'proveedores') abrirModalProveedor();
  if (seccionActual === 'movimientos') abrirModalMovimiento();
  if (seccionActual === 'usuarios')    abrirModalUsuario();
});

// ============================================================
// CAMBIAR SECCIÓN
// ============================================================
function cambiarSeccion(seccion) {
  const config = secciones[seccion];
  if (!config) return;

  pageTitle.textContent    = config.titulo;
  pageSubtitle.textContent = config.subtitulo;

  if (config.btnAccion) {
    btnAccion.style.display = 'block';
    btnAccion.textContent   = config.btnAccion;
  } else {
    btnAccion.style.display = 'none';
  }

  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  document.querySelector(`[data-section="${seccion}"]`).classList.add('active');

  const contenidos = {
    dashboard: `
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-card-icon blue">📦</div><div class="stat-card-info"><div class="stat-card-num" id="stat-total">—</div><div class="stat-card-label">Productos registrados</div></div></div>
        <div class="stat-card"><div class="stat-card-icon green">✅</div><div class="stat-card-info"><div class="stat-card-num" id="stat-ok">—</div><div class="stat-card-label">Productos con stock ok</div></div></div>
        <div class="stat-card"><div class="stat-card-icon red">🚨</div><div class="stat-card-info"><div class="stat-card-num" id="stat-alertas">—</div><div class="stat-card-label">Alertas de stock bajo</div></div></div>
        <div class="stat-card"><div class="stat-card-icon amber">🔄</div><div class="stat-card-info"><div class="stat-card-num" id="stat-mov">—</div><div class="stat-card-label">Movimientos totales</div></div></div>
      </div>
      <div class="section-card">
        <div class="section-card-header"><div class="section-card-title">Últimos movimientos</div></div>
        <table class="data-table"><thead><tr><th>Fecha</th><th>Producto</th><th>Tipo</th><th>Cantidad</th><th>Usuario</th></tr></thead><tbody id="tbody-movimientos"></tbody></table>
      </div>`,

    productos: `
      <div class="module-toolbar">
        <div class="toolbar-search"><span class="toolbar-search-icon">🔍</span><input type="text" class="toolbar-search-input" id="buscar-producto" placeholder="Buscar producto..."></div>
        <div class="toolbar-filters">
          <select class="toolbar-select" id="filtro-categoria"><option value="">Todas las categorías</option></select>
          <select class="toolbar-select" id="filtro-estado"><option value="">Todos los estados</option><option value="ok">Stock ok</option><option value="bajo">Stock bajo</option></select>
        </div>
      </div>
      <div class="section-card">
        <div class="section-card-header"><div class="section-card-title">Lista de productos</div><span class="badge blue" id="badge-productos">— productos</span></div>
        <table class="data-table"><thead><tr><th>Imagen</th><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Stock mín.</th><th>Estado</th><th>Acciones</th></tr></thead><tbody id="tbody-productos"></tbody></table>
      </div>`,

    movimientos: `
      <div class="module-toolbar">
        <div class="toolbar-search"><span class="toolbar-search-icon">🔍</span><input type="text" class="toolbar-search-input" placeholder="Buscar producto o usuario..."></div>
        <div class="toolbar-filters">
          <select class="toolbar-select"><option value="">Todos los tipos</option><option>Entrada</option><option>Salida</option></select>
        </div>
      </div>
      <div class="section-card">
        <div class="section-card-header"><div class="section-card-title">Historial de movimientos</div><span class="badge blue" id="badge-movimientos">— movimientos</span></div>
        <table class="data-table"><thead><tr><th>Fecha</th><th>Producto</th><th>Tipo</th><th>Cantidad</th><th>Stock anterior</th><th>Stock nuevo</th><th>Usuario</th><th>Nota</th></tr></thead><tbody id="tbody-movimientos-lista"></tbody></table>
      </div>`,

    alertas: `
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-card-icon red">🚨</div><div class="stat-card-info"><div class="stat-card-num" id="stat-critico">—</div><div class="stat-card-label">Stock crítico</div></div></div>
        <div class="stat-card"><div class="stat-card-icon amber">⚠️</div><div class="stat-card-info"><div class="stat-card-num" id="stat-bajo">—</div><div class="stat-card-label">Stock bajo</div></div></div>
        <div class="stat-card"><div class="stat-card-icon green">✅</div><div class="stat-card-info"><div class="stat-card-num" id="stat-ok2">—</div><div class="stat-card-label">Productos ok</div></div></div>
        <div class="stat-card"><div class="stat-card-icon blue">📦</div><div class="stat-card-info"><div class="stat-card-num" id="stat-total2">—</div><div class="stat-card-label">Total productos</div></div></div>
      </div>
      <div class="section-card">
        <div class="section-card-header"><div class="section-card-title">🚨 Productos que requieren atención</div></div>
        <table class="data-table"><thead><tr><th>Producto</th><th>Categoría</th><th>Stock actual</th><th>Stock mínimo</th><th>Diferencia</th><th>Estado</th></tr></thead><tbody id="tbody-alertas"></tbody></table>
      </div>`,

    categorias: `
      <div class="module-toolbar">
        <div class="toolbar-search"><span class="toolbar-search-icon">🔍</span><input type="text" class="toolbar-search-input" placeholder="Buscar categoría..."></div>
      </div>
      <div class="section-card">
        <div class="section-card-header"><div class="section-card-title">Lista de categorías</div><span class="badge blue" id="badge-categorias">— categorías</span></div>
        <table class="data-table"><thead><tr><th>Categoría</th><th>Descripción</th><th>Productos</th><th>Estado</th><th>Acciones</th></tr></thead><tbody id="tbody-categorias"></tbody></table>
      </div>`,

    proveedores: `
      <div class="module-toolbar">
        <div class="toolbar-search"><span class="toolbar-search-icon">🔍</span><input type="text" class="toolbar-search-input" placeholder="Buscar proveedor..."></div>
      </div>
      <div class="section-card">
        <div class="section-card-header"><div class="section-card-title">Lista de proveedores</div><span class="badge blue" id="badge-proveedores">— proveedores</span></div>
        <table class="data-table"><thead><tr><th>Proveedor</th><th>Contacto</th><th>Teléfono</th><th>Email</th><th>Estado</th><th>Acciones</th></tr></thead><tbody id="tbody-proveedores"></tbody></table>
      </div>`,

    reportes: `
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-card-icon blue">📥</div><div class="stat-card-info"><div class="stat-card-num">3</div><div class="stat-card-label">Entradas este mes</div></div></div>
        <div class="stat-card"><div class="stat-card-icon red">📤</div><div class="stat-card-info"><div class="stat-card-num">2</div><div class="stat-card-label">Salidas este mes</div></div></div>
        <div class="stat-card"><div class="stat-card-icon green">💰</div><div class="stat-card-info"><div class="stat-card-num">$342K</div><div class="stat-card-label">Valor en inventario</div></div></div>
        <div class="stat-card"><div class="stat-card-icon amber">📊</div><div class="stat-card-info"><div class="stat-card-num">5</div><div class="stat-card-label">Movimientos totales</div></div></div>
      </div>
      <div class="section-card">
        <div class="section-card-header"><div class="section-card-title">Generar reportes</div></div>
        <div class="reports-grid">
          <div class="report-item"><div class="report-item-icon">📦</div><div class="report-item-info"><div class="report-item-title">Inventario completo</div><div class="report-item-desc">Lista de todos los productos con stock actual y valorización</div></div><button class="btn-report">⬇ Exportar PDF</button></div>
          <div class="report-item"><div class="report-item-icon">🔄</div><div class="report-item-info"><div class="report-item-title">Movimientos del mes</div><div class="report-item-desc">Historial completo de entradas y salidas del período</div></div><button class="btn-report">⬇ Exportar PDF</button></div>
          <div class="report-item"><div class="report-item-icon">🚨</div><div class="report-item-info"><div class="report-item-title">Alertas de stock</div><div class="report-item-desc">Productos bajo el stock mínimo que requieren reposición</div></div><button class="btn-report">⬇ Exportar PDF</button></div>
          <div class="report-item"><div class="report-item-icon">🏭</div><div class="report-item-info"><div class="report-item-title">Compras por proveedor</div><div class="report-item-desc">Resumen de entradas agrupadas por proveedor</div></div><button class="btn-report">⬇ Exportar PDF</button></div>
        </div>
      </div>`,

    usuarios: `
      <div class="module-toolbar">
        <div class="toolbar-search"><span class="toolbar-search-icon">🔍</span><input type="text" class="toolbar-search-input" placeholder="Buscar usuario..."></div>
        <div class="toolbar-filters"><select class="toolbar-select"><option value="">Todos los roles</option><option>Administrador</option><option>Supervisor</option><option>Vendedor</option></select></div>
      </div>
      <div class="section-card">
        <div class="section-card-header"><div class="section-card-title">Gestión de usuarios</div><span class="badge blue" id="badge-usuarios">— usuarios</span></div>
        <table class="data-table"><thead><tr><th>Usuario</th><th>Email</th><th>Rol</th><th>Último acceso</th><th>Estado</th><th>Acciones</th></tr></thead><tbody id="tbody-usuarios"></tbody></table>
      </div>`
  };

  mainBody.innerHTML = contenidos[seccion] || '';

  if (seccion === 'dashboard')   cargarDashboard();
  if (seccion === 'productos')   cargarProductos();
  if (seccion === 'movimientos') cargarMovimientos();
  if (seccion === 'alertas')     cargarAlertas();
  if (seccion === 'categorias')  cargarCategorias();
  if (seccion === 'proveedores') cargarProveedores();
  if (seccion === 'usuarios')    cargarUsuarios();
}

// ============================================================
// DASHBOARD
// ============================================================
function cargarDashboard() {
  const productos   = DEMO.productos;
  const movimientos = DEMO.movimientos;

  document.getElementById('stat-total').textContent   = productos.length;
  document.getElementById('stat-ok').textContent      = productos.filter(p => p.stock >= p.stock_minimo).length;
  document.getElementById('stat-alertas').textContent = productos.filter(p => p.stock < p.stock_minimo).length;
  document.getElementById('stat-mov').textContent     = movimientos.length;

  const badge = document.getElementById('alertaBadge');
  if (badge) badge.textContent = productos.filter(p => p.stock < p.stock_minimo).length;

  const filas = movimientos.slice(0, 5).map(m => `
    <tr>
      <td>${new Date(m.creado_en).toLocaleString('es-CL')}</td>
      <td><div class="product-name">${m.producto_nombre}</div></td>
      <td><span class="badge ${m.tipo === 'entrada' ? 'green' : 'red'}">${m.tipo}</span></td>
      <td>${m.cantidad}</td>
      <td>${m.usuario_nombre}</td>
    </tr>
  `).join('');

  document.getElementById('tbody-movimientos').innerHTML = filas || '<tr><td colspan="5" style="text-align:center;padding:1rem;color:var(--muted)">No hay movimientos aún</td></tr>';
}

// ============================================================
// PRODUCTOS
// ============================================================
function cargarProductos() {
  const productos = DEMO.productos;
  document.getElementById('badge-productos').textContent = `${productos.length} productos`;

  const filas = productos.map(p => `
    <tr>
      <td><div class="product-img-placeholder">📦</div></td>
      <td><div class="product-name">${p.nombre}</div><div class="product-sku">SKU: ${p.sku}</div></td>
      <td>${p.categoria_nombre}</td>
      <td>$${Number(p.precio_venta).toLocaleString('es-CL')}</td>
      <td>${p.stock}</td>
      <td>${p.stock_minimo}</td>
      <td><span class="badge ${p.stock < p.stock_minimo ? 'red' : 'green'}">${p.stock < p.stock_minimo ? 'Bajo' : 'Ok'}</span></td>
      <td>
        <div class="action-btns">
          <button class="btn-action blue" title="Ver">👁</button>
          <button class="btn-action amber" title="Editar">✏️</button>
          <button class="btn-action red" title="Eliminar">🗑</button>
        </div>
      </td>
    </tr>
  `).join('');

  document.getElementById('tbody-productos').innerHTML = filas || '<tr><td colspan="8" style="text-align:center;padding:1rem;color:var(--muted)">No hay productos</td></tr>';
}

// ============================================================
// MOVIMIENTOS
// ============================================================
function cargarMovimientos() {
  const movimientos = DEMO.movimientos;
  document.getElementById('badge-movimientos').textContent = `${movimientos.length} movimientos`;

  const filas = movimientos.map(m => `
    <tr>
      <td>${new Date(m.creado_en).toLocaleString('es-CL')}</td>
      <td><div class="product-name">${m.producto_nombre}</div><div class="product-sku">SKU: ${m.sku}</div></td>
      <td><span class="badge ${m.tipo === 'entrada' ? 'green' : 'red'}">${m.tipo}</span></td>
      <td>${m.cantidad}</td>
      <td>${m.stock_anterior}</td>
      <td>${m.stock_nuevo}</td>
      <td>${m.usuario_nombre}</td>
      <td>${m.nota || '—'}</td>
    </tr>
  `).join('');

  document.getElementById('tbody-movimientos-lista').innerHTML = filas || '<tr><td colspan="8" style="text-align:center;padding:1rem;color:var(--muted)">No hay movimientos</td></tr>';
}

function abrirModalMovimiento() {
  const opciones = DEMO.productos.map(p => `<option value="${p.id}">${p.nombre} (Stock: ${p.stock})</option>`).join('');
  const modal = crearModal('modalMovimiento', `
    <div class="modal-logo"><div class="modal-logo-icon">🔄</div><div><div class="modal-logo-text">Registrar movimiento</div><div class="modal-logo-sub">Demo — sin backend</div></div><button class="modal-close" id="btnCerrarModal">✕</button></div>
    <div class="form-group"><label class="form-label">Producto</label><select class="form-input"><option value="">Selecciona un producto</option>${opciones}</select></div>
    <div class="form-group"><label class="form-label">Tipo</label><select class="form-input"><option value="entrada">📥 Entrada</option><option value="salida">📤 Salida</option></select></div>
    <div class="form-group"><label class="form-label">Cantidad</label><input class="form-input" type="number" placeholder="Ej: 10" min="1"></div>
    <div class="form-group"><label class="form-label">Nota (opcional)</label><input class="form-input" type="text" placeholder="Ej: Compra proveedor"></div>
    <button class="btn-modal-submit" id="btnGuardar">Registrar movimiento →</button>
  `);
  document.getElementById('btnGuardar').addEventListener('click', () => modal.remove());
  document.getElementById('btnCerrarModal').addEventListener('click', () => modal.remove());
}

// ============================================================
// ALERTAS
// ============================================================
function cargarAlertas() {
  const productos = DEMO.productos;
  const alertas   = productos.filter(p => p.stock < p.stock_minimo);

  const badge = document.getElementById('alertaBadge');
  if (badge) badge.textContent = alertas.length;

  document.getElementById('stat-critico').textContent = alertas.filter(p => p.stock === 0).length;
  document.getElementById('stat-bajo').textContent    = alertas.filter(p => p.stock > 0).length;
  document.getElementById('stat-ok2').textContent     = productos.filter(p => p.stock >= p.stock_minimo).length;
  document.getElementById('stat-total2').textContent  = productos.length;

  const filas = alertas.map(p => `
    <tr>
      <td><div class="product-name">${p.nombre}</div><div class="product-sku">SKU: ${p.sku}</div></td>
      <td>${p.categoria_nombre}</td>
      <td><strong style="color:${p.stock === 0 ? 'var(--red)' : 'var(--amber)'}">${p.stock}</strong></td>
      <td>${p.stock_minimo}</td>
      <td><span class="badge ${p.stock === 0 ? 'red' : 'amber'}">${p.stock - p.stock_minimo}</span></td>
      <td><span class="badge ${p.stock === 0 ? 'red' : 'amber'}">${p.stock === 0 ? 'Sin stock' : 'Bajo'}</span></td>
    </tr>
  `).join('');

  document.getElementById('tbody-alertas').innerHTML = filas || '<tr><td colspan="6" style="text-align:center;padding:1rem;color:var(--muted)">✅ Todos los productos tienen stock suficiente</td></tr>';
}

// ============================================================
// CATEGORÍAS
// ============================================================
function cargarCategorias() {
  const categorias = DEMO.categorias;
  document.getElementById('badge-categorias').textContent = `${categorias.length} categorías`;

  const filas = categorias.map(c => `
    <tr>
      <td><div class="product-name">${c.nombre}</div></td>
      <td>${c.descripcion || '—'}</td>
      <td>${c.total_productos}</td>
      <td><span class="badge ${c.activa ? 'green' : 'red'}">${c.activa ? 'Activa' : 'Inactiva'}</span></td>
      <td><div class="action-btns"><button class="btn-action amber" title="Editar">✏️</button><button class="btn-action red" title="Eliminar">🗑</button></div></td>
    </tr>
  `).join('');

  document.getElementById('tbody-categorias').innerHTML = filas || '<tr><td colspan="5" style="text-align:center;padding:1rem;color:var(--muted)">No hay categorías</td></tr>';
}

function abrirModalCategoria(id, nombre, desc) {
  const modal = crearModal('modalCategoria', `
    <div class="modal-logo"><div class="modal-logo-icon">🏷️</div><div><div class="modal-logo-text">${id ? 'Editar' : 'Agregar'} categoría</div></div><button class="modal-close" id="btnCerrarModal">✕</button></div>
    <div class="form-group"><label class="form-label">Nombre</label><input class="form-input" type="text" id="cat-nombre" value="${nombre || ''}" placeholder="Ej: Herramientas"></div>
    <div class="form-group"><label class="form-label">Descripción</label><input class="form-input" type="text" id="cat-desc" value="${desc || ''}" placeholder="Descripción opcional"></div>
    <button class="btn-modal-submit" id="btnGuardar">Guardar categoría →</button>
  `);
  document.getElementById('btnGuardar').addEventListener('click', () => modal.remove());
  document.getElementById('btnCerrarModal').addEventListener('click', () => modal.remove());
}

// ============================================================
// PROVEEDORES
// ============================================================
function cargarProveedores() {
  const proveedores = DEMO.proveedores;
  document.getElementById('badge-proveedores').textContent = `${proveedores.length} proveedores`;

  const filas = proveedores.map(p => `
    <tr>
      <td><div class="product-name">${p.nombre}</div></td>
      <td>${p.contacto}</td>
      <td>${p.telefono}</td>
      <td>${p.email}</td>
      <td><span class="badge ${p.activo ? 'green' : 'red'}">${p.activo ? 'Activo' : 'Inactivo'}</span></td>
      <td><div class="action-btns"><button class="btn-action amber" title="Editar">✏️</button><button class="btn-action red" title="Eliminar">🗑</button></div></td>
    </tr>
  `).join('');

  document.getElementById('tbody-proveedores').innerHTML = filas || '<tr><td colspan="6" style="text-align:center;padding:1rem;color:var(--muted)">No hay proveedores</td></tr>';
}

function abrirModalProveedor() {
  const modal = crearModal('modalProveedor', `
    <div class="modal-logo"><div class="modal-logo-icon">🏭</div><div><div class="modal-logo-text">Agregar proveedor</div></div><button class="modal-close" id="btnCerrarModal">✕</button></div>
    <div class="form-group"><label class="form-label">Nombre empresa</label><input class="form-input" type="text" placeholder="Ej: Distribuidora Central"></div>
    <div class="form-group"><label class="form-label">Contacto</label><input class="form-input" type="text" placeholder="Nombre del contacto"></div>
    <div class="form-group"><label class="form-label">Teléfono</label><input class="form-input" type="text" placeholder="+56 9 ..."></div>
    <div class="form-group"><label class="form-label">Email</label><input class="form-input" type="email" placeholder="contacto@empresa.cl"></div>
    <button class="btn-modal-submit" id="btnGuardar">Guardar proveedor →</button>
  `);
  document.getElementById('btnGuardar').addEventListener('click', () => modal.remove());
  document.getElementById('btnCerrarModal').addEventListener('click', () => modal.remove());
}

// ============================================================
// USUARIOS
// ============================================================
function cargarUsuarios() {
  const usuarios = DEMO.usuarios;
  document.getElementById('badge-usuarios').textContent = `${usuarios.length} usuarios`;

  const filas = usuarios.map(u => `
    <tr>
      <td>
        <div class="user-cell">
          <div class="user-avatar blue">${u.nombre.charAt(0)}</div>
          <div><div class="product-name">${u.nombre}</div></div>
        </div>
      </td>
      <td>${u.email}</td>
      <td><span class="badge blue">${u.rol}</span></td>
      <td>${new Date(u.ultimo_acceso).toLocaleString('es-CL')}</td>
      <td><span class="badge ${u.activo ? 'green' : 'red'}">${u.activo ? 'Activo' : 'Inactivo'}</span></td>
      <td><div class="action-btns"><button class="btn-action amber" title="Editar">✏️</button><button class="btn-action red" title="Eliminar">🗑</button></div></td>
    </tr>
  `).join('');

  document.getElementById('tbody-usuarios').innerHTML = filas || '<tr><td colspan="6" style="text-align:center;padding:1rem;color:var(--muted)">No hay usuarios</td></tr>';
}

function abrirModalUsuario() {
  const modal = crearModal('modalUsuario', `
    <div class="modal-logo"><div class="modal-logo-icon">👥</div><div><div class="modal-logo-text">Agregar usuario</div></div><button class="modal-close" id="btnCerrarModal">✕</button></div>
    <div class="form-group"><label class="form-label">Nombre</label><input class="form-input" type="text" placeholder="Nombre completo"></div>
    <div class="form-group"><label class="form-label">Email</label><input class="form-input" type="email" placeholder="usuario@empresa.cl"></div>
    <div class="form-group"><label class="form-label">Rol</label><select class="form-input"><option>Vendedor</option><option>Supervisor</option><option>Administrador</option></select></div>
    <div class="form-group"><label class="form-label">Contraseña temporal</label><input class="form-input" type="password" placeholder="••••••••"></div>
    <button class="btn-modal-submit" id="btnGuardar">Crear usuario →</button>
  `);
  document.getElementById('btnGuardar').addEventListener('click', () => modal.remove());
  document.getElementById('btnCerrarModal').addEventListener('click', () => modal.remove());
}

// ============================================================
// PRODUCTOS — modal agregar
// ============================================================
function abrirModalProducto() {
  const opcionesCat  = DEMO.categorias.map(c  => `<option value="${c.id}">${c.nombre}</option>`).join('');
  const opcionesProv = DEMO.proveedores.map(p  => `<option value="${p.id}">${p.nombre}</option>`).join('');

  const modal = crearModal('modalProducto', `
    <div class="modal-logo"><div class="modal-logo-icon">📦</div><div><div class="modal-logo-text">Agregar producto</div><div class="modal-logo-sub">Demo — sin backend</div></div><button class="modal-close" id="btnCerrarModal">✕</button></div>
    <div class="form-group"><label class="form-label">Nombre</label><input class="form-input" type="text" placeholder="Ej: Martillo Stanley 16oz"></div>
    <div class="form-group"><label class="form-label">SKU</label><input class="form-input" type="text" placeholder="Ej: MART-001"></div>
    <div class="form-group"><label class="form-label">Categoría</label><select class="form-input"><option value="">Sin categoría</option>${opcionesCat}</select></div>
    <div class="form-group"><label class="form-label">Proveedor</label><select class="form-input"><option value="">Sin proveedor</option>${opcionesProv}</select></div>
    <div class="form-group"><label class="form-label">Precio venta</label><input class="form-input" type="number" placeholder="Ej: 8990"></div>
    <div class="form-group"><label class="form-label">Stock inicial</label><input class="form-input" type="number" placeholder="Ej: 10"></div>
    <div class="form-group"><label class="form-label">Stock mínimo</label><input class="form-input" type="number" placeholder="Ej: 5"></div>
    <button class="btn-modal-submit" id="btnGuardar">Guardar producto →</button>
  `);
  document.getElementById('btnGuardar').addEventListener('click', () => modal.remove());
  document.getElementById('btnCerrarModal').addEventListener('click', () => modal.remove());
}

// ============================================================
// HELPER — crear modal genérico
// ============================================================
function crearModal(id, contenido) {
  const existente = document.getElementById(id);
  if (existente) existente.remove();

  const modal = document.createElement('div');
  modal.id        = id;
  modal.className = 'modal-overlay open';
  modal.innerHTML = `<div class="modal">${contenido}</div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  return modal;
}

// ============================================================
// NAVEGACIÓN SIDEBAR
// ============================================================
document.querySelectorAll('.sidebar-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    cambiarSeccion(item.getAttribute('data-section'));
  });
});

// ============================================================
// CARGA INICIAL
// ============================================================
cambiarSeccion('dashboard');
