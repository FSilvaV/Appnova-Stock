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
  dashboard:   { titulo: 'Dashboard',         subtitulo: 'Resumen general del inventario',       btnAccion: '+ Agregar producto' },
  productos:   { titulo: 'Productos',          subtitulo: 'Gestión de productos e inventario',    btnAccion: '+ Agregar producto' },
  movimientos: { titulo: 'Movimientos',        subtitulo: 'Entradas y salidas de inventario',     btnAccion: '+ Registrar movimiento' },
  alertas:     { titulo: 'Alertas de stock',   subtitulo: 'Productos bajo el stock mínimo',       btnAccion: null },
  categorias:  { titulo: 'Categorías',         subtitulo: 'Gestión de categorías de productos',   btnAccion: '+ Agregar categoría' },
  proveedores: { titulo: 'Proveedores',        subtitulo: 'Gestión de proveedores',               btnAccion: '+ Agregar proveedor' },
  reportes:    { titulo: 'Reportes',           subtitulo: 'Informes y estadísticas del inventario', btnAccion: null },
  usuarios:    { titulo: 'Usuarios',           subtitulo: 'Gestión de usuarios y permisos',       btnAccion: '+ Agregar usuario' }
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
  if (seccionActual === 'reportes') window.open('/api/reportes/inventario', '_blank');
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
    btnAccion.style.display  = 'block';
    btnAccion.textContent    = config.btnAccion;
  } else {
    btnAccion.style.display  = 'none';
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
        <table class="data-table"><thead><tr><th>Fecha</th><th>Producto</th><th>Tipo</th><th>Cantidad</th><th>Usuario</th></tr></thead><tbody id="tbody-movimientos"><tr><td colspan="5" style="text-align:center;padding:1rem;color:var(--muted)">Cargando...</td></tr></tbody></table>
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
        <table class="data-table"><thead><tr><th>Imagen</th><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Stock mín.</th><th>Estado</th><th>Acciones</th></tr></thead><tbody id="tbody-productos"><tr><td colspan="8" style="text-align:center;padding:1rem;color:var(--muted)">Cargando...</td></tr></tbody></table>
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
        <table class="data-table"><thead><tr><th>Fecha</th><th>Producto</th><th>Tipo</th><th>Cantidad</th><th>Stock anterior</th><th>Stock nuevo</th><th>Usuario</th><th>Nota</th></tr></thead><tbody id="tbody-movimientos-lista"><tr><td colspan="8" style="text-align:center;padding:1rem;color:var(--muted)">Cargando...</td></tr></tbody></table>
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
        <table class="data-table"><thead><tr><th>Producto</th><th>Categoría</th><th>Stock actual</th><th>Stock mínimo</th><th>Diferencia</th><th>Estado</th><th>Acciones</th></tr></thead><tbody id="tbody-alertas"><tr><td colspan="7" style="text-align:center;padding:1rem;color:var(--muted)">Cargando...</td></tr></tbody></table>
      </div>`,

    categorias: `
      <div class="module-toolbar">
        <div class="toolbar-search"><span class="toolbar-search-icon">🔍</span><input type="text" class="toolbar-search-input" placeholder="Buscar categoría..."></div>
      </div>
      <div class="section-card">
        <div class="section-card-header"><div class="section-card-title">Lista de categorías</div><span class="badge blue" id="badge-categorias">— categorías</span></div>
        <table class="data-table"><thead><tr><th>Categoría</th><th>Descripción</th><th>Productos</th><th>Estado</th><th>Acciones</th></tr></thead><tbody id="tbody-categorias"><tr><td colspan="5" style="text-align:center;padding:1rem;color:var(--muted)">Cargando...</td></tr></tbody></table>
      </div>`,

    proveedores: `
      <div class="module-toolbar">
        <div class="toolbar-search"><span class="toolbar-search-icon">🔍</span><input type="text" class="toolbar-search-input" placeholder="Buscar proveedor..."></div>
      </div>
      <div class="section-card">
        <div class="section-card-header"><div class="section-card-title">Lista de proveedores</div><span class="badge blue" id="badge-proveedores">— proveedores</span></div>
        <table class="data-table"><thead><tr><th>Proveedor</th><th>Contacto</th><th>Teléfono</th><th>Email</th><th>Estado</th><th>Acciones</th></tr></thead><tbody id="tbody-proveedores"><tr><td colspan="6" style="text-align:center;padding:1rem;color:var(--muted)">Cargando...</td></tr></tbody></table>
      </div>`,

    reportes: `
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-card-icon blue">📥</div><div class="stat-card-info"><div class="stat-card-num" id="stat-entradas">—</div><div class="stat-card-label">Entradas este mes</div></div></div>
        <div class="stat-card"><div class="stat-card-icon red">📤</div><div class="stat-card-info"><div class="stat-card-num" id="stat-salidas">—</div><div class="stat-card-label">Salidas este mes</div></div></div>
        <div class="stat-card"><div class="stat-card-icon green">💰</div><div class="stat-card-info"><div class="stat-card-num" id="stat-valor">—</div><div class="stat-card-label">Valor en inventario</div></div></div>
        <div class="stat-card"><div class="stat-card-icon amber">📊</div><div class="stat-card-info"><div class="stat-card-num" id="stat-total-mov">—</div><div class="stat-card-label">Movimientos totales</div></div></div>
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
        <table class="data-table"><thead><tr><th>Usuario</th><th>Email</th><th>Rol</th><th>Último acceso</th><th>Estado</th><th>Acciones</th></tr></thead><tbody id="tbody-usuarios"><tr><td colspan="6" style="text-align:center;padding:1rem;color:var(--muted)">Cargando...</td></tr></tbody></table>
      </div>`
  };

  mainBody.innerHTML = contenidos[seccion] || '';

  if (seccion === 'dashboard')   cargarDashboard();
  if (seccion === 'productos')   cargarProductos();
  if (seccion === 'movimientos') cargarMovimientos();
  if (seccion === 'alertas')     cargarAlertas();
  if (seccion === 'categorias')  cargarCategorias();
  if (seccion === 'proveedores') cargarProveedores();
  if (seccion === 'reportes')    cargarReportes();
  if (seccion === 'usuarios')    cargarUsuarios();
}

// ============================================================
// DASHBOARD
// ============================================================
async function cargarDashboard() {
  try {
    const [prodRes, movRes] = await Promise.all([
      fetch('/api/productos'),
      fetch('/api/movimientos')
    ]);
    const productos    = await prodRes.json();
    const movimientos  = await movRes.json();

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
    `).join('') || '<tr><td colspan="5" style="text-align:center;padding:1rem;color:var(--muted)">No hay movimientos aún</td></tr>';

    document.getElementById('tbody-movimientos').innerHTML = filas;
  } catch (e) { console.error('Error dashboard:', e); }
}

// ============================================================
// PRODUCTOS
// ============================================================
async function cargarProductos() {
  try {
    const res      = await fetch('/api/productos');
    const productos = await res.json();

    document.getElementById('badge-productos').textContent = `${productos.length} productos`;

    const filas = productos.map(p => `
      <tr>
        <td><div class="product-img-placeholder">📦</div></td>
        <td><div class="product-name">${p.nombre}</div><div class="product-sku">SKU: ${p.sku || '—'}</div></td>
        <td>${p.categoria_nombre || '—'}</td>
        <td>$${Number(p.precio).toLocaleString('es-CL')}</td>
        <td>${p.stock}</td>
        <td>${p.stock_minimo}</td>
        <td><span class="badge ${p.stock < p.stock_minimo ? 'red' : 'green'}">${p.stock < p.stock_minimo ? 'Bajo' : 'Ok'}</span></td>
        <td>
          <div class="action-btns">
            <button class="btn-action blue btn-ver" title="Ver" data-id="${p.id}">👁</button>
            <button class="btn-action amber btn-editar" title="Editar" data-id="${p.id}">✏️</button>
            <button class="btn-action red btn-eliminar" title="Eliminar" data-id="${p.id}">🗑</button>
          </div>
        </td>
      </tr>
    `).join('') || '<tr><td colspan="8" style="text-align:center;padding:1rem;color:var(--muted)">No hay productos</td></tr>';

    document.getElementById('tbody-productos').innerHTML = filas;

    document.querySelectorAll('#tbody-productos .btn-eliminar').forEach(btn => {
      btn.addEventListener('click', () => eliminarProducto(btn.dataset.id));
    });
    document.querySelectorAll('#tbody-productos .btn-editar').forEach(btn => {
      btn.addEventListener('click', () => editarProducto(btn.dataset.id));
    });
  } catch (e) { console.error('Error productos:', e); }
}

async function eliminarProducto(id) {
  if (!confirm('¿Eliminar este producto?')) return;
  try {
    await fetch(`/api/productos/${id}`, { method: 'DELETE' });
    cargarProductos();
  } catch (e) { console.error('Error eliminando:', e); }
}

async function editarProducto(id) {
  try {
    const [prodRes, catRes, provRes] = await Promise.all([
      fetch(`/api/productos/${id}`),
      fetch('/api/categorias'),
      fetch('/api/proveedores')
    ]);
    const p          = await prodRes.json();
    const categorias = await catRes.json();
    const proveedores = await provRes.json();

    const opcionesCat  = categorias.map(c  => `<option value="${c.id}"  ${p.categoria_id  == c.id  ? 'selected' : ''}>${c.nombre}</option>`).join('');
    const opcionesProv = proveedores.map(pr => `<option value="${pr.id}" ${p.proveedor_id == pr.id ? 'selected' : ''}>${pr.nombre}</option>`).join('');

    const modal = crearModal('modalProducto', `
      <div class="modal-logo"><div class="modal-logo-icon">✏️</div><div><div class="modal-logo-text">Editar producto</div></div><button class="modal-close" id="btnCerrarModal">✕</button></div>
      <div class="form-group"><label class="form-label">Nombre</label><input class="form-input" type="text" id="prod-nombre" value="${p.nombre}"></div>
      <div class="form-group"><label class="form-label">SKU</label><input class="form-input" type="text" id="prod-sku" value="${p.sku || ''}"></div>
      <div class="form-group"><label class="form-label">Categoría</label><select class="form-input" id="prod-categoria"><option value="">Sin categoría</option>${opcionesCat}</select></div>
      <div class="form-group"><label class="form-label">Proveedor</label><select class="form-input" id="prod-proveedor"><option value="">Sin proveedor</option>${opcionesProv}</select></div>
      <div class="form-group"><label class="form-label">Precio</label><input class="form-input" type="number" id="prod-precio" value="${p.precio}"></div>
      <div class="form-group"><label class="form-label">Stock</label><input class="form-input" type="number" id="prod-stock" value="${p.stock}"></div>
      <div class="form-group"><label class="form-label">Stock mínimo</label><input class="form-input" type="number" id="prod-stock-min" value="${p.stock_minimo}"></div>
      <button class="btn-modal-submit" id="btnGuardar">Guardar cambios →</button>
      <div class="login-error" id="prod-error"></div>
    `);

    document.getElementById('btnGuardar').addEventListener('click', () => actualizarProducto(id));
    document.getElementById('btnCerrarModal').addEventListener('click', () => modal.remove());
  } catch (e) { console.error('Error editando:', e); }
}

async function actualizarProducto(id) {
  const nombre       = document.getElementById('prod-nombre').value.trim();
  const sku          = document.getElementById('prod-sku').value.trim();
  const categoria_id = document.getElementById('prod-categoria').value || null;
  const proveedor_id = document.getElementById('prod-proveedor').value || null;
  const precio       = document.getElementById('prod-precio').value;
  const stock        = document.getElementById('prod-stock').value;
  const stock_minimo = document.getElementById('prod-stock-min').value;
  const error        = document.getElementById('prod-error');

  if (!nombre || !precio || !stock) { error.style.display = 'block'; error.textContent = '⚠️ Nombre, precio y stock son requeridos.'; return; }

  try {
    const res = await fetch(`/api/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, sku, categoria_id, proveedor_id, precio, stock, stock_minimo })
    });
    if (res.ok) { document.getElementById('modalProducto').remove(); cargarProductos(); }
    else { const d = await res.json(); error.style.display = 'block'; error.textContent = '⚠️ ' + d.error; }
  } catch (e) { error.style.display = 'block'; error.textContent = '⚠️ Error conectando.'; }
}

async function abrirModalProducto() {
  try {
    const [catRes, provRes] = await Promise.all([fetch('/api/categorias'), fetch('/api/proveedores')]);
    const categorias  = await catRes.json();
    const proveedores = await provRes.json();

    const opcionesCat  = categorias.map(c  => `<option value="${c.id}">${c.nombre}</option>`).join('');
    const opcionesProv = proveedores.map(pr => `<option value="${pr.id}">${pr.nombre}</option>`).join('');

    const modal = crearModal('modalProducto', `
      <div class="modal-logo"><div class="modal-logo-icon">📦</div><div><div class="modal-logo-text">Agregar producto</div><div class="modal-logo-sub">Complete los datos</div></div><button class="modal-close" id="btnCerrarModal">✕</button></div>
      <div class="form-group"><label class="form-label">Nombre</label><input class="form-input" type="text" id="prod-nombre" placeholder="Ej: Martillo Stanley 16oz"></div>
      <div class="form-group"><label class="form-label">SKU</label><input class="form-input" type="text" id="prod-sku" placeholder="Ej: MART-001"></div>
      <div class="form-group"><label class="form-label">Categoría</label><select class="form-input" id="prod-categoria"><option value="">Sin categoría</option>${opcionesCat}</select></div>
      <div class="form-group"><label class="form-label">Proveedor</label><select class="form-input" id="prod-proveedor"><option value="">Sin proveedor</option>${opcionesProv}</select></div>
      <div class="form-group"><label class="form-label">Precio</label><input class="form-input" type="number" id="prod-precio" placeholder="Ej: 8990"></div>
      <div class="form-group"><label class="form-label">Stock inicial</label><input class="form-input" type="number" id="prod-stock" placeholder="Ej: 10"></div>
      <div class="form-group"><label class="form-label">Stock mínimo</label><input class="form-input" type="number" id="prod-stock-min" placeholder="Ej: 5"></div>
      <button class="btn-modal-submit" id="btnGuardar">Guardar producto →</button>
      <div class="login-error" id="prod-error"></div>
    `);

    document.getElementById('btnGuardar').addEventListener('click', guardarProducto);
    document.getElementById('btnCerrarModal').addEventListener('click', () => modal.remove());
  } catch (e) { console.error('Error abriendo modal:', e); }
}

async function guardarProducto() {
  const nombre       = document.getElementById('prod-nombre').value.trim();
  const sku          = document.getElementById('prod-sku').value.trim();
  const categoria_id = document.getElementById('prod-categoria').value || null;
  const proveedor_id = document.getElementById('prod-proveedor').value || null;
  const precio       = document.getElementById('prod-precio').value;
  const stock        = document.getElementById('prod-stock').value;
  const stock_minimo = document.getElementById('prod-stock-min').value;
  const error        = document.getElementById('prod-error');

  if (!nombre || !precio || !stock) { error.style.display = 'block'; error.textContent = '⚠️ Nombre, precio y stock son requeridos.'; return; }

  try {
    const res = await fetch('/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, sku, categoria_id, proveedor_id, precio, stock, stock_minimo })
    });
    if (res.ok) { document.getElementById('modalProducto').remove(); cargarProductos(); }
    else { const d = await res.json(); error.style.display = 'block'; error.textContent = '⚠️ ' + d.error; }
  } catch (e) { error.style.display = 'block'; error.textContent = '⚠️ Error conectando.'; }
}

// ============================================================
// MOVIMIENTOS
// ============================================================
async function cargarMovimientos() {
  try {
    const res         = await fetch('/api/movimientos');
    const movimientos = await res.json();

    document.getElementById('badge-movimientos').textContent = `${movimientos.length} movimientos`;

    const filas = movimientos.map(m => `
      <tr>
        <td>${new Date(m.creado_en).toLocaleString('es-CL')}</td>
        <td><div class="product-name">${m.producto_nombre}</div><div class="product-sku">SKU: ${m.sku || '—'}</div></td>
        <td><span class="badge ${m.tipo === 'entrada' ? 'green' : 'red'}">${m.tipo}</span></td>
        <td>${m.cantidad}</td>
        <td>${m.stock_anterior}</td>
        <td>${m.stock_nuevo}</td>
        <td>${m.usuario_nombre}</td>
        <td>${m.nota || '—'}</td>
      </tr>
    `).join('') || '<tr><td colspan="8" style="text-align:center;padding:1rem;color:var(--muted)">No hay movimientos aún</td></tr>';

    document.getElementById('tbody-movimientos-lista').innerHTML = filas;
  } catch (e) { console.error('Error movimientos:', e); }
}

async function abrirModalMovimiento() {
  try {
    const res      = await fetch('/api/productos');
    const productos = await res.json();
    const usuario  = JSON.parse(localStorage.getItem('usuario'));

    const opciones = productos.map(p => `<option value="${p.id}">${p.nombre} (Stock: ${p.stock})</option>`).join('');

    const modal = crearModal('modalMovimiento', `
      <div class="modal-logo"><div class="modal-logo-icon">🔄</div><div><div class="modal-logo-text">Registrar movimiento</div><div class="modal-logo-sub">Entrada o salida de stock</div></div><button class="modal-close" id="btnCerrarModal">✕</button></div>
      <div class="form-group"><label class="form-label">Producto</label><select class="form-input" id="mov-producto"><option value="">Selecciona un producto</option>${opciones}</select></div>
      <div class="form-group"><label class="form-label">Tipo</label><select class="form-input" id="mov-tipo"><option value="entrada">📥 Entrada</option><option value="salida">📤 Salida</option></select></div>
      <div class="form-group"><label class="form-label">Cantidad</label><input class="form-input" type="number" id="mov-cantidad" placeholder="Ej: 10" min="1"></div>
      <div class="form-group"><label class="form-label">Nota (opcional)</label><input class="form-input" type="text" id="mov-nota" placeholder="Ej: Compra proveedor"></div>
      <button class="btn-modal-submit" id="btnGuardar">Registrar movimiento →</button>
      <div class="login-error" id="mov-error"></div>
    `);

    document.getElementById('btnGuardar').addEventListener('click', () => guardarMovimiento(usuario.id));
    document.getElementById('btnCerrarModal').addEventListener('click', () => modal.remove());
  } catch (e) { console.error('Error modal movimiento:', e); }
}

async function guardarMovimiento(usuario_id) {
  const producto_id = document.getElementById('mov-producto').value;
  const tipo        = document.getElementById('mov-tipo').value;
  const cantidad    = document.getElementById('mov-cantidad').value;
  const nota        = document.getElementById('mov-nota').value.trim();
  const error       = document.getElementById('mov-error');

  if (!producto_id || !cantidad || cantidad < 1) { error.style.display = 'block'; error.textContent = '⚠️ Selecciona un producto e ingresa una cantidad válida.'; return; }

  try {
    const res = await fetch('/api/movimientos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ producto_id, usuario_id, tipo, cantidad, nota })
    });
    if (res.ok) { document.getElementById('modalMovimiento').remove(); cargarMovimientos(); }
    else { const d = await res.json(); error.style.display = 'block'; error.textContent = '⚠️ ' + d.error; }
  } catch (e) { error.style.display = 'block'; error.textContent = '⚠️ Error conectando.'; }
}

// ============================================================
// ALERTAS
// ============================================================
async function cargarAlertas() {
  try {
    const res      = await fetch('/api/productos');
    const productos = await res.json();
    const alertas  = productos.filter(p => p.stock < p.stock_minimo);

    const badge = document.getElementById('alertaBadge');
    if (badge) badge.textContent = alertas.length;

    document.getElementById('stat-critico').textContent = alertas.filter(p => p.stock === 0).length;
    document.getElementById('stat-bajo').textContent    = alertas.filter(p => p.stock > 0).length;
    document.getElementById('stat-ok2').textContent     = productos.filter(p => p.stock >= p.stock_minimo).length;
    document.getElementById('stat-total2').textContent  = productos.length;

    const filas = alertas.map(p => `
      <tr>
        <td><div class="product-name">${p.nombre}</div><div class="product-sku">SKU: ${p.sku || '—'}</div></td>
        <td>${p.categoria_nombre || '—'}</td>
        <td><strong style="color:${p.stock === 0 ? 'var(--red)' : 'var(--amber)'}">${p.stock}</strong></td>
        <td>${p.stock_minimo}</td>
        <td><span class="badge ${p.stock === 0 ? 'red' : 'amber'}">${p.stock - p.stock_minimo}</span></td>
        <td><span class="badge ${p.stock === 0 ? 'red' : 'amber'}">${p.stock === 0 ? 'Sin stock' : 'Bajo'}</span></td>
        <td><div class="action-btns"><button class="btn-action green btn-entrada-rapida" data-id="${p.id}">📥</button></div></td>
      </tr>
    `).join('') || '<tr><td colspan="7" style="text-align:center;padding:1rem;color:var(--muted)">✅ Todos los productos tienen stock suficiente</td></tr>';

    document.getElementById('tbody-alertas').innerHTML = filas;

    document.querySelectorAll('.btn-entrada-rapida').forEach(btn => {
      btn.addEventListener('click', () => abrirModalMovimiento());
    });
  } catch (e) { console.error('Error alertas:', e); }
}

// ============================================================
// CATEGORÍAS
// ============================================================
async function cargarCategorias() {
  try {
    const res        = await fetch('/api/categorias');
    const categorias = await res.json();

    document.getElementById('badge-categorias').textContent = `${categorias.length} categorías`;

    const filas = categorias.map(c => `
      <tr>
        <td><div class="product-name">${c.nombre}</div></td>
        <td>${c.descripcion || '—'}</td>
        <td>${c.total_productos}</td>
        <td><span class="badge ${c.activa ? 'green' : 'red'}">${c.activa ? 'Activa' : 'Inactiva'}</span></td>
        <td>
          <div class="action-btns">
            <button class="btn-action amber btn-editar-cat" data-id="${c.id}" data-nombre="${c.nombre}" data-desc="${c.descripcion || ''}">✏️</button>
            <button class="btn-action red btn-eliminar-cat" data-id="${c.id}">🗑</button>
          </div>
        </td>
      </tr>
    `).join('') || '<tr><td colspan="5" style="text-align:center;padding:1rem;color:var(--muted)">No hay categorías</td></tr>';

    document.getElementById('tbody-categorias').innerHTML = filas;

    document.querySelectorAll('.btn-eliminar-cat').forEach(btn => {
      btn.addEventListener('click', () => eliminarCategoria(btn.dataset.id));
    });
    document.querySelectorAll('.btn-editar-cat').forEach(btn => {
      btn.addEventListener('click', () => abrirModalCategoria(btn.dataset.id, btn.dataset.nombre, btn.dataset.desc));
    });
  } catch (e) { console.error('Error categorías:', e); }
}

async function eliminarCategoria(id) {
  if (!confirm('¿Eliminar esta categoría?')) return;
  try { await fetch(`/api/categorias/${id}`, { method: 'DELETE' }); cargarCategorias(); }
  catch (e) { console.error('Error:', e); }
}

function abrirModalCategoria(id = null, nombre = '', descripcion = '') {
  const esEditar = id !== null;
  const modal = crearModal('modalCategoria', `
    <div class="modal-logo"><div class="modal-logo-icon">🏷️</div><div><div class="modal-logo-text">${esEditar ? 'Editar' : 'Agregar'} categoría</div></div><button class="modal-close" id="btnCerrarModal">✕</button></div>
    <div class="form-group"><label class="form-label">Nombre</label><input class="form-input" type="text" id="cat-nombre" value="${nombre}" placeholder="Ej: Herramientas"></div>
    <div class="form-group"><label class="form-label">Descripción</label><input class="form-input" type="text" id="cat-desc" value="${descripcion}" placeholder="Descripción opcional"></div>
    <button class="btn-modal-submit" id="btnGuardar">${esEditar ? 'Guardar cambios →' : 'Agregar categoría →'}</button>
    <div class="login-error" id="cat-error"></div>
  `);
  document.getElementById('btnGuardar').addEventListener('click', () => guardarCategoria(id));
  document.getElementById('btnCerrarModal').addEventListener('click', () => modal.remove());
}

async function guardarCategoria(id) {
  const nombre      = document.getElementById('cat-nombre').value.trim();
  const descripcion = document.getElementById('cat-desc').value.trim();
  const error       = document.getElementById('cat-error');

  if (!nombre) { error.style.display = 'block'; error.textContent = '⚠️ El nombre es requerido.'; return; }

  try {
    const url    = id ? `/api/categorias/${id}` : '/api/categorias';
    const method = id ? 'PUT' : 'POST';
    const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre, descripcion }) });
    if (res.ok) { document.getElementById('modalCategoria').remove(); cargarCategorias(); }
  } catch (e) { error.style.display = 'block'; error.textContent = '⚠️ Error conectando.'; }
}

// ============================================================
// PROVEEDORES
// ============================================================
async function cargarProveedores() {
  try {
    const res         = await fetch('/api/proveedores');
    const proveedores = await res.json();

    document.getElementById('badge-proveedores').textContent = `${proveedores.length} proveedores`;

    const filas = proveedores.map(p => `
      <tr>
        <td><div class="product-name">${p.nombre}</div><div class="product-sku">RUT: ${p.rut || '—'}</div></td>
        <td>${p.contacto || '—'}</td>
        <td>${p.telefono || '—'}</td>
        <td>${p.email || '—'}</td>
        <td><span class="badge ${p.activo ? 'green' : 'red'}">${p.activo ? 'Activo' : 'Inactivo'}</span></td>
        <td>
          <div class="action-btns">
            <button class="btn-action amber btn-editar-prov" data-id="${p.id}" data-nombre="${p.nombre}" data-rut="${p.rut || ''}" data-contacto="${p.contacto || ''}" data-telefono="${p.telefono || ''}" data-email="${p.email || ''}">✏️</button>
            <button class="btn-action red btn-eliminar-prov" data-id="${p.id}">🗑</button>
          </div>
        </td>
      </tr>
    `).join('') || '<tr><td colspan="6" style="text-align:center;padding:1rem;color:var(--muted)">No hay proveedores</td></tr>';

    document.getElementById('tbody-proveedores').innerHTML = filas;

    document.querySelectorAll('.btn-eliminar-prov').forEach(btn => {
      btn.addEventListener('click', () => eliminarProveedor(btn.dataset.id));
    });
    document.querySelectorAll('.btn-editar-prov').forEach(btn => {
      btn.addEventListener('click', () => abrirModalProveedor(btn.dataset.id, btn.dataset.nombre, btn.dataset.rut, btn.dataset.contacto, btn.dataset.telefono, btn.dataset.email));
    });
  } catch (e) { console.error('Error proveedores:', e); }
}

async function eliminarProveedor(id) {
  if (!confirm('¿Eliminar este proveedor?')) return;
  try { await fetch(`/api/proveedores/${id}`, { method: 'DELETE' }); cargarProveedores(); }
  catch (e) { console.error('Error:', e); }
}

function abrirModalProveedor(id = null, nombre = '', rut = '', contacto = '', telefono = '', email = '') {
  const esEditar = id !== null;
  const modal = crearModal('modalProveedor', `
    <div class="modal-logo"><div class="modal-logo-icon">🏭</div><div><div class="modal-logo-text">${esEditar ? 'Editar' : 'Agregar'} proveedor</div></div><button class="modal-close" id="btnCerrarModal">✕</button></div>
    <div class="form-group"><label class="form-label">Nombre</label><input class="form-input" type="text" id="prov-nombre" value="${nombre}" placeholder="Ej: Ferretería Central"></div>
    <div class="form-group"><label class="form-label">RUT</label><input class="form-input" type="text" id="prov-rut" value="${rut}" placeholder="Ej: 76.123.456-7"></div>
    <div class="form-group"><label class="form-label">Contacto</label><input class="form-input" type="text" id="prov-contacto" value="${contacto}" placeholder="Nombre del contacto"></div>
    <div class="form-group"><label class="form-label">Teléfono</label><input class="form-input" type="text" id="prov-telefono" value="${telefono}" placeholder="+56 9 1234 5678"></div>
    <div class="form-group"><label class="form-label">Email</label><input class="form-input" type="email" id="prov-email" value="${email}" placeholder="contacto@empresa.cl"></div>
    <button class="btn-modal-submit" id="btnGuardar">${esEditar ? 'Guardar cambios →' : 'Agregar proveedor →'}</button>
    <div class="login-error" id="prov-error"></div>
  `);
  document.getElementById('btnGuardar').addEventListener('click', () => guardarProveedor(id));
  document.getElementById('btnCerrarModal').addEventListener('click', () => modal.remove());
}

async function guardarProveedor(id) {
  const nombre    = document.getElementById('prov-nombre').value.trim();
  const rut       = document.getElementById('prov-rut').value.trim();
  const contacto  = document.getElementById('prov-contacto').value.trim();
  const telefono  = document.getElementById('prov-telefono').value.trim();
  const email     = document.getElementById('prov-email').value.trim();
  const error     = document.getElementById('prov-error');

  if (!nombre) { error.style.display = 'block'; error.textContent = '⚠️ El nombre es requerido.'; return; }

  try {
    const url    = id ? `/api/proveedores/${id}` : '/api/proveedores';
    const method = id ? 'PUT' : 'POST';
    const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre, rut, contacto, telefono, email }) });
    if (res.ok) { document.getElementById('modalProveedor').remove(); cargarProveedores(); }
  } catch (e) { error.style.display = 'block'; error.textContent = '⚠️ Error conectando.'; }
}

// ============================================================
// REPORTES
// ============================================================
async function cargarReportes() {
  try {
    const [prodRes, movRes] = await Promise.all([fetch('/api/productos'), fetch('/api/movimientos')]);
    const productos    = await prodRes.json();
    const movimientos  = await movRes.json();

    const valorInventario = productos.reduce((acc, p) => acc + (Number(p.precio) * p.stock), 0);

    document.getElementById('stat-entradas').textContent   = movimientos.filter(m => m.tipo === 'entrada').length;
    document.getElementById('stat-salidas').textContent    = movimientos.filter(m => m.tipo === 'salida').length;
    document.getElementById('stat-valor').textContent      = `$${Math.round(valorInventario).toLocaleString('es-CL')}`;
    document.getElementById('stat-total-mov').textContent  = movimientos.length;

    // Conecta botones de exportar PDF
document.querySelectorAll('.btn-report').forEach((btn, i) => {
  const rutas = [
    '/api/reportes/inventario',
    '/api/reportes/movimientos',
    '/api/reportes/alertas',
    '/api/reportes/inventario'
  ];
  btn.addEventListener('click', () => {
    window.open(rutas[i], '_blank');
  });
});

  } catch (e) { console.error('Error reportes:', e); }
}

// ============================================================
// USUARIOS
// ============================================================
async function cargarUsuarios() {
  try {
    const res      = await fetch('/api/usuarios');
    const usuarios = await res.json();

    document.getElementById('badge-usuarios').textContent = `${usuarios.length} usuarios`;

    const filas = usuarios.map(u => `
      <tr>
        <td>
          <div class="user-cell">
            <div class="user-avatar blue">${u.nombre.charAt(0).toUpperCase()}</div>
            <div><div class="product-name">${u.nombre}</div><div class="product-sku">${u.email}</div></div>
          </div>
        </td>
        <td>${u.email}</td>
        <td><span class="badge ${u.rol === 'admin' ? 'blue' : u.rol === 'supervisor' ? 'green' : 'amber'}">${u.rol}</span></td>
        <td>${u.ultimo_acceso ? new Date(u.ultimo_acceso).toLocaleString('es-CL') : 'Nunca'}</td>
        <td><span class="badge ${u.activo ? 'green' : 'red'}">${u.activo ? 'Activo' : 'Inactivo'}</span></td>
        <td>
          <div class="action-btns">
            <button class="btn-action blue btn-permisos-usr" data-id="${u.id}" data-nombre="${u.nombre}">🔑</button>
            <button class="btn-action amber btn-editar-usr" data-id="${u.id}" data-nombre="${u.nombre}" data-email="${u.email}" data-rol="${u.rol}" data-activo="${u.activo}">✏️</button>
            <button class="btn-action red btn-eliminar-usr" data-id="${u.id}">🗑</button>
          </div>
        </td>
      </tr>
    `).join('') || '<tr><td colspan="6" style="text-align:center;padding:1rem;color:var(--muted)">No hay usuarios</td></tr>';

    document.getElementById('tbody-usuarios').innerHTML = filas;

    document.querySelectorAll('.btn-eliminar-usr').forEach(btn => {
      btn.addEventListener('click', () => eliminarUsuario(btn.dataset.id));
    });
    document.querySelectorAll('.btn-editar-usr').forEach(btn => {
      btn.addEventListener('click', () => abrirModalUsuario(btn.dataset.id, btn.dataset.nombre, btn.dataset.email, btn.dataset.rol, btn.dataset.activo === 'true'));
    });
    document.querySelectorAll('.btn-permisos-usr').forEach(btn => {
      btn.addEventListener('click', () => abrirModalPermisos(btn.dataset.id, btn.dataset.nombre));
    });
  } catch (e) { console.error('Error usuarios:', e); }
}

async function eliminarUsuario(id) {
  if (!confirm('¿Eliminar este usuario?')) return;
  try { await fetch(`/api/usuarios/${id}`, { method: 'DELETE' }); cargarUsuarios(); }
  catch (e) { console.error('Error:', e); }
}

function abrirModalUsuario(id = null, nombre = '', email = '', rol = 'vendedor', activo = true) {
  const esEditar = id !== null;
  const modal = crearModal('modalUsuario', `
    <div class="modal-logo"><div class="modal-logo-icon">👤</div><div><div class="modal-logo-text">${esEditar ? 'Editar' : 'Agregar'} usuario</div></div><button class="modal-close" id="btnCerrarModal">✕</button></div>
    <div class="form-group"><label class="form-label">Nombre completo</label><input class="form-input" type="text" id="usr-nombre" value="${nombre}" placeholder="Ej: Juan Pérez"></div>
    <div class="form-group"><label class="form-label">Email</label><input class="form-input" type="email" id="usr-email" value="${email}" placeholder="usuario@empresa.cl"></div>
    ${!esEditar ? '<div class="form-group"><label class="form-label">Contraseña</label><input class="form-input" type="password" id="usr-password" placeholder="••••••••"></div>' : ''}
    <div class="form-group"><label class="form-label">Rol</label><select class="form-input" id="usr-rol"><option value="vendedor" ${rol==='vendedor'?'selected':''}>Vendedor</option><option value="supervisor" ${rol==='supervisor'?'selected':''}>Supervisor</option><option value="admin" ${rol==='admin'?'selected':''}>Administrador</option></select></div>
    ${esEditar ? `<div class="form-group"><label class="form-label">Estado</label><select class="form-input" id="usr-activo"><option value="true" ${activo?'selected':''}>Activo</option><option value="false" ${!activo?'selected':''}>Inactivo</option></select></div>` : ''}
    <button class="btn-modal-submit" id="btnGuardar">${esEditar ? 'Guardar cambios →' : 'Agregar usuario →'}</button>
    <div class="login-error" id="usr-error"></div>
  `);
  document.getElementById('btnGuardar').addEventListener('click', () => guardarUsuario(id));
  document.getElementById('btnCerrarModal').addEventListener('click', () => modal.remove());
}

async function guardarUsuario(id) {
  const nombre  = document.getElementById('usr-nombre').value.trim();
  const email   = document.getElementById('usr-email').value.trim();
  const rol     = document.getElementById('usr-rol').value;
  const error   = document.getElementById('usr-error');
  const activoEl = document.getElementById('usr-activo');
  const activo  = activoEl ? activoEl.value === 'true' : true;

  if (!nombre || !email) { error.style.display = 'block'; error.textContent = '⚠️ Nombre y email son requeridos.'; return; }

  const body = { nombre, email, rol, activo };
  if (!id) {
    const password = document.getElementById('usr-password').value;
    if (!password) { error.style.display = 'block'; error.textContent = '⚠️ La contraseña es requerida.'; return; }
    body.password = password;
  }

  try {
    const url    = id ? `/api/usuarios/${id}` : '/api/usuarios';
    const method = id ? 'PUT' : 'POST';
    const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) { document.getElementById('modalUsuario').remove(); cargarUsuarios(); }
    else { const d = await res.json(); error.style.display = 'block'; error.textContent = '⚠️ ' + d.error; }
  } catch (e) { error.style.display = 'block'; error.textContent = '⚠️ Error conectando.'; }
}

// ============================================================
// PERMISOS
// ============================================================
async function abrirModalPermisos(id, nombre) {
  const modulos = [
    { key: 'productos',   label: '📦 Productos' },
    { key: 'movimientos', label: '🔄 Movimientos' },
    { key: 'alertas',     label: '🚨 Alertas de stock' },
    { key: 'categorias',  label: '🏷️ Categorías' },
    { key: 'proveedores', label: '🏭 Proveedores' },
    { key: 'reportes',    label: '📊 Reportes' },
    { key: 'usuarios',    label: '👥 Usuarios' },
  ];

  // Carga permisos actuales del usuario
  const res      = await fetch(`/api/permisos/${id}`);
  const permisos = await res.json();

  // Crea un mapa de permisos para fácil acceso
  const mapaPermisos = {};
  permisos.forEach(p => mapaPermisos[p.modulo] = p.activo);

  const modal = crearModal('modalPermisos', `
    <div class="modal-logo">
      <div class="modal-logo-icon">🔑</div>
      <div>
        <div class="modal-logo-text">Permisos de ${nombre}</div>
        <div class="modal-logo-sub">Activa o desactiva módulos</div>
      </div>
      <button class="modal-close" id="btnCerrarModal">✕</button>
    </div>

    <div class="permisos-list">
      ${modulos.map(m => `
        <div class="permiso-item">
          <span class="permiso-label">${m.label}</span>
          <label class="toggle">
            <input type="checkbox" data-modulo="${m.key}"
              ${mapaPermisos[m.key] === false ? '' : 'checked'}>
            <span class="toggle-slider"></span>
          </label>
        </div>
      `).join('')}
    </div>

    <div class="login-error" id="perm-error"></div>
    <button class="btn-modal-submit" id="btnGuardar">Guardar permisos →</button>
  `);

  document.getElementById('btnCerrarModal').addEventListener('click', () => modal.remove());

  document.getElementById('btnGuardar').addEventListener('click', async () => {
    const checkboxes = document.querySelectorAll('[data-modulo]');
    const permisosNuevos = Array.from(checkboxes).map(cb => ({
      modulo: cb.getAttribute('data-modulo'),
      activo: cb.checked
    }));

    try {
      const response = await fetch(`/api/permisos/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permisos: permisosNuevos })
      });

      if (response.ok) {
        modal.remove();
        // Si es el usuario actual aplica permisos inmediatamente
        const usuarioActual = JSON.parse(localStorage.getItem('usuario'));
        if (usuarioActual && usuarioActual.id == id) {
          aplicarPermisos(permisosNuevos);
        }
      } else {
        const error = document.getElementById('perm-error');
        error.style.display = 'block';
        error.textContent = '⚠️ Error guardando permisos.';
      }
    } catch (e) {
      console.error('Error:', e);
    }
  });
}


// ============================================================
// APLICAR PERMISOS — oculta módulos según permisos del usuario
// ============================================================
function aplicarPermisos(permisos) {
  permisos.forEach(p => {
    const item = document.querySelector(`[data-section="${p.modulo}"]`);
    if (item) {
      item.style.display = p.activo ? 'flex' : 'none';
    }
  });
}


// ============================================================
// CARGAR PERMISOS AL INICIAR — aplica permisos del usuario logueado
// ============================================================
async function cargarPermisosUsuario() {
  try {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) return;

    // Admin ve todo siempre
    if (usuario.rol === 'admin' || usuario.rol === 'superadmin') return;

    const res      = await fetch(`/api/permisos/${usuario.id}`);
    const permisos = await res.json();

    if (permisos.length > 0) {
      aplicarPermisos(permisos);
    }
  } catch (e) {
    console.error('Error cargando permisos:', e);
  }
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
cargarPermisosUsuario();
cambiarSeccion('dashboard');
