fetch("navbar.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("navbar").innerHTML = html;

    const userData = localStorage.getItem("loggedUser");
    if (!userData) window.location.href = "/";

    const logoutBtn = document.getElementById("logout-link");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        const confirmLogout = confirm("¿Estás seguro de que quieres cerrar sesión?");
        if (!confirmLogout) return;

        const user = JSON.parse(localStorage.getItem("loggedUser"));

        await fetch("/api/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: user.username })
        });

        localStorage.removeItem("loggedUser");
        window.location.href = "/";
      });
    }
  });
