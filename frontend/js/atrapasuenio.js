document.addEventListener("DOMContentLoaded", () => {
  const frases = [
    "“Cada hilo guarda un recuerdo invisible.”",
    "“Tu mente descansa, pero tu alma sigue viajando.”",
    "“Algunos sueños no quieren ser olvidados.”",
    "“Lo que tejés de noche, te protege de día.”",
    "“El tiempo se disuelve en tus visiones.”"
  ];

  let fraseIndex = 0;
  const quoteElement = document.getElementById("quote");

  setInterval(() => {
    fraseIndex = (fraseIndex + 1) % frases.length;
    quoteElement.textContent = frases[fraseIndex];
  }, 10000);

  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  let cantidadPosts = 0;

  function calcularPlumasActivas(posts) {
      let plumasActivas = 0;
      if (posts >= 5) plumasActivas = 3;
      if (posts >= 20) plumasActivas = 6;
      if (posts >= 50) plumasActivas = 9;
      if (posts >= 70) plumasActivas = 11;
      if (posts >= 100) plumasActivas = 12;
      return plumasActivas;
  }

  function actualizarPlumas() {
    const plumas = document.querySelectorAll('.pluma');
    const plumasQueDebenEstarActivas = calcularPlumasActivas(cantidadPosts);

    plumas.forEach((pluma, index) => {
      if (index < plumasQueDebenEstarActivas) pluma.classList.add('active');
      else pluma.classList.remove('active');
    });
  }
  
  function actualizarCategorias(userId) {
    fetch(`${BACKEND_URL}/api/posts/user/${userId}`)
      .then(res => res.json())
      .then(posts => {

        const conteo = {};

        // Contar posts por category_id
        posts.forEach(post => {
          if (post.category_id) {
            conteo[post.category_id] = (conteo[post.category_id] || 0) + 1;
          }
        });

        const boxes = document.querySelectorAll(".cat-box");

        boxes.forEach(box => {
          const catId = parseInt(box.dataset.id);
          const cantidad = conteo[catId] || 0;

          box.querySelector(".cat-count").textContent = `${cantidad} sueños`;

          if (cantidad > 0) {
            box.classList.remove("empty");
          } else {
            box.classList.add("empty");
          }
        });

      })
      .catch(err => console.error("Error cargando categorías:", err));
  }


  if (loggedUser) {
    const userId = loggedUser.user_id;

    fetch(`${BACKEND_URL}/api/users/${userId}/stats`)
      .then(res => res.json())
      .then(stats => {
        // stats = { totalPosts, totalLunas }
        cantidadPosts = stats.totalPosts;

        actualizarPlumas();
        actualizarCategorias(userId);

        const statsDiv = document.querySelector(".dream-stats");
        statsDiv.innerHTML = `
          <p>✦ ${stats.totalPosts} sueños tejidos</p>
          <p>✦ ${stats.totalLunas} lunas salientes </p>
        `;
      })
      .catch(error => {
        console.error("Error cargando estadísticas:", error);
        actualizarPlumas();
      });
  } else {
    actualizarPlumas();
  }

});
