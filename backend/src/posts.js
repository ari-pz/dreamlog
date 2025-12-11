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


// INSERT post
async function createPost(user_id, content, image, category_id) {
  const query = `
    INSERT INTO posts (user_id, content, image, category_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [user_id, content, image, category_id];
  const result = await dbClient.query(query, values);
  return result.rows[0];
}


// DELETE post
async function deletePost(post_id) {
  try {
    const result = await dbClient.query(
      "DELETE FROM posts WHERE post_id = $1 RETURNING *",
      [post_id]
    );

    if (result.rowCount === 0) {
      return { success: false, message: "No se encontró el post con ese ID." };
    }
    return { success: true, message: "Post eliminado correctamente.", post: result.rows[0] };
  } catch (err) {
    console.error("Error eliminando post:", err);
    return { success: false, message: "Error eliminando post." };
  }
}



// ===================================================
// EXPORTAR FUNCIONES
// ===================================================
module.exports = {
  getAllPosts,
  getPostsByUserId,
  getPostsCount,
  getCategories,
  getPostsByCategory,
  createPost,
  deletePost
};
