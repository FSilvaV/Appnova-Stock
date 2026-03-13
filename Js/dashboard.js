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
  mainBody.innerHTML = `
    <div style="padding:2rem;color:var(--muted);font-size:0.9rem">
      Contenido de <strong>${config.titulo}</strong> — próximamente
    </div>
  `;
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