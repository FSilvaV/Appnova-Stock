// ============================================================
// TOGGLE CONTRASEÑA
// ============================================================

const togglePass = document.getElementById('togglePass');
const passwordInput = document.getElementById('password');

togglePass.addEventListener('click', () => {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    togglePass.textContent = '🙈';
  } else {
    passwordInput.type = 'password';
    togglePass.textContent = '👁';
  }
});


// ============================================================
// CREDENCIALES TEMPORALES — reemplazar por backend cuando esté listo
// ============================================================

const USUARIOS_DEMO = [
  { email: 'admin@appnova.cl', password: 'AppNova2026' },
  { email: 'demo@appnova.cl',  password: 'demo1234'    }
];


// ============================================================
// LOGIN
// ============================================================

const btnLogin    = document.getElementById('btnLogin');
const emailInput  = document.getElementById('email');
const loginError  = document.getElementById('loginError');

btnLogin.addEventListener('click', () => {

  const email    = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    loginError.style.display = 'block';
    loginError.textContent = '⚠️ Por favor completa todos los campos.';
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    loginError.style.display = 'block';
    loginError.textContent = '⚠️ Ingresa un correo electrónico válido.';
    return;
  }

  const usuario = USUARIOS_DEMO.find(u => u.email === email && u.password === password);

  if (!usuario) {
    loginError.style.display = 'block';
    loginError.textContent = '⚠️ Correo o contraseña incorrectos.';
    return;
  }

  window.location.href = 'dashboard.html';
});


// ============================================================
// OCULTAR ERROR al empezar a escribir
// ============================================================

emailInput.addEventListener('input', () => {
  loginError.style.display = 'none';
});

passwordInput.addEventListener('input', () => {
  loginError.style.display = 'none';
});