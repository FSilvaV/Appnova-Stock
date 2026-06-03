// ============================================================
// TOGGLE CONTRASEÑA — mostrar u ocultar el texto de la contraseña
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
// VALIDACIÓN DEL LOGIN
// Sin backend por ahora — redirige directo al dashboard
// ============================================================

const btnLogin = document.getElementById('btnLogin');
const emailInput = document.getElementById('email');
const loginError = document.getElementById('loginError');

btnLogin.addEventListener('click', () => {

  const email = emailInput.value.trim();
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

  window.location.href = 'dashboard.html';

});


// ============================================================
// OCULTAR ERROR al empezar a escribir de nuevo
// ============================================================

emailInput.addEventListener('input', () => {
  loginError.style.display = 'none';
});

passwordInput.addEventListener('input', () => {
  loginError.style.display = 'none';
});