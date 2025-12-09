async function cargarMisPosts() {

    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

    if (!loggedUser) {
    document.getElementById("my-posts").innerHTML =
        "<p>No estás logueado</p>";
    return;
    }

    const USER_ID = loggedUser.user_id;

    const res = await fetch(`http://localhost:3000/api/posts/${USER_ID}`);
    const posts = await res.json();

    const container = document.getElementById("my-posts");

    // Por si el usuario no tiene posts
    if (posts.message) {
    container.innerHTML = `<p>${posts.message}</p>`;
    return;
    }

    posts.forEach(post => {
    const div = document.createElement("div");
    div.classList.add("post");

    div.innerHTML = `
        <div class="post-username">@${post.username}</div>
        <div class="post-content">${post.content}</div>
        <div class="post-date">${new Date(post.created_at).toLocaleString()}</div>
    `;

    container.appendChild(div);
    });
}

cargarMisPosts(); 


// FUNCIONALIDAD BTN ELIMINAR
const botonEliminar = document.getElementById('boton-eliminar');

botonEliminar.addEventListener('click', async function() {
    const confirmacion = confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción NO se puede deshacer.');
    
    if (!confirmacion) {
        return; 
    }
    
    const segundaConfirmacion = confirm('¿REALMENTE estás seguro? Se borrarán todos tus datos permanentemente.');
    
    if (!segundaConfirmacion) {
        return;
    }
    
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    
    if (!loggedUser) {
        alert('No estás logueado');
        window.location.href = '/login.html';
        return;
    }
    
    const user_id = loggedUser.user_id;
    
    console.log('Eliminando usuario:', user_id);
    
    try {
        const response = await fetch(`http://localhost:3000/api/users/${user_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const data = await response.json();
        
        console.log('Respuesta del servidor:', data);
        
        if (response.ok) {
            alert('Cuenta eliminada exitosamente. Serás redirigido al inicio.');
            
            // Limpiar localStorage
            localStorage.removeItem('loggedUser');
            
            // Redirigir al login
            window.location.href = '/login.html';
            
        } else {
            alert('Error: ' + data.error);
        }
        
    } catch (error) {
        console.error('Error completo:', error);
        alert('Error: No se pudo conectar con el servidor');
    }
});