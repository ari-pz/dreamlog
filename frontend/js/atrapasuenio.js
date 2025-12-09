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

// Cambiar frase cada 10 segundos
setInterval(() => {
  fraseIndex = (fraseIndex + 1) % frases.length;   // Avanza y vuelve al inicio
  quoteElement.textContent = frases[fraseIndex];   // Actualiza la frase
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

// Si hay usuario logueado, traer posts desde DB
if (loggedUser) {
  const userId = loggedUser.user_id;

  fetch(`/api/posts/${userId}`)
    .then(res => res.json())     
    .then(posts => {
      if (Array.isArray(posts)) {
        cantidadPosts = posts.length;
      } else {
        cantidadPosts = 0;
      }
      actualizarPlumas();
    })
    .catch(error => {
      console.error(error);
      actualizarPlumas();
    });

} else {
  actualizarPlumas();
}
