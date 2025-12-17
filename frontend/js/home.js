// 1. Obtener usuario logueado
const loggedUser = JSON.parse(localStorage.getItem("loggedUser")) || null;
const currentUserId = loggedUser?.user_id || null;

async function loadPosts() {
    const posts = await fetch('/api/posts').then(res => res.json());
    renderPosts(posts, currentUserId); 
}
loadPosts();



const frases = [
      "Explorá tus símbolos nocturnos…",
      "Buscá tus sueños o señales ocultas…",
      "Descubrí patrones en tus noches…",
      "Cada búsqueda es un viaje dentro de tu mente…",
      "¿Qué misterios te visitaron hoy?"
    ];
const input = document.getElementById("search-input");
let fraseIndex = 0;
let typingActive = true;
let userStartedTyping = false; // nuevo flag

// Si el usuario empieza a escribir, se pausa definitivamente el efecto
input.addEventListener("input", () => {
    if (input.value.trim() !== "") {
    userStartedTyping = true;
    typingActive = false;
    input.style.setProperty("--placeholder-opacity", 1);
    input.placeholder = ""; 
    }
});

// Función para escribir letra por letra
function escribirFrase(frase, i = 0) {
    if (!typingActive || userStartedTyping) return;

    input.style.setProperty("--placeholder-opacity", 1);

    if (i <= frase.length) {
    input.placeholder = frase.substring(0, i);
    setTimeout(() => escribirFrase(frase, i + 1), 100);
    } else {
    setTimeout(() => puffDesaparecer(), 3000);
    }
}
// Efecto de desvanecimiento
function puffDesaparecer() {
    if (!typingActive || userStartedTyping) return;
    let opacity = 1;
    const step = 0.05;
    const fade = setInterval(() => {
    opacity -= step;
    input.style.setProperty("--placeholder-opacity", opacity);
    if (opacity <= 0) {
        clearInterval(fade);
        input.placeholder = "";
        fraseIndex = (fraseIndex + 1) % frases.length;
        setTimeout(() => escribirFrase(frases[fraseIndex]), 500);
    }
    }, 60);
}
// Iniciar animación
escribirFrase(frases[fraseIndex]);

// ====== FUNCIONALIDAD BARRA DE BUSQUEDA ====== // 
const searchInput = document.getElementById('search-input');
const categoriasValidas = ['pesadilla', 'absurdo', 'lucido', 'sensorial', 'recurrente', 'inquietante'];

async function buscarPorCategoria(categoria) {
    categoria = categoria.trim().toLowerCase();
    
    // Verificar si la categoría existe
    if (!categoriasValidas.includes(categoria)) {
        mostrarMensaje('No existe la categoría que estás buscando');
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:3000/api/posts/categories/${categoria}`);
        const data = await response.json();
        
        if (data.message || data.length === 0) {
            mostrarMensaje(`No hay posts en la categoría "${categoria}"`);
            return;
        }
        
        renderPosts(data);
        
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error al buscar posts');
    }
}

// Función para cargar todos los posts (cuando no hay búsqueda)
async function cargarTodosLosPosts() {
    try {
        const response = await fetch('http://localhost:3000/api/posts');
        const posts = await response.json();
        
        if (posts.message || posts.length === 0) {
            mostrarMensaje('No hay posts aún');
            return;
        }
        
        renderPosts(posts);
        
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error al cargar posts');
    }
}

// Fc Mostrar mensajes de error
function mostrarMensaje(mensaje) {
    const container = document.getElementById('posts-container');
    container.innerHTML = `<p class="mensaje-busqueda">${mensaje}</p>`;
}

// Event listener - buscar al presionar Enter
searchInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const query = this.value.trim();
        
        if (query === '') {
            cargarTodosLosPosts();
            return;
        }
        
        buscarPorCategoria(query);
    }
});

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
    // DAR LUNA
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

  // Agregar el evento click para cambiar las lunas
  icon.onclick = () => CambiarLuna(icon, post_id, user_id, counter);
}

// ==========================================
// COMENTARIOS
// ==========================================
// Abrir/Cerrar desplegable
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

//Modal
const modal = document.getElementById('modal-resultado');
const modalTitulo = document.getElementById('modal-titulo');
const modalMensaje = document.getElementById('modal-mensaje');
const btnAceptar = document.getElementById('btn-aceptar');
const btnCancelar = document.getElementById('btn-cancelar');

function mostrarModal(titulo, mensaje, soloAceptar = false) {
  if (modalTitulo) modalTitulo.textContent = titulo;
  if (modalMensaje) modalMensaje.textContent = mensaje;
  
  if (soloAceptar) {
    if(btnAceptar) btnAceptar.style.display = 'inline-block';
    if(btnCancelar) btnCancelar.style.display = 'none';
  } else {
    if(btnAceptar) btnAceptar.style.display = 'inline-block';
    if(btnCancelar) btnCancelar.style.display = 'inline-block';
  }
  if(modal) modal.classList.add('is-active');
}

function cerrarModal() {
  if(modal) modal.classList.remove('is-active');
}

if(btnCancelar) btnCancelar.addEventListener('click', cerrarModal);

// EDITAR Y ELIMINAR 
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
                await fetch(`/api/comments/${commentId}`, {method:"DELETE"});
            } catch (err) {
                console.error(err);
            }
        };
    }
  }
});

document.addEventListener("keydown", function(evento) {
    if (evento.key === "Enter" && evento.target.classList.contains("add-comment-input")) {        
        evento.preventDefault(); 
        const wrapper = evento.target.closest(".comments-wrapper");
        const btn = wrapper.querySelector(".add-comment-btn");
        if (btn) btn.click();
    }
});

// Escapar HTML para seguridad
function escaparHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}


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
      const respuesta = await fetch("/api/comments/" + postId);
      if (!respuesta.ok) throw new Error("Error al obtener comentarios");

      const comentarios = await respuesta.json();
      const listaComentarios = contenedorComentarios.querySelector(".comments-list");
      
      const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
      const currentUserId = loggedUser ? loggedUser.user_id : null;

      if (Array.isArray(comentarios) && comentarios.length > 0) {
        // Renderizamos cada comentario
        listaComentarios.innerHTML = comentarios.map(c => {
            const esMio = (c.user_id === currentUserId);
            
            return `
            <div class="comment" data-comment-id="${c.comment_id}">
                <span class="comment-text"><strong>@${escaparHtml(c.username)}</strong> ${escaparHtml(c.content)}</span>
                
                ${esMio ? `
                <div class="comment-menu">
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
        listaComentarios.innerHTML = "<div class='no-comments'>No hay comentarios aún.</div>";
      }
      
      // Actualizar contador
      const contador = document.querySelector(`.comment-count[data-post-id="${postId}"]`);
      if(contador) {
        // Sumamos 1 visualmente al instante
        contador.textContent = parseInt(contador.textContent || 0) + 1;
      }

      try {
          const res = await fetch("/api/comments", { /* ... */ });
        
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

  // --------------------------
  // Enviar comentario
  // --------------------------
  if (evento.target.classList.contains("add-comment-btn") || evento.target.closest(".add-comment-btn")) {
    const botonEnviar = evento.target.classList.contains("add-comment-btn") ? evento.target : evento.target.closest(".add-comment-btn");
    const contenedorComentario = botonEnviar.closest(".comments-wrapper");
    const postId = contenedorComentario.dataset.postId;

    const inputComentario = contenedorComentario.querySelector(".add-comment-input");
    const contenido = (inputComentario.value || "").trim();

    if (!contenido) {
      alert("Escribí un comentario antes de enviar.");
      return;
    }

    const usuarioLogueado = JSON.parse(localStorage.getItem("loggedUser"));
    if (!usuarioLogueado) {
      alert("Tenés que estar logueado para comentar.");
      return;
    }

    try {
      const respuesta = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: usuarioLogueado.user_id,
          post_id: parseInt(postId),
          content: contenido,
          url: null
        })
      });

      if (!respuesta.ok) throw new Error("Error enviando comentario");
      
      const nuevoComentario = await respuesta.json(); 

      const htmlNuevoComentario = `
        <div class='comment' data-comment-id='${nuevoComentario.comment_id}'> 
           <span class="comment-text"><strong>@${escaparHtml(usuarioLogueado.username)}</strong> ${escaparHtml(contenido)}</span>
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

      // Actualizar contador visualmente
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
