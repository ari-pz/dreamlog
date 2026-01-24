const BACKEND_URL = window.location.hostname === "localhost" 
    ? "http://localhost:3001" 
    : "https://dreamlog-5k3h.onrender.com"; 

fetch("navbar.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("navbar").innerHTML = html;

    const modal = document.getElementById('modal-resultado');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalMensaje = document.getElementById('modal-mensaje');
    const btnAceptar = document.getElementById('btn-aceptar');
    const btnCancelar = document.getElementById('btn-cancelar');
    const logoutBtn = document.getElementById("logout-link");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();

        modalTitulo.textContent = "Cerrar Sesión";
        modalMensaje.textContent = "¿Estás segura de que querés salir?";
        
        btnAceptar.style.display = 'inline-block';
        btnCancelar.style.display = 'inline-block';

        modal.classList.add('is-active');

        btnCancelar.onclick = function() {
            modal.classList.remove('is-active');
        };

        btnAceptar.onclick = async function() {
            modal.classList.remove('is-active');
            const user = JSON.parse(localStorage.getItem("loggedUser"));
            
            if (user) {
                await fetch(`${BACKEND_URL}/api/logout`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ username: user.username })
                });
            }

            localStorage.removeItem("loggedUser");
            window.location.href = "/";
        };
      });
    }
  });