// ============================================================
// TOGGLE CONTRASEÑA — mostrar u ocultar el texto de la contraseña
// Cambia el type del input entre "password" y "text"
// ============================================================

const togglePass = document.getElementById('togglePass');
const passwordInput = document.getElementById('password');

togglePass.addEventListener('click', () => {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    togglePass.textContent = '🙈'; // ícono cambia al mostrar
  } else {
    passwordInput.type = 'password';
    togglePass.textContent = '👁'; // vuelve al ícono original
  }
});


// ============================================================
// VALIDACIÓN DEL LOGIN — verifica que los campos no estén vacíos
// En el futuro aquí irá la llamada al backend para verificar
// usuario y contraseña en la base de datos
// Según el rol retornado por BD redirigirá a dashboard con
// los permisos correspondientes (vendedor, supervisor, admin)
// ============================================================

const btnLogin = document.getElementById('btnLogin');
const emailInput = document.getElementById('email');
const loginError = document.getElementById('loginError');

btnLogin.addEventListener('click', () => {

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Validación básica: campos vacíos
  if (!email || !password) {
    loginError.style.display = 'block';
    loginError.textContent = '⚠️ Por favor completa todos los campos.';
    return;
  }

  // Validación básica: formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    loginError.style.display = 'block';
    loginError.textContent = '⚠️ Ingresa un correo electrónico válido.';
    return;
  }

  // ── SIMULACIÓN TEMPORAL ──
  // Mientras no hay backend, simulamos roles con credenciales de prueba
  // ESTO SE REEMPLAZARÁ por una llamada real a la BD con Node.js
  if (email === 'admin@stock.cl' && password === '1234') {
    window.location.href = 'dashboard.html'; // redirige al dashboard (admin)
  } else if (email === 'vendedor@stock.cl' && password === '1234') {
    window.location.href = 'dashboard.html'; // redirige al dashboard (vendedor)
  } else {
    // Credenciales incorrectas — muestra error
    loginError.style.display = 'block';
    loginError.textContent = '⚠️ Correo o contraseña incorrectos. Intenta nuevamente.';
  }

});


// ============================================================
// OCULTAR ERROR al empezar a escribir de nuevo
// Mejora la experiencia: el error desaparece cuando el usuario
// comienza a corregir sus datos
// ============================================================

emailInput.addEventListener('input', () => {
  loginError.style.display = 'none';
});

passwordInput.addEventListener('input', () => {
  loginError.style.display = 'none';
});