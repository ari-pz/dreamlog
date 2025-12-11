document.addEventListener("DOMContentLoaded", () => {

  // --- Frases oníricas ---
  const frases = [
    "Cada hilo guarda un recuerdo invisible.",
    "Tu mente descansa, pero tu alma sigue viajando.",
    "Algunos sueños no quieren ser olvidados.",
    "Lo que tejés de noche, te protege de día.",
    "El tiempo se disuelve en tus visiones."
  ];
  let fraseIndex = 0;
  const quoteElement = document.getElementById("quote");

  setInterval(() => {
    fraseIndex = (fraseIndex + 1) % frases.length;
    quoteElement.textContent = frases[fraseIndex];
  }, 10000);

  // --- Progreso de plumas ---
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  let cantidadPosts = 0;

  function calcularPlumasActivas(posts) {
    if (posts >= 100) return 12;
    if (posts >= 70) return 11;
    if (posts >= 50) return 9;
    if (posts >= 20) return 6;
    if (posts >= 5) return 3;
    return 0;
  }

  function actualizarPlumas() {
    const plumas = document.querySelectorAll('.pluma');
    const plumasActivas = calcularPlumasActivas(cantidadPosts);
    plumas.forEach((pluma, i) => {
      pluma.classList.toggle('active', i < plumasActivas);
    });
  }

  // --- Traer stats ---
  async function cargarStats() {
    if (!loggedUser) return;
    try {
      const res = await fetch(`/api/users/${loggedUser.user_id}/stats`);
      const stats = await res.json();
      cantidadPosts = stats.totalPosts;
      actualizarPlumas();

      const statsDiv = document.querySelector(".dream-stats");
      if (statsDiv) {
        statsDiv.innerHTML = `
          <p>✦ ${stats.totalPosts} sueños tejidos</p>
          <p>✦ ${stats.totalLunas} lunas salientes</p>
        `;
      }
    } c
