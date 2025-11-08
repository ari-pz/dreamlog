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