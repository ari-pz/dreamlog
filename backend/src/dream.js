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
  getAllPosts,
  getPostsByUserId
};
