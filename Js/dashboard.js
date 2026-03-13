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
    productos: `<div style="padding:1rem;color:var(--muted)">Módulo Productos — próximamente</div>`,
    movimientos: `<div style="padding:1rem;color:var(--muted)">Módulo Movimientos — próximamente</div>`,
    alertas: `<div style="padding:1rem;color:var(--muted)">Módulo Alertas — próximamente</div>`,
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