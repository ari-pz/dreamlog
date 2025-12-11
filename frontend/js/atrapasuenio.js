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
    } catch (err) {
      console.error("Error cargando stats:", err);
      actualizarPlumas();
    }
  }

  cargarStats();

  // --- Cargar categorías ---
  async function renderCategoryCounts() {
    if (!loggedUser) return;
    try {
      const [postsRes, catsRes] = await Promise.all([
        fetch(`/api/posts/${loggedUser.user_id}`),
        fetch(`/api/categories`)
      ]);
      const posts = await postsRes.json();
      const categories = await catsRes.json();

      const orderedCats = [...categories].sort((a,b) => a.category_id - b.category_id);

      const boxes = Array.from(document.querySelectorAll("#category-boxes .cat-box"));

      boxes.forEach((box, i) => {
        const cat = orderedCats[i];
        const nameNode = box.querySelector(".cat-name");
        const countNode = box.querySelector(".cat-count");

        if (!cat) {
          nameNode.textContent = "";
          countNode.textContent = "";
          box.classList.add("empty");
          return;
        }

        // Solo mostramos el nombre de la categoría
        nameNode.textContent = cat.name;
        countNode.textContent = ""; // <-- aquí ocultamos la cantidad de sueños

        box.classList.remove("empty","cat-pesadilla","cat-recurrente","cat-absurdo","cat-sensorial","cat-lucido","cat-inquietante");

        switch(cat.name.toLowerCase()) {
          case "pesadilla": box.classList.add("cat-pesadilla"); break;
          case "recurrente": box.classList.add("cat-recurrente"); break;
          case "absurdo": box.classList.add("cat-absurdo"); break;
          case "sensorial": box.classList.add("cat-sensorial"); break;
          case "lúcido": 
          case "lucido": box.classList.add("cat-lucido"); break;
          case "inquietante": box.classList.add("cat-inquietante"); break;
        }

        // Si quieres animaciones de estilo aunque no muestre cantidad:
        const hasPosts = posts.some(p => Number(p.category_id) === cat.category_id);
        box.classList.toggle("has-count", hasPosts);
      });

    } catch(err) {
      console.error("Error cargando categorías:", err);
    }
  }

  renderCategoryCounts();

});
