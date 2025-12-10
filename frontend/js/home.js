// puede ir en home.js
async function loadPosts() {
  try {
      const res = await fetch("/api/posts");
      const posts = await res.json();
      renderPosts(posts);
  } catch (error) {
      console.error("Error al cargar posts", error);
  }
}

// Cargar posts al inicio
loadPosts();





const frases = [
      "Explorá tus símbolos nocturnos…",
      "Buscá tus sueños o señales ocultas…",
      "Descubrí patrones en tus noches…",
      "Cada búsqueda es un viaje dentro de tu mente…",
      "¿Qué misterios te visitaron hoy?"
    ];
const input = document.getElementById("search-input");
let fraseIndex = 0;
let typingActive = true;
let userStartedTyping = false; // nuevo flag

// Si el usuario empieza a escribir, se pausa definitivamente el efecto
input.addEventListener("input", () => {
    if (input.value.trim() !== "") {
    userStartedTyping = true;
    typingActive = false;
    input.style.setProperty("--placeholder-opacity", 1);
    input.placeholder = ""; // limpiar cualquier texto anterior
    }
});

// Función para escribir letra por letra
function escribirFrase(frase, i = 0) {
    if (!typingActive || userStartedTyping) return;

    input.style.setProperty("--placeholder-opacity", 1);

    if (i <= frase.length) {
    input.placeholder = frase.substring(0, i);
    setTimeout(() => escribirFrase(frase, i + 1), 100);
    } else {
    setTimeout(() => puffDesaparecer(), 3000);
    }
}
// Efecto de desvanecimiento
function puffDesaparecer() {
    if (!typingActive || userStartedTyping) return;
    let opacity = 1;
    const step = 0.05;
    const fade = setInterval(() => {
    opacity -= step;
    input.style.setProperty("--placeholder-opacity", opacity);
    if (opacity <= 0) {
        clearInterval(fade);
        input.placeholder = "";
        fraseIndex = (fraseIndex + 1) % frases.length;
        setTimeout(() => escribirFrase(frases[fraseIndex]), 500);
    }
    }, 60);
}
// Iniciar animación
escribirFrase(frases[fraseIndex]);

// ====== FUNCIONALIDAD BARRA DE BUSQUEDA ====== // 
const searchInput = document.getElementById('search-input');
const categoriasValidas = ['pesadilla', 'absurdo', 'lucido', 'sensorial', 'recurrente', 'inquietante'];

// Función para buscar posts por categoría
async function buscarPorCategoria(categoria) {
    categoria = categoria.trim().toLowerCase();
    
    // Verificar si la categoría existe
    if (!categoriasValidas.includes(categoria)) {
        mostrarMensaje('No existe la categoría que estás buscando');
        return;
    }
    
    try {
        // Llamar al backend para buscar posts por categoría
        const response = await fetch(`http://localhost:3000/api/posts/categories/${categoria}`);
        const data = await response.json();
        
        if (data.message || data.length === 0) {
            mostrarMensaje(`No hay posts en la categoría "${categoria}"`);
            return;
        }
        
        // ✅ Usar tu función renderPosts que ya existe
        renderPosts(data);
        
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error al buscar posts');
    }
}

// Función para cargar todos los posts (cuando no hay búsqueda)
async function cargarTodosLosPosts() {
    try {
        const response = await fetch('http://localhost:3000/api/posts');
        const posts = await response.json();
        
        if (posts.message || posts.length === 0) {
            mostrarMensaje('No hay posts aún');
            return;
        }
        
        // ✅ Usar tu función renderPosts que ya existe
        renderPosts(posts);
        
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error al cargar posts');
    }
}

// Función para mostrar mensajes de error/info
function mostrarMensaje(mensaje) {
    const container = document.getElementById('posts-container');
    container.innerHTML = `<p class="mensaje-busqueda">${mensaje}</p>`;
}

// Event listener - buscar al presionar Enter
searchInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const query = this.value.trim();
        
        if (query === '') {
            // Si está vacío, mostrar todos los posts
            cargarTodosLosPosts();
            return;
        }
        
        buscarPorCategoria(query);
    }
});


// Opcional: Buscar mientras escribe (con delay)
/*let timeoutBusqueda;
searchInput.addEventListener('input', function() {
    clearTimeout(timeoutBusqueda);
    
    const query = this.value.trim();
    
    if (query.length === 0) {
        // Si borra todo, volver a mostrar todos los posts
        cargarTodosLosPosts(); // Función que ya tengas
        return;
    }
    
    // Esperar 500ms después de que deje de escribir
    timeoutBusqueda = setTimeout(() => {
        buscarPorCategoria(query);
    }, 500);
});
*/
