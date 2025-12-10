//  INDEX.JS
const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname,"..", "..", "frontend")));

// MOSTRAR login.html primero ante todo
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "frontend", "login.html"));
});
// MOSTRAR home.html
app.get("/inicio", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "frontend", "home.html"));
});


// SERVIDOR
app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:' + PORT);
});


//IMPORTAR FUNCIONES
const { getAllUsers,
        getUserById,
        getUserByUsername,
        updateUser,
        nameInUse,
        deleteUser
} = require("./users");

const {
  getAllPosts,
  getPostsByUserId,
  getPostsCount,
  getCategories,
  createPost
} = require("./posts");


// =======================================
// USERS
// =======================================

// GET users
app.get("/api/users", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// GET user by id
app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});


//UPDATE profile
app.put('/api/users/:id', async (req, res) => {
    const user_id = parseInt(req.params.id);
    const username = req.body.username;
    const password = req.body.password;
    const bio = req.body.bio;
    const pfp = req.body.pfp;

    console.log('Recibido en PUT /api/users/:id:', { user_id, username, password, bio, pfp });


    if (username) {
        if (username.length < 4) {
            return res.status(400).json({ error: 'El username debe tener al menos 4 caracteres' });
        }
        
        const usernameOcupado = await nameInUse(username, user_id);
        if (usernameOcupado) {
            return res.status(400).json({ error: 'Este nombre ya está en uso' });
        }
    }

    if (password) {
        if (password.length < 8) {
            return res.status(400).json({ error: 'La contrasenia debe tener al menos 8 caracteres' });
        }
        
        const tieneMayuscula = /[A-Z]/.test(password);
        if (!tieneMayuscula) {
            return res.status(400).json({ error: 'La contrasenia debe tener una mayúscula' });
        }
        
        const tieneMinuscula = /[a-z]/.test(password);
        if (!tieneMinuscula) {
            return res.status(400).json({ error: 'La contrasenia debe tener una minúscula' });
        }
        
        const tieneNumero = /[0-9]/.test(password);
        if (!tieneNumero) {
            return res.status(400).json({ error: 'La contrasenia debe tener un número' });
        }
        
        const tieneEspecial = /[^a-zA-Z0-9]/.test(password);
        if (!tieneEspecial) {
            return res.status(400).json({ error: 'La contrasenia debe tener un carácter especial' });
        }
    }

    if (bio && bio.length > 225) {
        return res.status(400).json({ error: 'La biografía no puede tener más de 225 caracteres' });
    }

    const resultado = await updateUsers(user_id, username, password, bio, pfp);

    if (!resultado) {
        return res.status(500).json({ error: 'Error al actualizar el perfil' });
    }

    res.json({ 
        mensaje: 'Perfil actualizado exitosamente',
        usuario: resultado
    });
});


// Endpoint para verificar si un nombre está disponible
app.get('/api/username/:username/:user_id', async (req, res) => {
    const username = req.params.username;
    let user_id;

    if (req.params.user_id) {
        user_id = parseInt(req.params.user_id);  
    } else {
        user_id = null;
    }

    try {
        const ocupado = await nameInUse(username, user_id);
        
        res.json({ disponible: !ocupado });
    } catch (error) {
        console.error('Error verificando nombre:', error);
        res.status(500).json({ error: 'Error al verificar nombre' });
    }
});

// Eliminar cuenta
app.delete('/api/users/:id', async (req, res) => {
    const user_id = parseInt(req.params.id);
    console.log('Intentando eliminar usuario:', user_id);
    
    try {
        const usuario = await getUserById(user_id);
        
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        const eliminado = await deleteUser(user_id);
        
        if (!eliminado) {
            return res.status(500).json({ error: 'Error al eliminar la cuenta' });
        }
        
        res.json({ 
            mensaje: 'Cuenta eliminada exitosamente',
            user_id: user_id
        });
        
    } catch (error) {
        console.error('Error en DELETE /api/users/:id:', error);
        return res.status(500).json({ error: 'Error al eliminar la cuenta' });
    }
});

// =======================================
// POSTS
// =======================================

// GET posts
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await getAllPosts();
    res.json(posts);
  } catch (error) {
    console.error("Error en GET /api/posts", error);
    res.status(500).json({ error: "Error al obtener posts" });
  }
});

// GET post by user_id
app.get("/api/posts/:id", async (req, res) => {
  try {
    const posts = await getPostsByUserId(req.params.id);
    res.json(posts); // siempre devuelve array
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener posts del usuario" });
  }
});


// GET cantidad de posts 
app.get("/api/posts/count/:user_id", async (req, res) => {
  const user_id = parseInt(req.params.user_id);
  try {
    const cantidadPosts = await getPostsCount(user_id);
    res.json({ cantidadPosts });
  } catch (error) {
    console.error("Error al obtener cantidad de posts:", error);
    res.status(500).json({ error: "Error al obtener cantidad de posts" });
  }
});


// POST nuevo post
app.post("/api/posts", async (req, res) => {
  try {
    const { user_id, content, image, category_id } = req.body;

    if (!user_id || !content) {
      return res.status(400).json({ error: "user_id y content son obligatorios" });
    }

    const newPost = await createPost(user_id, content, image, category_id);
    res.json(newPost);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creando post" });
  }
});


// =======================================
// CATEGORIES
// =======================================

// GET all categories
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (err) {
    console.error("Error obteniendo categorías:", err);
    res.status(500).json({ error: "Error obteniendo categorías" });
  }
});


// GET para buscar posts por categoría
app.get('/api/posts/categories/:categorie', async (req, res) => {
    const categoriaBuscada = req.params.categorie.toLowerCase();

    try {
        const posts = await getPostsByCategory(categoriaBuscada);

        if (posts.length === 0) {
            return res.json({ message: 'No hay posts en esta categoría' });
        }

        res.json(posts);
        
    } catch (error) {
        console.error('Error buscando posts por categoría:', error);
        res.status(500).json({ error: 'Error al buscar posts' });
    }
});

// =======================================
// LOGIN
// =======================================

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Intento de login:", username);

    const user = await getUserByUsername(username);

    if (!user) {
      console.log("Usuario no existe:", username);
      return res.status(404).json({ error: "Usuario no existe" });
    }
  
    if (user.password !== password) {
      console.log("Contraseña incorrecta para:", username);
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    console.log("Usuario logueado correctamente:", username);
    res.json({
      message: "Login exitoso",
      user: {
        user_id: user.user_id,
        username: user.username
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// =======================================
// LOGOUT
// =======================================

app.post("/api/logout", (req, res) => {
  const { username } = req.body; // viene del fetch desde el frontend
  console.log(`Usuario "${username}" ha cerrado sesión desde el navegador`);
  res.json({ message: "Logout registrado en el servidor" });
});

