document.addEventListener("DOMContentLoaded", () => {
  cargarMisPosts();
});

async function cargarMisPosts() {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

  if (!loggedUser) {
    window.location.href = "/login.html";
    return;
  }

  const USER_ID = loggedUser.user_id;

  try {
    const res = await fetch(`${BACKEND_URL}/api/posts/user/${USER_ID}`);
    const posts = await res.json();
    const container = document.getElementById("posts-container");

    if (posts.message || posts.length === 0) {
      container.innerHTML = `<p style="text-align:center; color:white; margin-top:2rem;">Aún no has publicado ningún sueño.</p>`;
      return;
    }
    renderPosts(posts);

  } catch (error) {
    console.error("Error al cargar posts:", error);
    document.getElementById("posts-container").innerHTML = "<p>Error al cargar tus posts</p>";
  }
}

// ==========================================
//    LUNNAS
// ==========================================
async function CambiarLuna(icon, post_id, user_id, counter) {
  const isMooned = icon.classList.contains("fa-solid");

  if (isMooned) {
    await fetch(`${BACKEND_URL}/api/moon`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, post_id })
    });
    icon.classList.remove("fa-solid");
    icon.classList.add("fa-regular");
  } else {
    await fetch(`${BACKEND_URL}/api/moon`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, post_id })
    });
    icon.classList.remove("fa-regular");
    icon.classList.add("fa-solid");
  }

  const resCount = await fetch(`${BACKEND_URL}/api/moon/count/${post_id}`);
  const dataCount = await resCount.json();
  counter.textContent = dataCount.count;
}

async function iniciarConLunas(post_id, user_id) {
  const icon = document.querySelector(`.moon-icon[data-post-id="${post_id}"]`);
  const counter = document.querySelector(`.moon-count[data-post-id="${post_id}"]`);

  if (!icon || !counter) return;

  const resHas = await fetch(`${BACKEND_URL}/api/moon/${user_id}/${post_id}`);
  const dataHas = await resHas.json();
  const resCount = await fetch(`${BACKEND_URL}/api/moon/count/${post_id}`);
  const dataCount = await resCount.json();

  counter.textContent = dataCount.count;

  if (dataHas.hasMoon) {
    icon.classList.remove("fa-regular");
    icon.classList.add("fa-solid");
  } else {
    icon.classList.remove("fa-solid");
    icon.classList.add("fa-regular");
  }
  icon.onclick = () => CambiarLuna(icon, post_id, user_id, counter);
}

// ======
// MODAL 
//=======
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
  if(modal) {
      modal.classList.remove('is-active');
      modal.classList.remove('modal-pequeno'); 
  }
}

if(btnCancelar) btnCancelar.addEventListener('click', cerrarModal);

// ==========================================
//       COMENTARIOS 
// ==========================================
//Opciones 3 puntitos
document.addEventListener("click", (e) => {
  const menu = e.target.closest(".comment-menu"); 
  
  document.querySelectorAll(".dropdown-comment").forEach(d => {
    if (!menu || !menu.contains(d)) {
        d.style.display = "none";
    }
  });

  if (menu) {
    const dropdown = menu.querySelector(".dropdown-comment");    
    if (!dropdown) return; 
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  }
});

document.addEventListener("click", async function(evento) {
  // Abrir/Cerrar lista de comentarios
  if (evento.target.classList.contains("comment-icon") || evento.target.closest(".comment-icon")) {
    const iconoComentario = evento.target.classList.contains("comment-icon") ? evento.target : evento.target.closest(".comment-icon");
    const postId = iconoComentario.dataset.postId;
    const contenedorComentarios = document.querySelector(".comments-wrapper[data-post-id='" + postId + "']");

    if (!contenedorComentarios) return;


    if (contenedorComentarios.style.display === "block") {
      contenedorComentarios.style.display = "none";
      iconoComentario.classList.remove("fa-solid");
      iconoComentario.classList.add("fa-regular");
      return;
    }

    // Abrir
    contenedorComentarios.style.display = "block";
    iconoComentario.classList.remove("fa-regular");
    iconoComentario.classList.add("fa-solid");

    try {
      const respuesta = await fetch(`${BACKEND_URL}/api/comments/` + postId);
      if (!respuesta.ok) throw new Error("Error al obtener comentarios");

      const comentarios = await respuesta.json();
      const listaComentarios = contenedorComentarios.querySelector(".comments-list");
      
      const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
      const currentUserId = loggedUser ? loggedUser.user_id : null;

      if (Array.isArray(comentarios) && comentarios.length > 0) {
        // muestro cada comentario
        listaComentarios.innerHTML = comentarios.map(c => {
            const esMio = (c.user_id === currentUserId);
            
            return `
            <div class="comment" data-comment-id="${c.comment_id}">
                
                <div class="comment-body" style="flex: 1; display: flex; flex-direction: column;">
                    
                    <span class="comment-text"><strong>@${c.username}</strong> ${c.content}</span>
                    
                    ${ 
                       (c.url && c.url !== "null" && c.url !== "") 
                       ? `<div class="comment-image" style="margin-top: 8px;">
                            <img src="${c.url}" style="max-width: 200px; border-radius: 8px; display: block; object-fit: cover;">
                          </div>` 
                       : "" 
                     }
                </div>
                
                ${esMio ? `
                <div class="comment-menu" style="margin-left: 10px;">
                    <span class="dots" style="cursor:pointer; font-weight:bold;">...</span>
                    <div class="dropdown-comment" style="display:none; position:absolute; background:#fff; border:1px solid #ccc;">
                        <a href="#" class="edit-comment">Editar</a>
                        <a href="#" class="delete-comment">Eliminar</a>
                    </div>
                </div>
                ` : ''}
            </div>`;
        }).join("");
      } else {
        listaComentarios.innerHTML = "<div class='no-comments'>No hay comentarios aún</div>";
      }
      
      // Actualizar contador
      const contador = document.querySelector(`.comment-count[data-post-id="${postId}"]`);
      if(contador) {
        // Sumamos 1 visualmente al instante
        contador.textContent = parseInt(contador.textContent || 0) + 1;
      }

      try {
          const res = await fetch(`${BACKEND_URL}/api/comments`, { /* ... */ });
        
      } catch (e) { 
          console.error(e); 
          if(contador) contador.textContent = parseInt(contador.textContent) - 1;
          alert("Error al enviar");
      }

      const contadorComm = document.querySelector(".comment-count[data-post-id='" + postId + "']");
      if (contadorComm) contadorComm.textContent = comentarios.length;
      } catch (error) {
      console.error("Error cargando comentarios:", error);
      }
    return;
  }

  // Botón Cámara 
  if (evento.target.classList.contains("add-image-btn")) {
      const iconoCamara = evento.target;
      const wrapper = iconoCamara.closest(".add-comment");
      const inputOculto = wrapper.querySelector(".comment-image-url");

      modalTitulo.textContent = "Adjuntar Imagen";

      modalMensaje.innerHTML = `
        <p>Pegá la URL de tu imagen aquí:</p>
        <input type="text" id="modal-input-url" 
               class="modal-input-url" 
               placeholder="https://...">
      `;

      if(btnCancelar) btnCancelar.style.display = 'inline-block';

      modal.classList.add('is-active');
      setTimeout(() => {
        const inputModal = document.getElementById("modal-input-url");
        if(inputModal) {
            inputModal.focus();
            if(inputOculto.value) inputModal.value = inputOculto.value;
        }
      }, 100);

      btnAceptar.onclick = function() {
          const inputModal = document.getElementById("modal-input-url");
          const url = inputModal ? inputModal.value.trim() : "";

          if (url) {
              inputOculto.value = url;
              iconoCamara.style.color = "#a777e3"; 
              iconoCamara.classList.add("has-image");
          } else {
              inputOculto.value = "";
              iconoCamara.style.color = "#aaa"; 
              iconoCamara.classList.remove("has-image");
          }

          modal.classList.remove('is-active');
          btnAceptar.onclick = cerrarModal; 
      };
      

      return;
}

// --------------------------
  // Enviar comentario
  // --------------------------
  if (evento.target.classList.contains("add-comment-btn") || evento.target.closest(".add-comment-btn")) {
    const botonEnviar = evento.target.classList.contains("add-comment-btn") ? evento.target : evento.target.closest(".add-comment-btn");
    const contenedorComentario = botonEnviar.closest(".comments-wrapper");
    const postId = contenedorComentario.dataset.postId;
    const inputComentario = contenedorComentario.querySelector(".add-comment-input");
    const inputImagen = contenedorComentario.querySelector(".comment-image-url");
    const iconoCamara = contenedorComentario.querySelector(".add-image-btn");
    const contenido = (inputComentario.value || "").trim();
    const imagenUrl = (inputImagen.value || "").trim() || null; 
  


    if (!contenido) {
      mostrarModal(
        "Comentario Vacio", 
        "Escribí un comentario antes de enviar", 
        false
      );
      return;
    }

    const usuarioLogueado = JSON.parse(localStorage.getItem("loggedUser"));
    if (!usuarioLogueado) {
      alert("Tenés que estar logueado para comentar.");
      return;
    }

    try {
      const respuesta = await fetch(`${BACKEND_URL}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: usuarioLogueado.user_id,
          post_id: parseInt(postId),
          content: contenido,
          url: imagenUrl
        })
      });

      if (!respuesta.ok) throw new Error("Error enviando comentario");
      
      const nuevoComentario = await respuesta.json(); 

      const htmlNuevoComentario = `
        <div class='comment' data-comment-id='${nuevoComentario.comment_id}'> 
           <div class="comment-body" style="flex: 1; display: flex; flex-direction: column;">
                <span class="comment-text"><strong>@${usuarioLogueado.username}</strong> ${contenido}</span>
                ${ 
                   (imagenUrl) 
                   ? `<div class="comment-image" style="margin-top: 8px;">
                        <img src="${imagenUrl}" style="max-width: 200px; border-radius: 8px; display: block; object-fit: cover;">
                      </div>` 
                   : ""
                 }

           </div>

           <div class="comment-menu">
               <span class="dots" style="cursor:pointer; font-weight:bold;">...</span>
               <div class="dropdown-comment" style="display:none; position:absolute; background:#fff; border:1px solid #ccc;">
                   <a href="#" class="edit-comment">Editar</a>
                   <a href="#" class="delete-comment">Eliminar</a>
               </div>
           </div>
        </div>
      `;
      
      const listaComentarios = contenedorComentario.querySelector(".comments-list");
      
      // Si dice "no hay comentarios", lo borramos
      const noCommentsMsg = listaComentarios.querySelector(".no-comments");
      if(noCommentsMsg) noCommentsMsg.remove();

      listaComentarios.insertAdjacentHTML("beforeend", htmlNuevoComentario);

      inputComentario.value = "";
      inputImagen.value = "";
      iconoCamara.style.color = "#aaa"; 

      const spanContador = document.querySelector(".comment-count[data-post-id='" + postId + "']");
      if (spanContador) {
        let count = parseInt(spanContador.textContent || "0");
        spanContador.textContent = count + 1;
      }

    } catch (error) {
      console.error(error);
      alert("Error al enviar comentario.");
    }
    return;
  }
});

// Btn Eliminar / Editar
document.addEventListener("click", async (evento) => {
  const editar = evento.target.closest(".edit-comment");
  const eliminar = evento.target.closest(".delete-comment");

  if (editar) {
    evento.preventDefault();
    const comentarioDiv = editar.closest(".comment");
    const commentId = comentarioDiv.dataset.commentId;
    
    const spanTexto = comentarioDiv.querySelector(".comment-text");
    const textoCompleto = spanTexto.innerText; 
    const textoLimpio = textoCompleto.replace(/^@\S+\s/, ""); 

    localStorage.setItem("edit_comment_id", commentId);
    localStorage.setItem("edit_comment_content", textoLimpio);

    window.location.href = "/edit-comment.html";
    return;
  }
  

  if (eliminar) {
    evento.preventDefault();
    
    const comentarioDiv = eliminar.closest(".comment");
    const commentId = comentarioDiv.dataset.commentId;
    const wrapper = comentarioDiv.closest(".comments-wrapper");
    const postId = wrapper.dataset.postId;
    const contador = document.querySelector(`.comment-count[data-post-id="${postId}"]`);
    
    mostrarModal(
        "Eliminar Comentario", 
        "¿Estás Seguro? No hay vuelta atrás...", 
        false
    );

    if(btnAceptar) {
        btnAceptar.onclick = async function() {
            cerrarModal();

            comentarioDiv.remove();

            if (contador) {
                let numeroActual = parseInt(contador.textContent || 0);
                contador.textContent = Math.max(0, numeroActual - 1);
            }

            try {
                await fetch(`${BACKEND_URL}/api/comments/${commentId}`, {method:"DELETE"});
            } catch (err) {
                console.error(err);
            }
        };
    }
  }
});


// agregar comentario con enter
document.addEventListener("keydown", function(evento) {
    if (evento.key === "Enter" && evento.target.classList.contains("add-comment-input")) {
        evento.preventDefault(); 
        const wrapper = evento.target.closest(".comments-wrapper");
        const btn = wrapper.querySelector(".add-comment-btn");
        if (btn) btn.click();
    }
});


// ==========================================
//  ELIMINAR CUENTA 
// ==========================================
const botonEliminar = document.getElementById('boton-eliminar');
if(botonEliminar) {
    botonEliminar.addEventListener('click', function() {
        mostrarModal(
            'Eliminar Cuenta',
            '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción NO se puede deshacer.',
            false
        );

        btnAceptar.onclick = async function() {
            cerrarModal();
            const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
            if(!loggedUser) return;

            try {
                const response = await fetch(`${BACKEND_URL}/api/users/${loggedUser.user_id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                if (response.ok) {
                    mostrarModal('Adiós', 'Cuenta eliminada exitosamente.', true);
                    btnAceptar.onclick = function() {
                        localStorage.removeItem('loggedUser');
                        window.location.href = '/login.html';
                    };
                } else {
                    mostrarModal('Error', 'No se pudo eliminar la cuenta', true);
                }
            } catch (error) {
                mostrarModal('Error', 'Error de conexión', true);
            }
        };
    });
}
