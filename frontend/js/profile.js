//POSTS del Usuario 
async function cargarMisPosts() {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

  if (!loggedUser) {
    document.getElementById("my-posts").innerHTML =
      "<p>No estás logueado</p>";
    return;
  }

  const USER_ID = loggedUser.user_id;

  try {
    const res = await fetch(`/api/posts/${USER_ID}`);
    const posts = await res.json();

    const container = document.getElementById("posts-container");

    if (posts.message || posts.length === 0) {
      container.innerHTML = `<p>${posts.message || "No tienes posts aún"}</p>`;
      return;
    }

    container.innerHTML = ""; 

    for (const post of posts) {
      const div = document.createElement("div");
      div.classList.add("post");

      const isOwner = post.user_id === USER_ID;

      div.innerHTML = `
        <div class="post-header">
          <div class="post-user">
            <img src="${post.pfp}" class="pfp">
            <span class="username">@${post.username}</span>
          </div>

          <div class="menu">
            <span class="dots">...</span>
            <div class="dropdown">
              ${
                isOwner
                  ? `<a href="#">Editar Sueño</a>
                     <a href="#" class="style-red">Eliminar Sueño</a>`
                  : `<a href="#" class="style-red">Reportar Sueño</a>
                     <a href="#" class="style-red">Bloquear Usuario</a>`
              }
            </div>
          </div>
        </div>

        <div class="post-content">${post.content}</div>
        ${post.image ? `<img src="${post.image}" class="post-img">` : ""}

        <div class="post-footer">
          <span class="category">${post.category_name || ""}</span>
          <i class="fa-regular fa-moon moon-icon"
             data-post-id="${post.post_id}"
             style="cursor:pointer;"></i>
          <span class="moon-count" data-post-id="${post.post_id}"></span>
          <span>0 COMENTARIOS</span>
        </div>
      `;

      container.appendChild(div);

      // Inicializar estado de luna y contador
      await iniciarConLunas(post.post_id, USER_ID);
    }

  } catch (error) {
    console.error("Error al cargar posts:", error);
    document.getElementById("my-posts").innerHTML = "<p>Error al cargar tus posts</p>";
  }
}


async function CambiarLuna(icon, post_id, user_id, counter) {
  const isMooned = icon.classList.contains("fa-solid");

  if (isMooned) {
    await fetch("/api/moon", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, post_id })
    });

    icon.classList.remove("fa-solid");
    icon.classList.add("fa-regular");
  } else {
    await fetch("/api/moon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, post_id })
    });

    icon.classList.remove("fa-regular");
    icon.classList.add("fa-solid");
  }

  // Actualizar contador
  const resCount = await fetch(`/api/moon/count/${post_id}`);
  const dataCount = await resCount.json();
  counter.textContent = dataCount.count;
}

async function iniciarConLunas(post_id, user_id) {
  const icon = document.querySelector(`.moon-icon[data-post-id="${post_id}"]`);
  const counter = document.querySelector(`.moon-count[data-post-id="${post_id}"]`);

  if (!icon || !counter) return;

  // Traer si el user ya dio luna
  const resHas = await fetch(`/api/moon/${user_id}/${post_id}`);
  const dataHas = await resHas.json();

  // Traer contador
  const resCount = await fetch(`/api/moon/count/${post_id}`);
  const dataCount = await resCount.json();

  // Setear contador
  counter.textContent = dataCount.count;

  if (dataHas.hasMoon) {
    icon.classList.remove("fa-regular");
    icon.classList.add("fa-solid");
  } else {
    icon.classList.remove("fa-solid");
    icon.classList.add("fa-regular");
  }

  // Agregar click para togglear la luna
  icon.onclick = () => CambiarLuna(icon, post_id, user_id, counter);
}


document.addEventListener("DOMContentLoaded", () => {
  cargarMisPosts();
});



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
