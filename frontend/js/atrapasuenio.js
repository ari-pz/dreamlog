document.addEventListener("DOMContentLoaded", () => {

  // Frases oníricas que cambian cada 10 segundos
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

  // Obtener usuario logueado
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

  // Traer stats del usuario
  if (loggedUser) {
    const userId = loggedUser.user_id;

    fetch(`/api/users/${userId}/stats`)
      .then(res => res.json())
      .then(stats => {
        // stats = { totalPosts, totalLunas }
        cantidadPosts = stats.totalPosts;

        // Actualizar plumas
        actualizarPlumas();

        // Actualizar dream-stats
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
