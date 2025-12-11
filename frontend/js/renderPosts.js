function renderPosts(posts) {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const currentUserId = loggedUser?.user_id;

  const container = document.getElementById("posts-container");
  container.innerHTML = ""; // vaciar

  posts.forEach(async post => {
    const isOwner = (post.user_id === currentUserId);

    // Crear DIV contenedor
    const postDiv = document.createElement("div");
    postDiv.classList.add("post");

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
                  <a href="#">Editar Sueño</a>
                  <a href="#" class="style-red">Eliminar Sueño</a>
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

        <span>0 COMENTARIOS</span>
      </div>
    `;

    container.appendChild(postDiv);

    await iniciarConLunas(post.post_id, currentUserId);
  });
}
