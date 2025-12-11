function renderPosts(posts) {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const currentUserId = loggedUser?.user_id;
  const container = document.getElementById("posts-container");
  container.innerHTML = ""; 

  posts.forEach( async post => {
    const isOwner = (post.user_id === currentUserId);

    // Crear DIV contenedor
    const postDiv = document.createElement("div");
    postDiv.classList.add("post");
    postDiv.dataset.postId = post.post_id;


    // Insertar HTML interno
    postDiv.innerHTML = `
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
              ? `
                  <a href="edit-post.html">Editar Sueño</a>
                  <a href="#" class="style-red delete-post">Eliminar Sueño</a>
                `
              : `
                  <a href="#" class="style-red">Reportar Sueño</a>
                  <a href="#" class="style-red">Bloquear Usuario</a>
                `
            }
          </div>
        </div>
      </div>

      <div class="post-content">${post.content}</div>

      ${
        post.image
        ? `<img src="${post.image}" class="post-img">`
        : ""
      }

      <div class="post-footer">
        <span class="category">${post.category_name}</span>

        <i class="fa-regular fa-moon moon-icon"
           data-post-id="${post.post_id}"
           style="cursor:pointer"></i>

        <span class="moon-count"
              data-post-id="${post.post_id}"></span>

        <i class="fa-regular fa-comment comment-icon" 
          data-post-id="${post.post_id}" 
          style="cursor:pointer; margin-left: 1rem;"></i>
        <span class="comment-count" data-post-id="${post.post_id}">${post.comment_count || 0}</span>
      </div>

      <div class="comments-wrapper" 
        data-post-id="${post.post_id}" 
        style="display:none;">
        
        <div class="comments-list"></div>
         <div class="add-comment">
          <input type="text" class="add-comment-input" placeholder="Escribí un comentario..." />
          <button class="add-comment-btn">Enviar</button>
        </div>
      </div>

    `;

    container.appendChild(postDiv);
    
    //cargar comentarios
    try {
      const res = await fetch(`/api/comments/${post.post_id}`);
      const comentarios = await res.json();
      const listaComentarios = postDiv.querySelector(".comments-list");

      listaComentarios.innerHTML = comentarios.map(c => { 
        return `
        <div class="comment" data-comment-id="${c.comment_id}">
          <span class="comment-text"><strong>@${c.username}</strong> ${c.content}</span>
          
          ${
            c.user_id === currentUserId 
            ? `<div class="comment-menu">
                 <span class="dots">...</span>
                 <div class="dropdown-comment">
                   <a href="#" class="edit-comment">Editar</a>
                   <a href="#" class="delete-comment">Eliminar</a>
                 </div>
               </div>`
            : ""
          }
        </div>

      `;}).join("");

      
      // actualizar contador
      const contadorSpan = postDiv.querySelector(`.comment-count[data-post-id="${post.post_id}"]`);
      contadorSpan.textContent = comentarios.length;
    } catch(error){
      console.error("Error cargando comentarios:", error);
    }

    iniciarConLunas(post.post_id, currentUserId);

  });
};

  // ELIMINAR SUEÑO
  const deleteLinks = document.querySelectorAll(".delete-post");
  deleteLinks.forEach(link => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();
      const postDiv = e.target.closest(".post");
      const postId = postDiv.getAttribute("data-post-id");

      if (confirm("¿Estás seguro que quieres eliminar este post?")) {
        try {
          const res = await fetch(`/api/posts/${postId}`, {
            method: "DELETE"
          });
          const data = await res.json();

          if (data.success) {
            alert("Post eliminado correctamente");
            loadPosts(); // recargar posts
          } else {
            alert(data.message || "No se pudo eliminar el post");
          }
        } catch (err) {
          console.error("Error eliminando post:", err);
          alert("Hubo un error al eliminar el post");
        }
      }
    });
});
