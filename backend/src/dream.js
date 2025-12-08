// DREAM:JS
// Nos conectamos a Postgres con Pool
const { Pool } = require("pg");
const dbClient = new Pool ({
  user: "postgres",
  password: "postgres",
  host: "localhost",
  port: 5432,
  database: "dreamlog",
});



// ===================================================
// FUNCIONES PARA USERS
// ===================================================

// GET all USERS
async function getAllUsers() {
  const response = await dbClient.query("SELECT * FROM users");
  return response.rows;
}

// GET USER by ID
async function getUserById(user_id) {
  const result = await dbClient.query(
    "SELECT * FROM users WHERE user_id = $1",
    [user_id]
  );
  return result.rows[0];
}

// GET USER by USERNAME
async function getUserByUsername(username) {
  const result = await dbClient.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  return result.rows[0];
}

// POST USER
async function createUser(username, password, bio, pfp) {
  const result = await dbClient.query( 
    `INSERT INTO users (username, password, bio, pfp)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [username, password, bio, pfp]
  );
  return result.rows[0];
}



// TRAER PERFIL DEL USUARIO LOGUEADO
async function getLoggedUserProfile() {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  if (!loggedUser) return null; // si no está logueado
  try {
    const response = await fetch(`/api/users/${loggedUser.user_id}`);
    if (!response.ok) throw new Error("No se pudo obtener el perfil");
    const user = await response.json();
    return user;
  } catch (err) {
    console.error(err);
    return null;
  }
}


// ===================================================
// FUNCIONES PARA POSTS
// ===================================================

// GET: GET all POSTS
async function getAllPosts() {
  const query = `
    SELECT 
      posts.post_id,
      posts.user_id,
      posts.content,
      posts.created_at,
      users.username
    FROM posts
    JOIN users ON posts.user_id = users.user_id
    ORDER BY posts.created_at DESC
  `;
  const { rows } = await dbClient.query(query);
  return rows;
}


// GET: GET POST by user_id
async function getPostsByUserId(user_id) {
  const query = `
    SELECT 
      posts.post_id,
      posts.user_id,
      posts.content,
      posts.created_at,
      users.username,
      users.pfp
    FROM posts
    JOIN users ON posts.user_id = users.user_id
    WHERE posts.user_id = $1
    ORDER BY posts.created_at DESC;
  `;
  const result = await dbClient.query(query, [user_id]);
  return result.rows;
}






// ===================================================
// EXPORTAR FUNCIONES
// ===================================================
module.exports = {
  getAllUsers,
  getUserById,
  getUserByUsername,
  createUser,
  //
  getAllPosts,
  getPostsByUserId
};
