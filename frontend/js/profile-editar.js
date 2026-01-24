const BACKEND_URL = window.location.hostname === "localhost" 
    ? "http://localhost:3001" 
    : "https://dreamlog-5k3h.onrender.com"; 
//Validacion del nombre
const nombreInput = document.getElementById('nombre-input');
const iconoValidacion = document.getElementById('icon-validacion'); 
const mensajeValidacion = document.getElementById('mensaje-validacion');
const foto = document.getElementById('foto-input');

mensajeValidacion.textContent = '';
iconoValidacion.innerHTML = '';
nombreInput.classList.remove('is-success', 'is-danger');

function getUserId() {
    const textoGuardado = localStorage.getItem("loggedUser");
    const usuarioLogueado = JSON.parse(textoGuardado);
    if (usuarioLogueado) {
        return usuarioLogueado.user_id;
    } else {
        return null;
    }
}


async function verificarNombre(nombre) {
   if (nombre.length === 0) {
    nombreInput.classList.remove('is-danger', 'is-success');
    mensajeValidacion.textContent = '';
    mensajeValidacion.className = 'help is-success';
    iconoValidacion.innerHTML = '';
    return;
    }
    
    if (nombre.length < 4) {
    nombreInput.classList.remove('is-success');
    nombreInput.classList.add('is-danger')
    mensajeValidacion.textContent = 'El nombre es muy corto (minimo 4 letras)';
    mensajeValidacion.className = 'help is-danger';
    iconoValidacion.innerHTML = '<i class="fa-solid fa-skull"></i>';
    return;
    }

    // Mostrar loading
    iconoValidacion.innerHTML = '<i class="fas fa-spinner fa-pulse"></i>';
    mensajeValidacion.textContent = 'Verificando...';
    mensajeValidacion.className = 'help';

    try {
      const user_id = getUserId();
      
      // LLAMAR AL BACKEND para verificar en la base de datos
      const response = await fetch(`${BACKEND_URL}/api/username/${nombre}/${user_id}`);
      const resultado = await response.json();

      if  (resultado.disponible) { 
        nombreInput.classList.remove('is-danger');
        nombreInput.classList.add('is-success');
        iconoValidacion.innerHTML = '<i class="fas fa-check"></i>';
        mensajeValidacion.className = 'help is-success';
        mensajeValidacion.textContent = '¡El nombre está libre!';
      } 
      else {
        nombreInput.classList.remove('is-success');
        nombreInput.classList.add('is-danger');
        iconoValidacion.innerHTML = '<i class="fas fa-times"></i>';
        mensajeValidacion.className = 'help is-danger';
        mensajeValidacion.textContent = 'Este nombre ya está en uso';
      }
    } catch (error) {
      console.error('Error:', error);
      nombreInput.classList.remove('is-success', 'is-danger');
      iconoValidacion.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
      mensajeValidacion.className = 'help is-danger';
      mensajeValidacion.textContent = 'Error al verificar el nombre';
      }
}

let timeout;
  nombreInput.addEventListener('input', function() {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        verificarNombre(this.value);
      }, 500);
});


// Validacion de la Contraseña
const contraInput = document.getElementById('contraseña-input');
const iconValida = document.getElementById('icon-contra');  
const mensajeValidar = document.getElementById('mensaje-rechazo');

iconValida.innerHTML = '';
contraInput.classList.remove('is-success', 'is-danger');
mensajeValidar.textContent = '';

contraInput.addEventListener('input', function() {
  const contraseña = this.value;
  
  if (contraseña.length === 0) {
    contraInput.classList.remove('is-success', 'is-danger');
    iconValida.innerHTML = '';
    mensajeValidar.textContent = '';
    mensajeValidar.className = 'help';
    return;
  }
  
  const tieneMayuscula = /[A-Z]/.test(contraseña);  
  const tieneMinuscula = /[a-z]/.test(contraseña);  
  const tieneNumero = /[0-9]/.test(contraseña);     
  const tieneEspecial = /[^a-zA-Z0-9]/.test(contraseña);  
  const largoCorrecto = contraseña.length >= 8;
  
  if (largoCorrecto && tieneMayuscula && tieneMinuscula && tieneNumero && tieneEspecial) { 
    contraInput.classList.remove('is-danger');
    contraInput.classList.add('is-success');
    iconValida.innerHTML = '<i class="fa-solid fa-face-smile-beam"></i>';
    mensajeValidar.className = 'help is-success';
    mensajeValidar.textContent = '¡Contraseña segura!';
  } else {
    contraInput.classList.remove('is-success');
    contraInput.classList.add('is-danger');
    iconValida.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
    mensajeValidar.className = 'help is-danger';
    
   
    let mensajeError = 'La contraseña debe tener: ';
    const faltantes = [];
    
    if (!largoCorrecto) faltantes.push('minimo 8 caracteres');
    if (!tieneMayuscula) faltantes.push('una mayúscula');
    if (!tieneMinuscula) faltantes.push('una minúscula');
    if (!tieneNumero) faltantes.push('un número');
    if (!tieneEspecial) faltantes.push('un caracter especial (!@#$...)');
    
    mensajeError = mensajeError + faltantes.join(', ');
    mensajeValidar.textContent = mensajeError;
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

btnAceptar.addEventListener('click', cerrarModalFunc);

editarBtn.addEventListener('click', async function(event) {
    event.preventDefault() 
    const user_id = getUserId();
    const username = nombreInput.value.trim() || null;
    const password = contraInput.value.trim() || null;
    const bioValue = document.getElementById('biografia-input').value.trim();
    let bio;
    let pfp;

    if (bioValue === "") {
        bio = null; 
    } else {
        bio = bioValue; 
    }

    const pfpValue = document.getElementById('foto-input').value.trim();
    if (pfpValue === "") {
        pfp = null;  
    } else {
        pfp = pfpValue;  
    }

    console.log('Enviendo datos:', {user_id, username, password, bio, pfp});

    try {
      const response = await fetch(`${BACKEND_URL}/api/users/${user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
          bio: bio,
          pfp: pfp
        })
      });

        const data = await response.json();

        if (response.ok) {
            mostrarModal('¡Éxito! >-<', 'Datos actualizados correctamente', true);
            
          setTimeout(() => {
            window.location.href = 'profile.html';
          }, 2000);


        } else {
            mostrarModal('Error :(', data.error, false);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarModal('Error :(', 'No se pudo conectar con el servidor', false);
    }
});