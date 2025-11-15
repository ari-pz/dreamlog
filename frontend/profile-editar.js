//Validacion del nombre de usuario
const nombreInput = document.getElementById('nombre-input');
const iconoValidacion = document.getElementById('icon-validacion'); 
const mensajeValidacion = document.getElementById('mensaje-validacion');

mensajeValidacion.textContent = '';
iconoValidacion.innerHTML = '';
nombreInput.classList.remove('is-success', 'is-danger');

function verificarNombre(nombre) {
  if (nombre.length === 0) {
    nombreInput.classList.remove('is-success', 'is-danger');
    iconoValidacion.innerHTML = '';
    mensajeValidacion.textContent = '';
    mensajeValidacion.className = 'help';
    return;
  }
  
  if (nombre.length < 4) {
    nombreInput.classList.remove('is-success');
    nombreInput.classList.add('is-danger');
    mensajeValidacion.textContent = 'El nombre es muy corto (mínimo 4 letras)';
    mensajeValidacion.className = 'help is-danger';
    iconoValidacion.innerHTML = '<i class="fa-solid fa-skull"></i>';
  } 
  else {
    nombreInput.classList.remove('is-danger');
    nombreInput.classList.add('is-success');
    iconoValidacion.innerHTML = '<i class="fas fa-check"></i>';
    mensajeValidacion.className = 'help is-success';
    mensajeValidacion.textContent = 'Nombre válido :)';
  }
}

let temporizador; 
nombreInput.addEventListener('input', function() {
  clearTimeout(temporizador);
  
  temporizador = setTimeout(() => {
    verificarNombre(this.value);
  }, 300);
});


// Validacion de la Contraseña
const contraInput = document.getElementById('contraseña-input');
const iconValida = document.getElementById('icon-contra');  
const mensajeValidar = document.getElementById('mensaje-rechazo');

iconValida.innerHTML = '';
contraInput.classList.remove('is-success', 'is-danger');
mensajeValidar.textContent = '';

contraInput.addEventListener('input', function() {
  const password = this.value;
  
  if (password.length === 0) {
    contraInput.classList.remove('is-success', 'is-danger');
    iconValida.innerHTML = '';
    mensajeValidar.textContent = '';
    mensajeValidar.className = 'help';
    return;
  }
  
  if (password.length >= 8) {
    contraInput.classList.remove('is-danger');
    contraInput.classList.add('is-success');
    iconValida.innerHTML = '<i class="fa-solid fa-face-smile-beam"></i>';
    mensajeValidar.className = 'help is-success';
    mensajeValidar.textContent = '¡Contraseña válida!';
  } else {
    contraInput.classList.remove('is-success');
    contraInput.classList.add('is-danger');
    iconValida.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
    mensajeValidar.className = 'help is-danger';
    mensajeValidar.textContent = 'La contraseña debe tener al menos 8 caracteres';
  }
});