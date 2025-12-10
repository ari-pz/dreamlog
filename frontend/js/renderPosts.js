function renderPosts(posts) {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const currentUserId = loggedUser?.user_id; // por si aún no está logueado

  const container = document.getElementById("posts-container");
  container.innerHTML = "";

  posts.forEach(post => {
    const isOwner = (post.user_id === currentUserId);

    container.innerHTML += `
      <div class="post">

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

        <div class="post-footer">
          <span class="category">${post.category_name}</span>
          <span>0 LUNAS</span>
          <span>0 COMENTARIOS</span>
        </div>

      </div>
    `;
  });
}

