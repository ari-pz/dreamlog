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
        createUser,
        getAllPosts,
        getPostsByUserId 
} = require("./dream");


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

// POST user
app.post("/api/users", async (req, res) => {
  const { username, password, bio, pfp } = req.body;
  try {
    const newUser = await createUser(username, password, bio, pfp);
    res.status(201).json(newUser);

  } catch (err) {
    if (err.code == '23505'){
      res.status(400).json({error: "El nombre de usuario ya existe"});
    } else {
      res.status(500).json({error: "Error al crear el usuario"})
    }
  }
});


// =======================================
// POSTS
// =======================================

// GET posts
app.get("/api/posts", async (req, res) => {
  const posts = await getAllPosts();
  res.json(posts);
});

// GET post by user_id
app.get("/api/posts/:id", async (req, res) => {
  const post = await getPostsByUserId(req.params.id)
  if (post.lenght === 0) {
    return res.json({ message: "No hay posts para este usuario" });
  }
  res.json(post);
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

