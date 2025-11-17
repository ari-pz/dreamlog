//Validacion del nombre
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

//Funcionalidad Modal
const modal = document.getElementById('modal-resultado');
const modalTitulo = document.getElementById('modal-titulo');
const modalMensaje = document.getElementById('modal-mensaje');
const btnAceptar = document.getElementById('btn-aceptar');
const editarBtn = document.getElementById('editar-btn');


function mostrarModal(titulo, mensaje, esExito = true) {
  modalTitulo.textContent = titulo;
  modalMensaje.textContent = mensaje;
  modal.classList.add('is-active');  
  if (esExito) {
    btnAceptar.className = 'button is-success';
  } else {
    btnAceptar.className = 'button is-danger';
  }
}

function cerrarModalFunc() {
  modal.classList.remove('is-active');
}

// Cierro modal si toco el boton
btnAceptar.addEventListener('click', cerrarModalFunc);


editarBtn.addEventListener('click', function() {
  const nombreValido = nombreInput.classList.contains('is-success');
  const contrasenaValida = contraInput.classList.contains('is-success');
  
  if (nombreValido && contrasenaValida) {
    mostrarModal('Éxito >-<', 'Datos actualizados exitosamente.', true);
  } else {
    mostrarModal('Error :(', 'Por favor, fijate de que el nombre sea válido y la contraseña tenga al menos 8 dígitos.', false);
  }
});
