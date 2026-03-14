// ============================================================
// FECHA ACTUAL — muestra la fecha en el header
// Se actualiza automáticamente cada vez que se carga la página
// ============================================================

function mostrarFecha() {
  const ahora = new Date();
  const opciones = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const fecha = ahora.toLocaleDateString('es-CL', opciones);
  document.getElementById('currentDate').textContent = fecha;
}

mostrarFecha();


// ============================================================
// NAVEGACIÓN DEL SIDEBAR — cambia sección activa
// Al hacer clic en un item del sidebar:
// 1. Quita clase "active" de todos los items
// 2. Agrega clase "active" al item clickeado
// 3. Actualiza título y subtítulo del header
// 4. Cambia el contenido del main-body
// BD necesario: cada sección cargará sus datos reales desde aquí
// ============================================================

// Configuración de cada sección
const secciones = {
  dashboard: {
    titulo: 'Dashboard',
    subtitulo: 'Resumen general del inventario',
    btnAccion: '+ Agregar producto'
  },
  productos: {
    titulo: 'Productos',
    subtitulo: 'Gestión de productos e inventario',
    btnAccion: '+ Agregar producto'
  },
  movimientos: {
    titulo: 'Movimientos',
    subtitulo: 'Entradas y salidas de inventario',
    btnAccion: '+ Registrar movimiento'
  },
  alertas: {
    titulo: 'Alertas de stock',
    subtitulo: 'Productos bajo el stock mínimo',
    btnAccion: null // esta sección no tiene botón de acción
  },
  categorias: {
    titulo: 'Categorías',
    subtitulo: 'Gestión de categorías de productos',
    btnAccion: '+ Agregar categoría'
  },
  proveedores: {
    titulo: 'Proveedores',
    subtitulo: 'Gestión de proveedores',
    btnAccion: '+ Agregar proveedor'
  },
  reportes: {
    titulo: 'Reportes',
    subtitulo: 'Informes y estadísticas del inventario',
    btnAccion: '⬇ Exportar reporte'
  },
  usuarios: {
    titulo: 'Usuarios',
    subtitulo: 'Gestión de usuarios y permisos',
    btnAccion: '+ Agregar usuario'
  }
};

// Referencias a elementos del DOM
const pageTitle = document.getElementById('pageTitle');
const pageSubtitle = document.getElementById('pageSubtitle');
const btnAccion = document.getElementById('btnAccion');
btnAccion.addEventListener('click', () => {
  const seccionActual = document.querySelector('.sidebar-item.active').getAttribute('data-section');
  if (seccionActual === 'productos') abrirModalProducto();
  if (seccionActual === 'categorias') abrirModalCategoria();
  if (seccionActual === 'proveedores') abrirModalProveedor();
  if (seccionActual === 'movimientos') abrirModalMovimiento();
  if (seccionActual === 'usuarios') abrirModalUsuario();
});
const mainBody = document.getElementById('mainBody');

// ============================================================
// CARGAR ALERTAS DESDE LA API
// Muestra productos con stock menor al mínimo
// ============================================================

async function cargarAlertas() {
  try {
    const response = await fetch('http://localhost:3000/api/productos');
    const productos = await response.json();

    // Filtra solo los productos con stock bajo
    const alertas = productos.filter(p => p.stock < p.stock_minimo);

    // Actualiza tarjetas de resumen
    const tarjetas = document.querySelectorAll('.stat-card-num');
    if (tarjetas.length >= 3) {
      tarjetas[0].textContent = alertas.filter(p => p.stock === 0).length;
      tarjetas[1].textContent = alertas.filter(p => p.stock > 0).length;
      tarjetas[2].textContent = productos.filter(p => p.stock >= p.stock_minimo).length;
      tarjetas[3] && (tarjetas[3].textContent = productos.length);
    }

    // Actualiza badge del sidebar
    const badge = document.getElementById('alertaBadge');
    if (badge) badge.textContent = alertas.length;

    const filas = alertas.length > 0 ? alertas.map(p => `
      <tr>
        <td>
          <div class="product-name">${p.nombre}</div>
          <div class="product-sku">SKU: ${p.sku || '—'}</div>
        </td>
        <td>${p.categoria_id || '—'}</td>
        <td><strong style="color:${p.stock === 0 ? 'var(--red)' : 'var(--amber)'}">${p.stock}</strong></td>
        <td>${p.stock_minimo}</td>
        <td><span class="badge ${p.stock === 0 ? 'red' : 'amber'}">${p.stock === 0 ? 'Sin stock' : 'Bajo'}</span></td>
        <td>
          <div class="action-btns">
            <button class="btn-action green btn-entrada-rapida" title="Registrar entrada" data-id="${p.id}" data-nombre="${p.nombre}">📥</button>
            <button class="btn-action blue" title="Ver producto">👁</button>
          </div>
        </td>
      </tr>
    `).join('') : `
      <tr>
        <td colspan="6" style="text-align:center;padding:2rem;color:var(--muted)">
          ✅ Todos los productos tienen stock suficiente
        </td>
      </tr>
    `;

    document.querySelector('.data-table tbody').innerHTML = filas;

    // Botón entrada rápida desde alertas
    document.querySelectorAll('.btn-entrada-rapida').forEach(btn => {
      btn.addEventListener('click', () => {
        abrirModalMovimiento(btn.getAttribute('data-id'));
      });
    });

  } catch (error) {
    console.error('Error cargando alertas:', error);
  }
}

// ============================================================
// CARGAR MOVIMIENTOS DESDE LA API
// ============================================================

async function cargarMovimientos() {
  try {
    const response = await fetch('http://localhost:3000/api/movimientos');
    const movimientos = await response.json();

    const filas = movimientos.length > 0 ? movimientos.map(m => `
      <tr>
        <td>${new Date(m.creado_en).toLocaleString('es-CL')}</td>
        <td>
          <div class="product-name">${m.producto_nombre}</div>
          <div class="product-sku">SKU: ${m.sku || '—'}</div>
        </td>
        <td><span class="badge ${m.tipo === 'entrada' ? 'green' : 'red'}">${m.tipo}</span></td>
        <td>${m.cantidad}</td>
        <td>${m.stock_anterior}</td>
        <td>${m.stock_nuevo}</td>
        <td>${m.usuario_nombre}</td>
        <td>${m.nota || '—'}</td>
      </tr>
    `).join('') : `
      <tr>
        <td colspan="8" style="text-align:center;padding:2rem;color:var(--muted)">
          No hay movimientos registrados aún
        </td>
      </tr>
    `;

    document.querySelector('.data-table tbody').innerHTML = filas;
    document.querySelector('.section-card .badge.blue').textContent = `${movimientos.length} movimientos este mes`;

  } catch (error) {
    console.error('Error cargando movimientos:', error);
  }
}


// ============================================================
// MODAL REGISTRAR MOVIMIENTO
// ============================================================

async function abrirModalMovimiento() {
  // Carga productos para el selector
  const response = await fetch('http://localhost:3000/api/productos');
  const productos = await response.json();

  const opciones = productos.map(p => 
    `<option value="${p.id}">${p.nombre} (Stock: ${p.stock})</option>`
  ).join('');

  // Obtiene usuario logueado del localStorage
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const modal = document.createElement('div');
  modal.id = 'modalMovimiento';
  modal.className = 'modal-overlay open';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-logo">
        <div class="modal-logo-icon">🔄</div>
        <div>
          <div class="modal-logo-text">Registrar movimiento</div>
          <div class="modal-logo-sub">Entrada o salida de stock</div>
        </div>
        <button class="modal-close" onclick="cerrarModalMovimiento()">✕</button>
      </div>

      <div class="form-group">
        <label class="form-label">Producto</label>
        <select class="form-input" id="mov-producto">
          <option value="">Selecciona un producto</option>
          ${opciones}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Tipo</label>
        <select class="form-input" id="mov-tipo">
          <option value="entrada">📥 Entrada</option>
          <option value="salida">📤 Salida</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Cantidad</label>
        <input class="form-input" type="number" id="mov-cantidad" placeholder="Ej: 10" min="1">
      </div>

      <div class="form-group">
        <label class="form-label">Nota (opcional)</label>
        <input class="form-input" type="text" id="mov-nota" placeholder="Ej: Compra proveedor, Venta mostrador">
      </div>

      <button class="btn-modal-submit" onclick="guardarMovimiento(${usuario.id})">Registrar movimiento →</button>
      <div class="login-error" id="mov-error"></div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) cerrarModalMovimiento(); });
}

function cerrarModalMovimiento() {
  const modal = document.getElementById('modalMovimiento');
  if (modal) modal.remove();
}

async function guardarMovimiento(usuario_id) {
  const producto_id = document.getElementById('mov-producto').value;
  const tipo = document.getElementById('mov-tipo').value;
  const cantidad = document.getElementById('mov-cantidad').value;
  const nota = document.getElementById('mov-nota').value.trim();
  const error = document.getElementById('mov-error');

  if (!producto_id || !cantidad || cantidad < 1) {
    error.style.display = 'block';
    error.textContent = '⚠️ Selecciona un producto e ingresa una cantidad válida.';
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/movimientos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ producto_id, usuario_id, tipo, cantidad, nota })
    });

    if (response.ok) {
      cerrarModalMovimiento();
      cambiarSeccion('movimientos');
    } else {
      const data = await response.json();
      error.style.display = 'block';
      error.textContent = '⚠️ ' + data.error;
    }
  } catch (err) {
    error.style.display = 'block';
    error.textContent = '⚠️ Error conectando con el servidor.';
  }
}

// ============================================================
// CARGAR PROVEEDORES DESDE LA API
// ============================================================

async function cargarProveedores() {
  try {
    const response = await fetch('http://localhost:3000/api/proveedores');
    const proveedores = await response.json();

    const filas = proveedores.map(p => `
      <tr>
        <td>
          <div class="product-name">${p.nombre}</div>
          <div class="product-sku">RUT: ${p.rut || '—'}</div>
        </td>
        <td>${p.contacto || '—'}</td>
        <td>${p.telefono || '—'}</td>
        <td>${p.email || '—'}</td>
        <td><span class="badge ${p.activo ? 'green' : 'red'}">${p.activo ? 'Activo' : 'Inactivo'}</span></td>
        <td>
          <div class="action-btns">
            <button class="btn-action amber btn-editar-prov" title="Editar" 
              data-id="${p.id}" 
              data-nombre="${p.nombre}" 
              data-rut="${p.rut || ''}"
              data-contacto="${p.contacto || ''}"
              data-telefono="${p.telefono || ''}"
              data-email="${p.email || ''}">✏️</button>
            <button class="btn-action red btn-eliminar-prov" title="Eliminar" data-id="${p.id}">🗑</button>
          </div>
        </td>
      </tr>
    `).join('');

    document.querySelector('.data-table tbody').innerHTML = filas;
    document.querySelector('.section-card .badge.blue').textContent = `${proveedores.length} proveedores`;

    document.querySelectorAll('.btn-eliminar-prov').forEach(btn => {
      btn.addEventListener('click', () => eliminarProveedor(btn.getAttribute('data-id')));
    });

    document.querySelectorAll('.btn-editar-prov').forEach(btn => {
      btn.addEventListener('click', () => {
        abrirModalProveedor(
          btn.getAttribute('data-id'),
          btn.getAttribute('data-nombre'),
          btn.getAttribute('data-rut'),
          btn.getAttribute('data-contacto'),
          btn.getAttribute('data-telefono'),
          btn.getAttribute('data-email')
        );
      });
    });

  } catch (error) {
    console.error('Error cargando proveedores:', error);
  }
}

async function eliminarProveedor(id) {
  if (!confirm('¿Eliminar este proveedor?')) return;
  try {
    await fetch(`http://localhost:3000/api/proveedores/${id}`, { method: 'DELETE' });
    cambiarSeccion('proveedores');
  } catch (error) {
    console.error('Error eliminando proveedor:', error);
  }
}

function abrirModalProveedor(id = null, nombre = '', rut = '', contacto = '', telefono = '', email = '') {
  const esEditar = id !== null;
  const modal = document.createElement('div');
  modal.id = 'modalProveedor';
  modal.className = 'modal-overlay open';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-logo">
        <div class="modal-logo-icon">🏭</div>
        <div>
          <div class="modal-logo-text">${esEditar ? 'Editar' : 'Agregar'} proveedor</div>
        </div>
        <button class="modal-close" onclick="cerrarModalProveedor()">✕</button>
      </div>
      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input class="form-input" type="text" id="prov-nombre" value="${nombre}" placeholder="Ej: Ferretería Central">
      </div>
      <div class="form-group">
        <label class="form-label">RUT</label>
        <input class="form-input" type="text" id="prov-rut" value="${rut}" placeholder="Ej: 76.123.456-7">
      </div>
      <div class="form-group">
        <label class="form-label">Contacto</label>
        <input class="form-input" type="text" id="prov-contacto" value="${contacto}" placeholder="Nombre del contacto">
      </div>
      <div class="form-group">
        <label class="form-label">Teléfono</label>
        <input class="form-input" type="text" id="prov-telefono" value="${telefono}" placeholder="+56 9 1234 5678">
      </div>
      <div class="form-group">
        <label class="form-label">Email</label>
        <input class="form-input" type="email" id="prov-email" value="${email}" placeholder="contacto@empresa.cl">
      </div>
      <button class="btn-modal-submit" onclick="guardarProveedor(${id})">
        ${esEditar ? 'Guardar cambios →' : 'Agregar proveedor →'}
      </button>
      <div class="login-error" id="prov-error"></div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) cerrarModalProveedor(); });
}

function cerrarModalProveedor() {
  const modal = document.getElementById('modalProveedor');
  if (modal) modal.remove();
}

async function guardarProveedor(id) {
  const nombre = document.getElementById('prov-nombre').value.trim();
  const rut = document.getElementById('prov-rut').value.trim();
  const contacto = document.getElementById('prov-contacto').value.trim();
  const telefono = document.getElementById('prov-telefono').value.trim();
  const email = document.getElementById('prov-email').value.trim();
  const error = document.getElementById('prov-error');

  if (!nombre) {
    error.style.display = 'block';
    error.textContent = '⚠️ El nombre es requerido.';
    return;
  }

  try {
    const url = id ? `http://localhost:3000/api/proveedores/${id}` : 'http://localhost:3000/api/proveedores';
    const method = id ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, rut, contacto, telefono, email })
    });

    if (response.ok) {
      cerrarModalProveedor();
      cambiarSeccion('proveedores');
    }
  } catch (err) {
    error.style.display = 'block';
    error.textContent = '⚠️ Error conectando con el servidor.';
  }
}

// ============================================================
// EDITAR PRODUCTO — abre modal con datos precargados
// ============================================================

async function editarProducto(id) {
  try {
    // Obtiene los datos actuales del producto
    const response = await fetch(`http://localhost:3000/api/productos/${id}`);
    const p = await response.json();

    // Crea el modal con los datos precargados
    const modal = document.createElement('div');
    modal.id = 'modalProducto';
    modal.className = 'modal-overlay open';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-logo">
          <div class="modal-logo-icon">✏️</div>
          <div>
            <div class="modal-logo-text">Editar producto</div>
            <div class="modal-logo-sub">Modifica los datos del producto</div>
          </div>
          <button class="modal-close" onclick="cerrarModalProducto()">✕</button>
        </div>

        <div class="form-group">
          <label class="form-label">Nombre del producto</label>
          <input class="form-input" type="text" id="prod-nombre" value="${p.nombre}">
        </div>

        <div class="form-group">
          <label class="form-label">SKU</label>
          <input class="form-input" type="text" id="prod-sku" value="${p.sku || ''}">
        </div>

        <div class="form-group">
          <label class="form-label">Precio</label>
          <input class="form-input" type="number" id="prod-precio" value="${p.precio}">
        </div>

        <div class="form-group">
          <label class="form-label">Stock actual</label>
          <input class="form-input" type="number" id="prod-stock" value="${p.stock}">
        </div>

        <div class="form-group">
          <label class="form-label">Stock mínimo</label>
          <input class="form-input" type="number" id="prod-stock-min" value="${p.stock_minimo}">
        </div>

        <button class="btn-modal-submit" onclick="actualizarProducto(${p.id})">Guardar cambios →</button>

        <div class="login-error" id="prod-error"></div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) cerrarModalProducto();
    });

  } catch (error) {
    console.error('Error cargando producto:', error);
  }
}


// ============================================================
// ACTUALIZAR PRODUCTO — envía los cambios a la API
// ============================================================

async function actualizarProducto(id) {
  const nombre = document.getElementById('prod-nombre').value.trim();
  const sku = document.getElementById('prod-sku').value.trim();
  const precio = document.getElementById('prod-precio').value;
  const stock = document.getElementById('prod-stock').value;
  const stock_minimo = document.getElementById('prod-stock-min').value;
  const error = document.getElementById('prod-error');

  if (!nombre || !precio || !stock) {
    error.style.display = 'block';
    error.textContent = '⚠️ Nombre, precio y stock son requeridos.';
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, sku, precio, stock, stock_minimo })
    });

    if (response.ok) {
      cerrarModalProducto();
      cambiarSeccion('productos');
    } else {
      const data = await response.json();
      error.style.display = 'block';
      error.textContent = '⚠️ ' + data.error;
    }
  } catch (err) {
    error.style.display = 'block';
    error.textContent = '⚠️ Error conectando con el servidor.';
  }
}

// ============================================================
// CARGAR DATOS REALES DEL DASHBOARD DESDE LA API
// Consulta los endpoints del backend y actualiza las tarjetas
// ============================================================

async function cargarResumenDashboard() {
  try {
    // Obtiene todos los productos desde la API
    const response = await fetch('http://localhost:3000/api/productos');
    const productos = await response.json();

    // Calcula los totales desde los datos reales
    const total = productos.length;
    const stockOk = productos.filter(p => p.stock >= p.stock_minimo).length;
    const alertas = productos.filter(p => p.stock < p.stock_minimo).length;

    // Actualiza las tarjetas con los números reales
    // Busca los elementos por su contenido y los actualiza
    const tarjetas = document.querySelectorAll('.stat-card-num');
    if (tarjetas.length >= 3) {
      tarjetas[0].textContent = total;    // Total productos
      tarjetas[1].textContent = stockOk;  // Stock ok
      tarjetas[2].textContent = alertas;  // Alertas
    }

    // Actualiza el badge de alertas en el sidebar
    const badge = document.getElementById('alertaBadge');
    if (badge) badge.textContent = alertas;

    // Construye las filas de la tabla dinámicamente
    const filas = productos.map(p => `
      <tr>
        <td><div class="product-img-placeholder">📦</div></td>
        <td>
          <div class="product-name">${p.nombre}</div>
          <div class="product-sku">SKU: ${p.sku || 'Sin SKU'}</div>
        </td>
        <td>${p.categoria_id || '—'}</td>
        <td>$${Number(p.precio).toLocaleString('es-CL')}</td>
        <td>${p.stock}</td>
        <td>${p.stock_minimo}</td>
        <td>
          <span class="badge ${p.stock < p.stock_minimo ? 'red' : 'green'}">
            ${p.stock < p.stock_minimo ? 'Bajo' : 'Ok'}
          </span>
        </td>
        <td>
          <div class="action-btns">
            <button class="btn-action blue" title="Ver detalle">👁</button>
            <button class="btn-action amber" title="Editar">✏️</button>
            <button class="btn-action red" title="Eliminar" data-id="${p.id}" class="btn-eliminar">🗑</button>
          </div>
        </td>
      </tr>
    `).join('');

    // Inserta las filas en la tabla
    document.querySelector('.data-table tbody').innerHTML = filas;

    // Actualiza el badge con el total real
    document.querySelector('.section-card .badge.blue').textContent = `${productos.length} productos`;

  } catch (error) {
    console.error('Error cargando productos:', error);
  }
}

async function cargarProductos() {
  try {
    const response = await fetch('http://localhost:3000/api/productos');
    const productos = await response.json();

    const filas = productos.map(p => `
      <tr>
        <td><div class="product-img-placeholder">📦</div></td>
        <td>
          <div class="product-name">${p.nombre}</div>
          <div class="product-sku">SKU: ${p.sku || 'Sin SKU'}</div>
        </td>
        <td>${p.categoria_id || '—'}</td>
        <td>$${Number(p.precio).toLocaleString('es-CL')}</td>
        <td>${p.stock}</td>
        <td>${p.stock_minimo}</td>
        <td>
          <span class="badge ${p.stock < p.stock_minimo ? 'red' : 'green'}">
            ${p.stock < p.stock_minimo ? 'Bajo' : 'Ok'}
          </span>
        </td>
        <td>
          <div class="action-btns">
            <button class="btn-action blue" title="Ver detalle">👁</button>
            <button class="btn-action amber btn-editar" title="Editar" data-id="${p.id}">✏️</button>
            <button class="btn-action red btn-eliminar" title="Eliminar" data-id="${p.id}">🗑</button>
          </div>
        </td>
      </tr>
    `).join('');

    document.querySelector('.data-table tbody').innerHTML = filas;
    document.querySelector('.section-card .badge.blue').textContent = `${productos.length} productos`;

    // Agrega evento a cada botón de eliminar
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', () => {
        eliminarProducto(btn.getAttribute('data-id'));
      });
    });  // ← faltaba este punto y coma

    // Agrega evento a cada botón de editar
    document.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', () => {
        editarProducto(btn.getAttribute('data-id'));
      });
    });
  

  } catch (error) {
    console.error('Error cargando productos:', error);
  }
}


async function eliminarProducto(id) {
  if (!confirm('¿Estás seguro de eliminar este producto?')) return;

  try {
    const response = await fetch(`http://localhost:3000/api/productos/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      cambiarSeccion('productos');
    }
  } catch (error) {
    console.error('Error eliminando producto:', error);
  }
}

// ============================================================
// ELIMINAR PRODUCTO
// ============================================================

async function eliminarProducto(id) {
  if (!confirm('¿Estás seguro de eliminar este producto?')) return;

  try {
    const response = await fetch(`http://localhost:3000/api/productos/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
  cambiarSeccion('productos'); // recarga toda la sección incluyendo la tabla
    }
  } catch (error) {
    console.error('Error eliminando producto:', error);
  }
} 

// ============================================================
// CARGAR CATEGORÍAS DESDE LA API
// ============================================================

async function cargarCategorias() {
  try {
    const response = await fetch('http://localhost:3000/api/categorias');
    const categorias = await response.json();

    const filas = categorias.map(c => `
      <tr>
        <td><div class="product-name">${c.nombre}</div></td>
        <td>${c.descripcion || '—'}</td>
        <td>${c.total_productos}</td>
        <td><span class="badge ${c.activa ? 'green' : 'red'}">${c.activa ? 'Activa' : 'Inactiva'}</span></td>
        <td>
          <div class="action-btns">
            <button class="btn-action amber btn-editar-cat" title="Editar" data-id="${c.id}" data-nombre="${c.nombre}" data-desc="${c.descripcion || ''}">✏️</button>
            <button class="btn-action red btn-eliminar-cat" title="Eliminar" data-id="${c.id}">🗑</button>
          </div>
        </td>
      </tr>
    `).join('');

    document.querySelector('.data-table tbody').innerHTML = filas;
    document.querySelector('.section-card .badge.blue').textContent = `${categorias.length} categorías`;

    document.querySelectorAll('.btn-eliminar-cat').forEach(btn => {
      btn.addEventListener('click', () => eliminarCategoria(btn.getAttribute('data-id')));
    });

    document.querySelectorAll('.btn-editar-cat').forEach(btn => {
      btn.addEventListener('click', () => {
        editarCategoria(btn.getAttribute('data-id'), btn.getAttribute('data-nombre'), btn.getAttribute('data-desc'));
      });
    });

  } catch (error) {
    console.error('Error cargando categorías:', error);
  }
}

async function eliminarCategoria(id) {
  if (!confirm('¿Eliminar esta categoría?')) return;
  try {
    await fetch(`http://localhost:3000/api/categorias/${id}`, { method: 'DELETE' });
    cambiarSeccion('categorias');
  } catch (error) {
    console.error('Error eliminando categoría:', error);
  }
}

// ============================================================
// CARGAR USUARIOS DESDE LA API
// ============================================================

async function cargarUsuarios() {
  try {
    const response = await fetch('http://localhost:3000/api/usuarios');
    const usuarios = await response.json();

    const filas = usuarios.map(u => `
      <tr>
        <td>
          <div class="user-cell">
            <div class="user-avatar blue">${u.nombre.charAt(0).toUpperCase()}</div>
            <div>
              <div class="product-name">${u.nombre}</div>
              <div class="product-sku">${u.email}</div>
            </div>
          </div>
        </td>
        <td>${u.email}</td>
        <td><span class="badge ${u.rol === 'admin' ? 'blue' : u.rol === 'supervisor' ? 'green' : 'amber'}">${u.rol}</span></td>
        <td>${u.ultimo_acceso ? new Date(u.ultimo_acceso).toLocaleString('es-CL') : 'Nunca'}</td>
        <td><span class="badge ${u.activo ? 'green' : 'red'}">${u.activo ? 'Activo' : 'Inactivo'}</span></td>
        <td>
          <td>
          <div class="action-btns">
            <button class="btn-action blue btn-permisos-usr" title="Permisos" data-id="${u.id}" data-nombre="${u.nombre}">🔑</button>
            <button class="btn-action amber btn-editar-usr" title="Editar" data-id="${u.id}" data-nombre="${u.nombre}" data-email="${u.email}" data-rol="${u.rol}" data-activo="${u.activo}">✏️</button>
            <button class="btn-action red btn-eliminar-usr" title="Eliminar" data-id="${u.id}">🗑</button>
          </div>
          </td>
          </div>
        </td>
      </tr>
    `).join('');

    document.querySelector('.data-table tbody').innerHTML = filas;
    document.querySelector('.section-card .badge.blue').textContent = `${usuarios.length} usuarios`;

    document.querySelectorAll('.btn-eliminar-usr').forEach(btn => {
      btn.addEventListener('click', () => eliminarUsuario(btn.getAttribute('data-id')));
    });

    document.querySelectorAll('.btn-editar-usr').forEach(btn => {
      btn.addEventListener('click', () => {
        abrirModalUsuario(
          btn.getAttribute('data-id'),
          btn.getAttribute('data-nombre'),
          btn.getAttribute('data-email'),
          btn.getAttribute('data-rol'),
          btn.getAttribute('data-activo') === 'true'
        );
      });
    });

   document.querySelectorAll('.btn-permisos-usr').forEach(btn => {
    btn.addEventListener('click', () => {
    abrirModalPermisos(btn.getAttribute('data-id'), btn.getAttribute('data-nombre'));
  });
});

  } catch (error) {
    console.error('Error cargando usuarios:', error);
  }
}

async function eliminarUsuario(id) {
  if (!confirm('¿Eliminar este usuario?')) return;
  try {
    await fetch(`http://localhost:3000/api/usuarios/${id}`, { method: 'DELETE' });
    cambiarSeccion('usuarios');
  } catch (error) {
    console.error('Error eliminando usuario:', error);
  }
}

function abrirModalPermisos(id, nombre) {
  const modulos = [
    { key: 'productos', label: '📦 Productos' },
    { key: 'movimientos', label: '🔄 Movimientos' },
    { key: 'alertas', label: '🚨 Alertas de stock' },
    { key: 'categorias', label: '🏷️ Categorías' },
    { key: 'proveedores', label: '🏭 Proveedores' },
    { key: 'reportes', label: '📊 Reportes' },
    { key: 'usuarios', label: '👥 Usuarios' },
  ];

  const modal = document.createElement('div');
  modal.id = 'modalPermisos';
  modal.className = 'modal-overlay open';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-logo">
        <div class="modal-logo-icon">🔑</div>
        <div>
          <div class="modal-logo-text">Permisos de ${nombre}</div>
          <div class="modal-logo-sub">Activa o desactiva módulos</div>
        </div>
        <button class="modal-close" onclick="cerrarModalPermisos()">✕</button>
      </div>

      <div class="permisos-list">
        ${modulos.map(m => `
          <div class="permiso-item">
            <span class="permiso-label">${m.label}</span>
            <label class="toggle">
              <input type="checkbox" checked data-modulo="${m.key}">
              <span class="toggle-slider"></span>
            </label>
          </div>
        `).join('')}
      </div>

      <button class="btn-modal-submit" onclick="cerrarModalPermisos()">Guardar permisos →</button>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) cerrarModalPermisos(); });
}

function cerrarModalPermisos() {
  const modal = document.getElementById('modalPermisos');
  if (modal) modal.remove();
}

function abrirModalUsuario(id = null, nombre = '', email = '', rol = 'vendedor', activo = true) {
  const esEditar = id !== null;
  const modal = document.createElement('div');
  modal.id = 'modalUsuario';
  modal.className = 'modal-overlay open';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-logo">
        <div class="modal-logo-icon">👤</div>
        <div>
          <div class="modal-logo-text">${esEditar ? 'Editar' : 'Agregar'} usuario</div>
        </div>
        <button class="modal-close" onclick="cerrarModalUsuario()">✕</button>
      </div>
      <div class="form-group">
        <label class="form-label">Nombre completo</label>
        <input class="form-input" type="text" id="usr-nombre" value="${nombre}" placeholder="Ej: Juan Pérez">
      </div>
      <div class="form-group">
        <label class="form-label">Email</label>
        <input class="form-input" type="email" id="usr-email" value="${email}" placeholder="usuario@empresa.cl">
      </div>
      ${!esEditar ? `
      <div class="form-group">
        <label class="form-label">Contraseña</label>
        <input class="form-input" type="password" id="usr-password" placeholder="••••••••">
      </div>` : ''}
      <div class="form-group">
        <label class="form-label">Rol</label>
        <select class="form-input" id="usr-rol">
          <option value="vendedor" ${rol === 'vendedor' ? 'selected' : ''}>Vendedor</option>
          <option value="supervisor" ${rol === 'supervisor' ? 'selected' : ''}>Supervisor</option>
          <option value="admin" ${rol === 'admin' ? 'selected' : ''}>Administrador</option>
        </select>
      </div>
      ${esEditar ? `
      <div class="form-group">
        <label class="form-label">Estado</label>
        <select class="form-input" id="usr-activo">
          <option value="true" ${activo ? 'selected' : ''}>Activo</option>
          <option value="false" ${!activo ? 'selected' : ''}>Inactivo</option>
        </select>
      </div>` : ''}
      <button class="btn-modal-submit" onclick="guardarUsuario(${id})">
        ${esEditar ? 'Guardar cambios →' : 'Agregar usuario →'}
      </button>
      <div class="login-error" id="usr-error"></div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) cerrarModalUsuario(); });
}

function cerrarModalUsuario() {
  const modal = document.getElementById('modalUsuario');
  if (modal) modal.remove();
}

async function guardarUsuario(id) {
  const nombre = document.getElementById('usr-nombre').value.trim();
  const email = document.getElementById('usr-email').value.trim();
  const rol = document.getElementById('usr-rol').value;
  const error = document.getElementById('usr-error');
  const activoEl = document.getElementById('usr-activo');
  const activo = activoEl ? activoEl.value === 'true' : true;

  if (!nombre || !email) {
    error.style.display = 'block';
    error.textContent = '⚠️ Nombre y email son requeridos.';
    return;
  }

  const body = { nombre, email, rol, activo };

  if (!id) {
    const password = document.getElementById('usr-password').value;
    if (!password) {
      error.style.display = 'block';
      error.textContent = '⚠️ La contraseña es requerida.';
      return;
    }
    body.password = password;
  }

  try {
    const url = id ? `http://localhost:3000/api/usuarios/${id}` : 'http://localhost:3000/api/usuarios';
    const method = id ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      cerrarModalUsuario();
      cambiarSeccion('usuarios');
    } else {
      const data = await response.json();
      error.style.display = 'block';
      error.textContent = '⚠️ ' + data.error;
    }
  } catch (err) {
    error.style.display = 'block';
    error.textContent = '⚠️ Error conectando con el servidor.';
  }
}

function abrirModalCategoria(id = null, nombre = '', descripcion = '') {
  const esEditar = id !== null;
  const modal = document.createElement('div');
  modal.id = 'modalCategoria';
  modal.className = 'modal-overlay open';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-logo">
        <div class="modal-logo-icon">🏷️</div>
        <div>
          <div class="modal-logo-text">${esEditar ? 'Editar' : 'Agregar'} categoría</div>
        </div>
        <button class="modal-close" onclick="cerrarModalCategoria()">✕</button>
      </div>
      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input class="form-input" type="text" id="cat-nombre" value="${nombre}" placeholder="Ej: Herramientas">
      </div>
      <div class="form-group">
        <label class="form-label">Descripción</label>
        <input class="form-input" type="text" id="cat-desc" value="${descripcion}" placeholder="Descripción opcional">
      </div>
      <button class="btn-modal-submit" onclick="guardarCategoria(${id})">
        ${esEditar ? 'Guardar cambios →' : 'Agregar categoría →'}
      </button>
      <div class="login-error" id="cat-error"></div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) cerrarModalCategoria(); });
}

function editarCategoria(id, nombre, descripcion) {
  abrirModalCategoria(id, nombre, descripcion);
}

function cerrarModalCategoria() {
  const modal = document.getElementById('modalCategoria');
  if (modal) modal.remove();
}

async function guardarCategoria(id) {
  const nombre = document.getElementById('cat-nombre').value.trim();
  const descripcion = document.getElementById('cat-desc').value.trim();
  const error = document.getElementById('cat-error');

  if (!nombre) {
    error.style.display = 'block';
    error.textContent = '⚠️ El nombre es requerido.';
    return;
  }

  try {
    const url = id ? `http://localhost:3000/api/categorias/${id}` : 'http://localhost:3000/api/categorias';
    const method = id ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, descripcion })
    });

    if (response.ok) {
      cerrarModalCategoria();
      cambiarSeccion('categorias');
    }
  } catch (err) {
    error.style.display = 'block';
    error.textContent = '⚠️ Error conectando con el servidor.';
  }
}

// ============================================================
// CARGAR REPORTES DESDE LA API
// Solo lectura — muestra resumen y opciones de exportar
// ============================================================

async function cargarReportes() {
  try {
    const [prodResponse, movResponse] = await Promise.all([
      fetch('http://localhost:3000/api/productos'),
      fetch('http://localhost:3000/api/movimientos')
    ]);

    const productos = await prodResponse.json();
    const movimientos = await movResponse.json();

    // Calcula totales
    const totalProductos = productos.length;
    const valorInventario = productos.reduce((acc, p) => acc + (p.precio * p.stock), 0);
    const entradas = movimientos.filter(m => m.tipo === 'entrada').length;
    const salidas = movimientos.filter(m => m.tipo === 'salida').length;

    // Actualiza tarjetas
    const tarjetas = document.querySelectorAll('.stat-card-num');
    if (tarjetas.length >= 4) {
      tarjetas[0].textContent = entradas;
      tarjetas[1].textContent = salidas;
      tarjetas[2].textContent = `$${Math.round(valorInventario).toLocaleString('es-CL')}`;
      tarjetas[3].textContent = movimientos.length;
    }

  } catch (error) {
    console.error('Error cargando reportes:', error);
  }
}

// ============================================================
// MODAL AGREGAR PRODUCTO
// Se abre al hacer clic en "+ Agregar producto"
// ============================================================

function abrirModalProducto() {
  // Crea el modal dinámicamente
  const modal = document.createElement('div');
  modal.id = 'modalProducto';
  modal.className = 'modal-overlay open';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-logo">
        <div class="modal-logo-icon">📦</div>
        <div>
          <div class="modal-logo-text">Agregar producto</div>
          <div class="modal-logo-sub">Complete los datos del producto</div>
        </div>
        <button class="modal-close" onclick="cerrarModalProducto()">✕</button>
      </div>

      <div class="form-group">
        <label class="form-label">Nombre del producto</label>
        <input class="form-input" type="text" id="prod-nombre" placeholder="Ej: Martillo Stanley 16oz">
      </div>

      <div class="form-group">
        <label class="form-label">SKU</label>
        <input class="form-input" type="text" id="prod-sku" placeholder="Ej: MART-001">
      </div>

      <div class="form-group">
        <label class="form-label">Precio</label>
        <input class="form-input" type="number" id="prod-precio" placeholder="Ej: 8990">
      </div>

      <div class="form-group">
        <label class="form-label">Stock inicial</label>
        <input class="form-input" type="number" id="prod-stock" placeholder="Ej: 10">
      </div>

      <div class="form-group">
        <label class="form-label">Stock mínimo</label>
        <input class="form-input" type="number" id="prod-stock-min" placeholder="Ej: 5">
      </div>

      <button class="btn-modal-submit" onclick="guardarProducto()">Guardar producto →</button>

      <div class="login-error" id="prod-error"></div>
    </div>
  `;

  document.body.appendChild(modal);

  // Cierra al hacer clic fuera
  modal.addEventListener('click', (e) => {
    if (e.target === modal) cerrarModalProducto();
  });
}

function cerrarModalProducto() {
  const modal = document.getElementById('modalProducto');
  if (modal) modal.remove();
}

async function guardarProducto() {
  const nombre = document.getElementById('prod-nombre').value.trim();
  const sku = document.getElementById('prod-sku').value.trim();
  const precio = document.getElementById('prod-precio').value;
  const stock = document.getElementById('prod-stock').value;
  const stock_minimo = document.getElementById('prod-stock-min').value;
  const error = document.getElementById('prod-error');

  if (!nombre || !precio || !stock) {
    error.style.display = 'block';
    error.textContent = '⚠️ Nombre, precio y stock son requeridos.';
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, sku, precio, stock, stock_minimo })
    });

    if (response.ok) {
      cerrarModalProducto();
      cambiarSeccion('productos'); // recarga la tabla
    } else {
      const data = await response.json();
      error.style.display = 'block';
      error.textContent = '⚠️ ' + data.error;
    }
  } catch (err) {
    error.style.display = 'block';
    error.textContent = '⚠️ Error conectando con el servidor.';
  }
}

// Función que cambia la sección activa
function cambiarSeccion(seccion) {
  const config = secciones[seccion];
  if (!config) return;

  // Actualiza título y subtítulo
  pageTitle.textContent = config.titulo;
  pageSubtitle.textContent = config.subtitulo;

  // Muestra u oculta el botón de acción
  if (config.btnAccion) {
    btnAccion.style.display = 'block';
    btnAccion.textContent = config.btnAccion;
  } else {
    btnAccion.style.display = 'none';
  }

  // Actualiza item activo en el sidebar
  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelector(`[data-section="${seccion}"]`).classList.add('active');

  // Aquí se cargará el contenido de cada sección
  // Por ahora muestra un placeholder
  // En los próximos pasos agregaremos el HTML de cada sección
  // Carga el contenido según la sección activa
  const contenidos = {
    dashboard: `
      <!-- Tarjetas de resumen -->
      <div class="stats-grid">

        <div class="stat-card">
          <div class="stat-card-icon blue">📦</div>
          <div class="stat-card-info">
            <div class="stat-card-num">124</div>
            <div class="stat-card-label">Productos registrados</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card-icon green">✅</div>
          <div class="stat-card-info">
            <div class="stat-card-num">98</div>
            <div class="stat-card-label">Productos con stock ok</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card-icon red">🚨</div>
          <div class="stat-card-info">
            <div class="stat-card-num">3</div>
            <div class="stat-card-label">Alertas de stock bajo</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card-icon amber">🔄</div>
          <div class="stat-card-info">
            <div class="stat-card-num">12</div>
            <div class="stat-card-label">Movimientos hoy</div>
          </div>
        </div>

      </div>

      <!-- Últimos movimientos -->
      <div class="section-card">
        <div class="section-card-header">
          <div class="section-card-title">Últimos movimientos</div>
          <a href="#" class="section-card-link">Ver todos →</a>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Tipo</th>
              <th>Cantidad</th>
              <th>Fecha</th>
              <th>Usuario</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Martillo Stanley 16oz</td>
              <td><span class="badge green">Entrada</span></td>
              <td>20</td>
              <td>Hoy 09:30</td>
              <td>Francisco S.</td>
            </tr>
            <tr>
              <td>Tornillos 1/2" (caja)</td>
              <td><span class="badge red">Salida</span></td>
              <td>5</td>
              <td>Hoy 10:15</td>
              <td>María G.</td>
            </tr>
            <tr>
              <td>Pintura blanca 1L</td>
              <td><span class="badge red">Salida</span></td>
              <td>3</td>
              <td>Hoy 11:00</td>
              <td>Francisco S.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Productos con stock bajo -->
      <div class="section-card">
        <div class="section-card-header">
          <div class="section-card-title">⚠️ Productos con stock bajo</div>
          <a href="#" class="section-card-link">Ver alertas →</a>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Stock actual</th>
              <th>Stock mínimo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Lija 120 (unidad)</td>
              <td>2</td>
              <td>10</td>
              <td><span class="badge red">Crítico</span></td>
            </tr>
            <tr>
              <td>Cinta adhesiva 2"</td>
              <td>5</td>
              <td>15</td>
              <td><span class="badge amber">Bajo</span></td>
            </tr>
            <tr>
              <td>Guantes de trabajo L</td>
              <td>8</td>
              <td>10</td>
              <td><span class="badge amber">Bajo</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    productos: `
  <!-- Barra de búsqueda y filtros -->
  <div class="module-toolbar">
    <div class="toolbar-search">
      <span class="toolbar-search-icon">🔍</span>
      <input type="text" class="toolbar-search-input" placeholder="Buscar producto...">
    </div>
    <div class="toolbar-filters">
      <select class="toolbar-select">
        <option value="">Todas las categorías</option>
        <option>Herramientas</option>
        <option>Materiales</option>
        <option>Ferretería</option>
      </select>
      <select class="toolbar-select">
        <option value="">Todos los estados</option>
        <option>Stock ok</option>
        <option>Stock bajo</option>
        <option>Sin stock</option>
      </select>
    </div>
  </div>

  <!-- Tabla de productos -->
  <div class="section-card">
    <div class="section-card-header">
      <div class="section-card-title">Lista de productos</div>
      <span class="badge blue">124 productos</span>
    </div>
    <table class="data-table">
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Producto</th>
          <th>Categoría</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Stock mín.</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><div class="product-img-placeholder">📦</div></td>
          <td>
            <div class="product-name">Martillo Stanley 16oz</div>
            <div class="product-sku">SKU: MART-001</div>
          </td>
          <td>Herramientas</td>
          <td>$8.990</td>
          <td>45</td>
          <td>10</td>
          <td><span class="badge green">Ok</span></td>
          <td>
            <div class="action-btns">
              <button class="btn-action blue" title="Ver detalle">👁</button>
              <button class="btn-action amber" title="Editar">✏️</button>
              <button class="btn-action red" title="Eliminar">🗑</button>
            </div>
          </td>
        </tr>
        <tr>
          <td><div class="product-img-placeholder">📦</div></td>
          <td>
            <div class="product-name">Tornillos 1/2" (caja x100)</div>
            <div class="product-sku">SKU: TORN-002</div>
          </td>
          <td>Ferretería</td>
          <td>$2.490</td>
          <td>8</td>
          <td>15</td>
          <td><span class="badge amber">Bajo</span></td>
          <td>
            <div class="action-btns">
              <button class="btn-action blue" title="Ver detalle">👁</button>
              <button class="btn-action amber" title="Editar">✏️</button>
              <button class="btn-action red" title="Eliminar">🗑</button>
            </div>
          </td>
        </tr>
        <tr>
          <td><div class="product-img-placeholder">📦</div></td>
          <td>
            <div class="product-name">Lija 120 (unidad)</div>
            <div class="product-sku">SKU: LIJA-003</div>
          </td>
          <td>Materiales</td>
          <td>$390</td>
          <td>2</td>
          <td>10</td>
          <td><span class="badge red">Crítico</span></td>
          <td>
            <div class="action-btns">
              <button class="btn-action blue" title="Ver detalle">👁</button>
              <button class="btn-action amber" title="Editar">✏️</button>
              <button class="btn-action red" title="Eliminar">🗑</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>`,
    movimientos: `
  <!-- Barra de acciones -->
  <div class="module-toolbar">
    <div class="toolbar-search">
      <span class="toolbar-search-icon">🔍</span>
      <input type="text" class="toolbar-search-input" placeholder="Buscar producto o usuario...">
    </div>
    <div class="toolbar-filters">
      <select class="toolbar-select">
        <option value="">Todos los tipos</option>
        <option>Entrada</option>
        <option>Salida</option>
      </select>
      <select class="toolbar-select">
        <option value="">Todas las fechas</option>
        <option>Hoy</option>
        <option>Esta semana</option>
        <option>Este mes</option>
      </select>
    </div>
  </div>

  <!-- Tabla de movimientos -->
  <div class="section-card">
    <div class="section-card-header">
      <div class="section-card-title">Historial de movimientos</div>
      <span class="badge blue">38 movimientos este mes</span>
    </div>
    <table class="data-table">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Producto</th>
          <th>Tipo</th>
          <th>Cantidad</th>
          <th>Stock anterior</th>
          <th>Stock nuevo</th>
          <th>Usuario</th>
          <th>Nota</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Hoy 11:00</td>
          <td>
            <div class="product-name">Pintura blanca 1L</div>
            <div class="product-sku">SKU: PINT-010</div>
          </td>
          <td><span class="badge red">Salida</span></td>
          <td>3</td>
          <td>18</td>
          <td>15</td>
          <td>Francisco S.</td>
          <td>Venta mostrador</td>
        </tr>
        <tr>
          <td>Hoy 10:15</td>
          <td>
            <div class="product-name">Tornillos 1/2" (caja)</div>
            <div class="product-sku">SKU: TORN-002</div>
          </td>
          <td><span class="badge red">Salida</span></td>
          <td>5</td>
          <td>13</td>
          <td>8</td>
          <td>María G.</td>
          <td>Venta mostrador</td>
        </tr>
        <tr>
          <td>Hoy 09:30</td>
          <td>
            <div class="product-name">Martillo Stanley 16oz</div>
            <div class="product-sku">SKU: MART-001</div>
          </td>
          <td><span class="badge green">Entrada</span></td>
          <td>20</td>
          <td>25</td>
          <td>45</td>
          <td>Francisco S.</td>
          <td>Compra proveedor</td>
        </tr>
        <tr>
          <td>Ayer 16:45</td>
          <td>
            <div class="product-name">Lija 120 (unidad)</div>
            <div class="product-sku">SKU: LIJA-003</div>
          </td>
          <td><span class="badge red">Salida</span></td>
          <td>8</td>
          <td>10</td>
          <td>2</td>
          <td>María G.</td>
          <td>Venta mostrador</td>
        </tr>
      </tbody>
    </table>
  </div>`,
    alertas: `
  <!-- Resumen de alertas -->
  <div class="stats-grid">

    <div class="stat-card">
      <div class="stat-card-icon red">🚨</div>
      <div class="stat-card-info">
        <div class="stat-card-num">1</div>
        <div class="stat-card-label">Stock crítico</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-card-icon amber">⚠️</div>
      <div class="stat-card-info">
        <div class="stat-card-num">2</div>
        <div class="stat-card-label">Stock bajo</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-card-icon green">✅</div>
      <div class="stat-card-info">
        <div class="stat-card-num">98</div>
        <div class="stat-card-label">Productos ok</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-card-icon blue">📦</div>
      <div class="stat-card-info">
        <div class="stat-card-num">124</div>
        <div class="stat-card-label">Total productos</div>
      </div>
    </div>

  </div>

  <!-- Tabla de alertas -->
  <div class="section-card">
    <div class="section-card-header">
      <div class="section-card-title">🚨 Productos que requieren atención</div>
    </div>
    <table class="data-table">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Categoría</th>
          <th>Stock actual</th>
          <th>Stock mínimo</th>
          <th>Diferencia</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div class="product-name">Lija 120 (unidad)</div>
            <div class="product-sku">SKU: LIJA-003</div>
          </td>
          <td>Materiales</td>
          <td><strong style="color:var(--red)">2</strong></td>
          <td>10</td>
          <td><span class="badge red">-8</span></td>
          <td><span class="badge red">Crítico</span></td>
          <td>
            <div class="action-btns">
              <button class="btn-action green" title="Registrar entrada">📥</button>
              <button class="btn-action blue" title="Ver producto">👁</button>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="product-name">Tornillos 1/2" (caja)</div>
            <div class="product-sku">SKU: TORN-002</div>
          </td>
          <td>Ferretería</td>
          <td><strong style="color:var(--amber)">8</strong></td>
          <td>15</td>
          <td><span class="badge amber">-7</span></td>
          <td><span class="badge amber">Bajo</span></td>
          <td>
            <div class="action-btns">
              <button class="btn-action green" title="Registrar entrada">📥</button>
              <button class="btn-action blue" title="Ver producto">👁</button>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="product-name">Guantes de trabajo L</div>
            <div class="product-sku">SKU: GUAN-015</div>
          </td>
          <td>Seguridad</td>
          <td><strong style="color:var(--amber)">8</strong></td>
          <td>10</td>
          <td><span class="badge amber">-2</span></td>
          <td><span class="badge amber">Bajo</span></td>
          <td>
            <div class="action-btns">
              <button class="btn-action green" title="Registrar entrada">📥</button>
              <button class="btn-action blue" title="Ver producto">👁</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>`,
    categorias: `
  <!-- Barra de acciones -->
  <div class="module-toolbar">
    <div class="toolbar-search">
      <span class="toolbar-search-icon">🔍</span>
      <input type="text" class="toolbar-search-input" placeholder="Buscar categoría...">
    </div>
  </div>

  <!-- Tabla de categorías -->
  <div class="section-card">
    <div class="section-card-header">
      <div class="section-card-title">Lista de categorías</div>
      <span class="badge blue">6 categorías</span>
    </div>
    <table class="data-table">
      <thead>
        <tr>
          <th>Categoría</th>
          <th>Descripción</th>
          <th>Productos</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div class="product-name">🔧 Herramientas</div>
          </td>
          <td>Martillos, destornilladores, llaves y más</td>
          <td>32</td>
          <td><span class="badge green">Activa</span></td>
          <td>
            <div class="action-btns">
              <button class="btn-action amber" title="Editar">✏️</button>
              <button class="btn-action red" title="Eliminar">🗑</button>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="product-name">🪛 Ferretería</div>
          </td>
          <td>Tornillos, tuercas, pernos y accesorios</td>
          <td>45</td>
          <td><span class="badge green">Activa</span></td>
          <td>
            <div class="action-btns">
              <button class="btn-action amber" title="Editar">✏️</button>
              <button class="btn-action red" title="Eliminar">🗑</button>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="product-name">🎨 Materiales</div>
          </td>
          <td>Pinturas, lijas, selladores y más</td>
          <td>28</td>
          <td><span class="badge green">Activa</span></td>
          <td>
            <div class="action-btns">
              <button class="btn-action amber" title="Editar">✏️</button>
              <button class="btn-action red" title="Eliminar">🗑</button>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="product-name">🧤 Seguridad</div>
          </td>
          <td>Guantes, cascos, lentes de protección</td>
          <td>15</td>
          <td><span class="badge green">Activa</span></td>
          <td>
            <div class="action-btns">
              <button class="btn-action amber" title="Editar">✏️</button>
              <button class="btn-action red" title="Eliminar">🗑</button>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="product-name">💡 Electricidad</div>
          </td>
          <td>Cables, enchufes, interruptores</td>
          <td>19</td>
          <td><span class="badge green">Activa</span></td>
          <td>
            <div class="action-btns">
              <button class="btn-action amber" title="Editar">✏️</button>
              <button class="btn-action red" title="Eliminar">🗑</button>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="product-name">🚿 Gasfitería</div>
          </td>
          <td>Cañerías, llaves de paso, accesorios</td>
          <td>0</td>
          <td><span class="badge red">Vacía</span></td>
          <td>
            <div class="action-btns">
              <button class="btn-action amber" title="Editar">✏️</button>
              <button class="btn-action red" title="Eliminar">🗑</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>`,
    proveedores: `
  <!-- Barra de acciones -->
  <div class="module-toolbar">
    <div class="toolbar-search">
      <span class="toolbar-search-icon">🔍</span>
      <input type="text" class="toolbar-search-input" placeholder="Buscar proveedor...">
    </div>
  </div>

  <!-- Tabla de proveedores -->
  <div class="section-card">
    <div class="section-card-header">
      <div class="section-card-title">Lista de proveedores</div>
      <span class="badge blue">4 proveedores</span>
    </div>
    <table class="data-table">
      <thead>
        <tr>
          <th>Proveedor</th>
          <th>Contacto</th>
          <th>Teléfono</th>
          <th>Email</th>
          <th>Categorías</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div class="product-name">Ferretería Central Ltda.</div>
            <div class="product-sku">RUT: 76.123.456-7</div>
          </td>
          <td>Juan Pérez</td>
          <td>+56 9 1234 5678</td>
          <td>contacto@ferrcentral.cl</td>
          <td>Herramientas, Ferretería</td>
          <td><span class="badge green">Activo</span></td>
          <td>
            <div class="action-btns">
              <button class="btn-action blue" title="Ver detalle">👁</button>
              <button class="btn-action amber" title="Editar">✏️</button>
              <button class="btn-action red" title="Eliminar">🗑</button>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="product-name">Distribuidora El Material</div>
            <div class="product-sku">RUT: 77.654.321-0</div>
          </td>
          <td>Ana González</td>
          <td>+56 9 8765 4321</td>
          <td>ventas@elmaterial.cl</td>
          <td>Materiales, Pintura</td>
          <td><span class="badge green">Activo</span></td>
          <td>
            <div class="action-btns">
              <button class="btn-action blue" title="Ver detalle">👁</button>
              <button class="btn-action amber" title="Editar">✏️</button>
              <button class="btn-action red" title="Eliminar">🗑</button>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="product-name">Seguridad Pro SpA</div>
            <div class="product-sku">RUT: 78.111.222-3</div>
          </td>
          <td>Carlos Muñoz</td>
          <td>+56 9 5555 6666</td>
          <td>info@seguridadpro.cl</td>
          <td>Seguridad</td>
          <td><span class="badge green">Activo</span></td>
          <td>
            <div class="action-btns">
              <button class="btn-action blue" title="Ver detalle">👁</button>
              <button class="btn-action amber" title="Editar">✏️</button>
              <button class="btn-action red" title="Eliminar">🗑</button>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="product-name">Eléctrica Norte S.A.</div>
            <div class="product-sku">RUT: 79.333.444-5</div>
          </td>
          <td>Rosa Díaz</td>
          <td>+56 9 4444 3333</td>
          <td>rosa@electricanorte.cl</td>
          <td>Electricidad</td>
          <td><span class="badge red">Inactivo</span></td>
          <td>
            <div class="action-btns">
              <button class="btn-action blue" title="Ver detalle">👁</button>
              <button class="btn-action amber" title="Editar">✏️</button>
              <button class="btn-action red" title="Eliminar">🗑</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>`,
    reportes: `
  <!-- Tarjetas de resumen -->
  <div class="stats-grid">

    <div class="stat-card">
      <div class="stat-card-icon blue">📥</div>
      <div class="stat-card-info">
        <div class="stat-card-num">87</div>
        <div class="stat-card-label">Entradas este mes</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-card-icon red">📤</div>
      <div class="stat-card-info">
        <div class="stat-card-num">142</div>
        <div class="stat-card-label">Salidas este mes</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-card-icon green">💰</div>
      <div class="stat-card-info">
        <div class="stat-card-num">$1.2M</div>
        <div class="stat-card-label">Valor en inventario</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-card-icon amber">📊</div>
      <div class="stat-card-info">
        <div class="stat-card-num">38</div>
        <div class="stat-card-label">Movimientos totales</div>
      </div>
    </div>

  </div>

  <!-- Opciones de reporte -->
  <div class="section-card">
    <div class="section-card-header">
      <div class="section-card-title">Generar reportes</div>
    </div>
    <div class="reports-grid">

      <div class="report-item">
        <div class="report-item-icon">📦</div>
        <div class="report-item-info">
          <div class="report-item-title">Inventario completo</div>
          <div class="report-item-desc">Lista de todos los productos con stock actual y valorización</div>
        </div>
        <button class="btn-report">⬇ Exportar PDF</button>
      </div>

      <div class="report-item">
        <div class="report-item-icon">🔄</div>
        <div class="report-item-info">
          <div class="report-item-title">Movimientos del mes</div>
          <div class="report-item-desc">Historial completo de entradas y salidas del período</div>
        </div>
        <button class="btn-report">⬇ Exportar PDF</button>
      </div>

      <div class="report-item">
        <div class="report-item-icon">🚨</div>
        <div class="report-item-info">
          <div class="report-item-title">Alertas de stock</div>
          <div class="report-item-desc">Productos bajo el stock mínimo que requieren reposición</div>
        </div>
        <button class="btn-report">⬇ Exportar PDF</button>
      </div>

      <div class="report-item">
        <div class="report-item-icon">🏭</div>
        <div class="report-item-info">
          <div class="report-item-title">Compras por proveedor</div>
          <div class="report-item-desc">Resumen de entradas agrupadas por proveedor</div>
        </div>
        <button class="btn-report">⬇ Exportar PDF</button>
      </div>

    </div>
  </div>`,
    usuarios: `
  <!-- Barra de acciones -->
  <div class="module-toolbar">
    <div class="toolbar-search">
      <span class="toolbar-search-icon">🔍</span>
      <input type="text" class="toolbar-search-input" placeholder="Buscar usuario...">
    </div>
    <div class="toolbar-filters">
      <select class="toolbar-select">
        <option value="">Todos los roles</option>
        <option>Administrador</option>
        <option>Supervisor</option>
        <option>Vendedor</option>
      </select>
    </div>
  </div>

  <!-- Tabla de usuarios -->
  <div class="section-card">
    <div class="section-card-header">
      <div class="section-card-title">Gestión de usuarios</div>
      <span class="badge blue">3 usuarios</span>
    </div>
    <table class="data-table">
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Último acceso</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div class="user-cell">
              <div class="user-avatar blue">F</div>
              <div>
                <div class="product-name">Francisco Silva</div>
                <div class="product-sku">Propietario</div>
              </div>
            </div>
          </td>
          <td>francisco@stock.cl</td>
          <td><span class="badge blue">Administrador</span></td>
          <td>Hoy 11:30</td>
          <td><span class="badge green">Activo</span></td>
          <td>
            <div class="action-btns">
              <button class="btn-action amber" title="Editar">✏️</button>
              <button class="btn-action blue" title="Permisos">🔑</button>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="user-cell">
              <div class="user-avatar green">M</div>
              <div>
                <div class="product-name">María González</div>
                <div class="product-sku">Empleada</div>
              </div>
            </div>
          </td>
          <td>maria@stock.cl</td>
          <td><span class="badge amber">Vendedor</span></td>
          <td>Hoy 10:15</td>
          <td><span class="badge green">Activo</span></td>
          <td>
            <div class="action-btns">
              <button class="btn-action amber" title="Editar">✏️</button>
              <button class="btn-action blue" title="Permisos">🔑</button>
              <button class="btn-action red" title="Eliminar">🗑</button>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="user-cell">
              <div class="user-avatar amber">C</div>
              <div>
                <div class="product-name">Carlos Muñoz</div>
                <div class="product-sku">Empleado</div>
              </div>
            </div>
          </td>
          <td>carlos@stock.cl</td>
          <td><span class="badge green">Supervisor</span></td>
          <td>Ayer 17:00</td>
          <td><span class="badge red">Inactivo</span></td>
          <td>
            <div class="action-btns">
              <button class="btn-action amber" title="Editar">✏️</button>
              <button class="btn-action blue" title="Permisos">🔑</button>
              <button class="btn-action red" title="Eliminar">🗑</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>`,
  };

  mainBody.innerHTML = contenidos[seccion] || '';

  // Carga datos reales según la sección activa
if (seccion === 'dashboard') cargarResumenDashboard();
if (seccion === 'productos') cargarProductos();
if (seccion === 'categorias') cargarCategorias();
if (seccion === 'proveedores') cargarProveedores();
if (seccion === 'movimientos') cargarMovimientos();
if (seccion === 'alertas') cargarAlertas();
if (seccion === 'reportes') cargarReportes();
if (seccion === 'usuarios') cargarUsuarios();
}

// Agrega evento click a cada item del sidebar
document.querySelectorAll('.sidebar-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const seccion = item.getAttribute('data-section');
    cambiarSeccion(seccion);
  });
});


// ============================================================
// CARGA INICIAL — muestra el dashboard al entrar
// ============================================================

cambiarSeccion('dashboard');
cargarResumenDashboard();