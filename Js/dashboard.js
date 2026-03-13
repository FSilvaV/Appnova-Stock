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
const mainBody = document.getElementById('mainBody');

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
    categorias: `<div style="padding:1rem;color:var(--muted)">Módulo Categorías — próximamente</div>`,
    proveedores: `<div style="padding:1rem;color:var(--muted)">Módulo Proveedores — próximamente</div>`,
    reportes: `<div style="padding:1rem;color:var(--muted)">Módulo Reportes — próximamente</div>`,
    usuarios: `<div style="padding:1rem;color:var(--muted)">Módulo Usuarios — próximamente</div>`
  };

  mainBody.innerHTML = contenidos[seccion] || '';
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