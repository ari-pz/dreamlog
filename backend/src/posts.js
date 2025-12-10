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
      posts.image,
      posts.created_at,
      users.username,
      users.pfp,
      categories.name AS category_name
    FROM posts
    JOIN users ON posts.user_id = users.user_id
    LEFT JOIN categories ON posts.category_id = categories.category_id
    ORDER BY posts.created_at DESC;
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
      posts.image,
      posts.created_at,
      users.username,
      users.pfp,
      categories.name AS category_name
    FROM posts
    JOIN users ON posts.user_id = users.user_id
    LEFT JOIN categories ON posts.category_id = categories.category_id
    WHERE posts.user_id = $1
    ORDER BY posts.created_at DESC;
  `;
  const result = await dbClient.query(query, [user_id]);
  return result.rows;
}


//Para el desplegables delnewpost.html
async function getCategories() {
  const query = `SELECT category_id, name FROM categories ORDER BY name ASC;`;
  const { rows } = await dbClient.query(query);
  return rows;
}


// GET: cantidad de posts 
async function getPostsCount(user_id) {
  const query = `SELECT COUNT(*) FROM posts WHERE user_id = $1`;
  const { rows } = await dbClient.query(query, [user_id]);
  return parseInt(rows[0].count, 10);
}

async function getPostsByCategory(categoria) {
  const query = `
    SELECT 
      posts.post_id,
      posts.user_id,
      posts.content,
      posts.image,
      posts.created_at,
      users.username,
      users.pfp,
      categories.name AS category_name
    FROM posts
    JOIN users ON posts.user_id = users.user_id
    LEFT JOIN categories ON posts.category_id = categories.category_id
    WHERE LOWER(categories.name) = $1
    ORDER BY posts.created_at DESC;
  `;
  
  const { rows } = await dbClient.query(query, [categoria]);
  return rows;
}



// ===================================================
// EXPORTAR FUNCIONES
// ===================================================
module.exports = {
  getAllPosts,
  getPostsByUserId,
  getPostsCount,
  getCategories,
  getPostsByCategory
};
