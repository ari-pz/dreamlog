function renderPosts(posts) {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const currentUserId = loggedUser?.user_id;
  const container = document.getElementById("posts-container");
  container.innerHTML = ""; 

  posts.forEach(async post => {
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
                  <a href="edit-post.html?post_id=${post.post_id}">Editar Sueño</a>
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
    
    const btnEliminar = postDiv.querySelector(".delete-post");
    
    if (btnEliminar) {
        btnEliminar.addEventListener("click", async (e) => {
            e.preventDefault();
            
            if (confirm("¿Estás seguro que quieres eliminar este post?")) {
                try {
                    const res = await fetch(`/api/posts/${post.post_id}`, {
                        method: "DELETE"
                    });
                    const data = await res.json();

                    if (data.success) {
                        alert("Post eliminado correctamente");
                        postDiv.remove(); 
                    } else {
                        alert(data.message || "No se pudo eliminar el post");
                    }
                } catch (err) {
                    console.error("Error eliminando post:", err);
                    alert("Hubo un error al eliminar el post");
                }
            }
        });
    }


    //cargar comentarios
    try {
      const res = await fetch(`/api/comments/${post.post_id}`);
      const comentarios = await res.json();
      const listaComentarios = postDiv.querySelector(".comments-list");

      listaComentarios.innerHTML = "";
      listaComentarios.innerHTML = comentarios.map(c => { 
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

          ${
            c.user_id === currentUserId 
            ? `<div class="comment-menu" style="margin-left: 10px;">
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
}
