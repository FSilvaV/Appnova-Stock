/* ═══════════════════════════════════════════════════════
   AppNova Solutions — main.js
   ═══════════════════════════════════════════════════════ */

/* ── 1. Modo oscuro / claro ─────────────────────────── */
const root       = document.documentElement;
const themeBtn   = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('appnova-theme');

if (savedTheme) {
  root.setAttribute('data-theme', savedTheme);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  root.setAttribute('data-theme', 'dark');
}

themeBtn.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('appnova-theme', next);
});

/* ── 2. Scroll reveal ───────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── 3. Dashboard animado (hero) ────────────────────── */
const dashboardRows = [
  ['Aceite 1L',        '18', '$3.490', true],
  ['Arroz 1kg',        '55', '$1.290', true],
  ['Detergente',        '6', '$5.990', false],
  ['Escoba',            '3', '$4.500', false],
  ['Papel higiénico',  '80', '$2.990', true],
  ['Azúcar 1kg',       '40', '$1.490', true],
];

let rowIndex = 0;
const tbody  = document.getElementById('dp-tbody');

function rotateDashboardRow() {
  const row    = dashboardRows[rowIndex % dashboardRows.length];
  rowIndex++;

  const statusBadge = row[3]
    ? '<span class="badge badge--ok">Ok</span>'
    : '<span class="badge badge--low">Bajo</span>';

  const firstRow = tbody.querySelector('tr');
  if (firstRow) firstRow.remove();

  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>${row[0]}</td>
    <td>${row[1]}</td>
    <td>${row[2]}</td>
    <td>${statusBadge}</td>
  `;
  newRow.classList.add('highlight-new');
  tbody.appendChild(newRow);
}

setInterval(rotateDashboardRow, 2800);

/* ── 4. Formulario de contacto ──────────────────────── */
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async e => {
  e.preventDefault();

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  submitBtn.textContent = 'Enviando...';
  submitBtn.disabled = true;

  const formData = new FormData(contactForm);

  const res = await fetch('https://formspree.io/f/mykqjrok', {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' }
  });

  if (res.ok) {
    submitBtn.textContent = '✓ Mensaje enviado';
    submitBtn.style.background = '#16A34A';
    contactForm.reset();
  } else {
    submitBtn.textContent = '✗ Error al enviar';
    submitBtn.style.background = '#DC2626';
    submitBtn.disabled = false;
  }
});