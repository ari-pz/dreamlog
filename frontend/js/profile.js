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
    const res = await fetch(`/api/posts/user/${USER_ID}`);
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

  const resCount = await fetch(`/api/moon/count/${post_id}`);
  const dataCount = await resCount.json();
  counter.textContent = dataCount.count;
}

async function iniciarConLunas(post_id, user_id) {
  const icon = document.querySelector(`.moon-icon[data-post-id="${post_id}"]`);
  const counter = document.querySelector(`.moon-count[data-post-id="${post_id}"]`);

  if (!icon || !counter) return;

  const resHas = await fetch(`/api/moon/${user_id}/${post_id}`);
  const dataHas = await resHas.json();
  const resCount = await fetch(`/api/moon/count/${post_id}`);
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


// ==========================================
//       COMENTARIOS 
// ==========================================
document.addEventListener("click", async function(evento) {

    // Abrir/Cerrar lista de comentarios
    if (evento.target.classList.contains("comment-icon") || evento.target.closest(".comment-icon")) {
      const icono = evento.target.classList.contains("comment-icon") ? evento.target : evento.target.closest(".comment-icon");
      const postId = icono.dataset.postId;
      const wrapper = document.querySelector(`.comments-wrapper[data-post-id="${postId}"]`);
      
      if (!wrapper) return;
  
      if (wrapper.style.display === "block") {
        wrapper.style.display = "none";
        icono.classList.remove("fa-solid");
        icono.classList.add("fa-regular");
      } else {
        wrapper.style.display = "block";
        icono.classList.remove("fa-regular");
        icono.classList.add("fa-solid");
        
      }
      return;
    }
  

    if (evento.target.classList.contains("add-comment-btn")) {
      const btn = evento.target;
      const wrapper = btn.closest(".comments-wrapper");
      const postId = wrapper.dataset.postId;
      const input = wrapper.querySelector(".add-comment-input");
      const content = input.value.trim();
      const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  
      if (!content) return;
  
      try {
        const res = await fetch("/api/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: loggedUser.user_id, post_id: postId, content: content })
        });
        const newComment = await res.json();
  
        
        const lista = wrapper.querySelector(".comments-list");
        lista.insertAdjacentHTML("beforeend", `
          <div class="comment" data-comment-id="${newComment.comment_id}">
             <span class="comment-text"><strong>@${loggedUser.username}</strong> ${content}</span>
             <div class="comment-menu"><span class="dots">...</span></div>
          </div>
        `);
        input.value = "";
        
        // Actualizar contador
        const contadorComm = document.querySelector(`.comment-count[data-post-id="${postId}"]`);
        if(contadorComm) contadorComm.textContent = parseInt(contadorComm.textContent || 0) + 1;
  
      } catch (e) { console.error(e); }
    }
    
    // Abrir desplegable
    if (evento.target.closest(".comment-menu")) {
        const menu = evento.target.closest(".comment-menu");
        const dropdown = menu.querySelector(".dropdown-comment");
        
       
        document.querySelectorAll(".dropdown-comment").forEach(d => {
            if(d !== dropdown) d.style.display = 'none';
        });

        if(dropdown) {
            dropdown.style.display = (dropdown.style.display === "block") ? "none" : "block";
        }
    }

    // eliminar comentarios
    const eliminar = evento.target.closest(".delete-comment"); 
    if (eliminar) {
      evento.preventDefault();
      
      const comentarioDiv = eliminar.closest(".comment");
      const commentId = comentarioDiv.dataset.commentId;
      const wrapper = comentarioDiv.closest(".comments-wrapper");
      const postId = wrapper.dataset.postId;
      const contador = document.querySelector(`.comment-count[data-post-id="${postId}"]`);

      if(modal) modal.classList.add('modal-pequeno')
      mostrarModal(
          "Eliminar Comentario", 
          "¿Estás seguro? No hay vuelta atrás.", 
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
                  await fetch(`/api/comments/${commentId}`, {method:"DELETE"});
              } catch (err) {
                  console.error(err);
              }
          };
      }
    }
      
    


    //editar 
    const editar = evento.target.closest(".edit-comment");
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
const modal = document.getElementById('modal-resultado');
const modalTitulo = document.getElementById('modal-titulo');
const modalMensaje = document.getElementById('modal-mensaje');
const btnAceptar = document.getElementById('btn-aceptar');
const btnCancelar = document.getElementById('btn-cancelar');
const botonEliminar = document.getElementById('boton-eliminar');

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

if(botonEliminar) {
    botonEliminar.addEventListener('click', function() {
        mostrarModal(
            '⚠️ Eliminar Cuenta',
            '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción NO se puede deshacer.',
            false
        );

        btnAceptar.onclick = async function() {
            cerrarModal();
            const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
            if(!loggedUser) return;

            try {
                const response = await fetch(`http://localhost:3000/api/users/${loggedUser.user_id}`, {
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
