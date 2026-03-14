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

btnLogin.addEventListener('click', async () => {

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
 // ── LLAMADA REAL A LA API ──
// Envía las credenciales al backend y espera respuesta
try {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (response.ok) {
    // Guarda el usuario y rol en localStorage
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    window.location.href = 'dashboard.html';
  } else {
    loginError.style.display = 'block';
    loginError.textContent = '⚠️ ' + data.error;
  }
} catch (error) {
  loginError.style.display = 'block';
  loginError.textContent = '⚠️ Error conectando con el servidor.';
}

// ── LLAMADA REAL A LA API ──
try {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    window.location.href = 'dashboard.html';
  } else {
    loginError.style.display = 'block';
    loginError.textContent = '⚠️ ' + data.error;
  }
} catch (error) {
  loginError.style.display = 'block';
  loginError.textContent = '⚠️ Error conectando con el servidor.';
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