function renderPosts(posts) {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const currentUserId = loggedUser?.user_id; // por si aún no está logueado

  const container = document.getElementById("posts-container");
  container.innerHTML = "";

  posts.forEach(post => {
    const isOwner = (post.user_id === currentUserId);

    container.innerHTML += `
      <div class="post" data-post-id="${post.post_id}">

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
          <span>0 LUNAS</span>
          <span>0 COMENTARIOS</span>
        </div>
      </div>
    `;
  });

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
}


