async function cargarMisPosts() {

    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

    if (!loggedUser) {
    document.getElementById("my-posts").innerHTML =
        "<p>No estás logueado</p>";
    return;
    }

    const USER_ID = loggedUser.user_id;

    const res = await fetch(`http://localhost:3000/api/posts/${USER_ID}`);
    const posts = await res.json();

    const container = document.getElementById("my-posts");

    // Por si el usuario no tiene posts
    if (posts.message) {
    container.innerHTML = `<p>${posts.message}</p>`;
    return;
    }

    posts.forEach(post => {
    const div = document.createElement("div");
    div.classList.add("post");

    div.innerHTML = `
        <div class="post-username">@${post.username}</div>
        <div class="post-content">${post.content}</div>
        <div class="post-date">${new Date(post.created_at).toLocaleString()}</div>
    `;

    container.appendChild(div);
    });
}

cargarMisPosts(); 



// ========== FUNCIONES DEL MODAL ==========
const modal = document.getElementById('modal-resultado');
const modalTitulo = document.getElementById('modal-titulo');
const modalMensaje = document.getElementById('modal-mensaje');
const btnAceptar = document.getElementById('btn-aceptar');
const btnCancelar = document.getElementById('btn-cancelar');

function mostrarModal(titulo, mensaje, soloAceptar = false) {
  modalTitulo.textContent = titulo;
  modalMensaje.textContent = mensaje;
  
  if (soloAceptar) {
    btnAceptar.style.display = 'inline-block';
    btnCancelar.style.display = 'none';
  } else {
    btnAceptar.style.display = 'inline-block';
    btnCancelar.style.display = 'inline-block';
  }

  modal.classList.add('is-active');
}

function cerrarModal() {
  modal.classList.remove('is-active');
}

btnCancelar.addEventListener('click', cerrarModal);



// ========== FUNCIONALIDAD BTN ELIMINAR ==========
const botonEliminar = document.getElementById('boton-eliminar');

botonEliminar.addEventListener('click', function() {
    mostrarModal(
        '⚠️ Eliminar Cuenta',
        '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción NO se puede deshacer. Se borrarán todos tus datos permanentemente.',
        false  // Mostrar ambos botones (Aceptar y Cancelar)
    );

    
    btnAceptar.onclick = async function() {
        cerrarModal();
        
        const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
        const user_id = loggedUser.user_id;
        
        console.log('Eliminando usuario:', user_id);
        
        try {
            const response = await fetch(`http://localhost:3000/api/users/${user_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            const data = await response.json();
            
            console.log('Respuesta del servidor:', data);
            
            if (response.ok) {
                mostrarModal('Que lastima que te vayas, volve pronto', 'Cuenta eliminada exitosamente. Serás redirigido al inicio.', true);
                
                btnAceptar.onclick = function() {
                    localStorage.removeItem('loggedUser');
                    window.location.href = '/login.html';
                };
                
            } else {
                mostrarModal('Error', data.error || 'No se pudo eliminar la cuenta', true);
            }
            
        } catch (error) {
            console.error('Error completo:', error);
            mostrarModal('Error', 'No se pudo conectar con el servidor', true);
        }
    };
});
