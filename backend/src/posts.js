// Nos conectamos a Postgres con Pool
const { Pool } = require("pg");
const dbClient = new Pool ({
  user: "postgres",
  password: "postgres",
  host: "localhost",
  port: 5432,
  database: "dreamlog",
});


// GET all MOON
async function getAllMoons() {
  const response = await dbClient.query("SELECT * FROM lunas");
  return response.rows;
}

// ===================================================
// FUNCIONES PARA POSTS
// ===================================================



// Función para obtener UN SOLO post por su ID
async function getPostById(postId) {
  try {
    const query = `
      SELECT p.*, u.username, u.pfp, c.name as category_name
      FROM posts p
      JOIN users u ON p.user_id = u.user_id
      JOIN categories c ON p.category_id = c.category_id -- Asumiendo que tienes una tabla de categorías
      WHERE p.post_id = $1;
    `;
    const values = [postId];
    const result = await dbClient.query(query, values);

    // Devuelve el primer elemento (el post único) o null si no existe
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error obteniendo post por ID:', error);
    throw error;
  }
}


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






// Verificar si es usuario dio 'like'
async function hasMoon(user_id, post_id) {
  const query = `
    SELECT 1 FROM lunas WHERE user_id = $1 AND post_id = $2
  `;
  const result = await dbClient.query(query, [user_id, post_id]);
  return result.rowCount > 0;
}

// Agregar luna 
async function addMoon(user_id, post_id) {
  const query = `
    INSERT INTO lunas (user_id, post_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING; 
  `;
  await dbClient.query(query, [user_id, post_id]);
}

// REMOVE moon
async function removeMoon(user_id, post_id) {
  const query = `
    DELETE FROM lunas WHERE user_id = $1 AND post_id = $2
  `;
  await dbClient.query(query, [user_id, post_id]);
}

// COUNT moons
async function getMoonCount(post_id) {
  const query = `
    SELECT COUNT(*) FROM lunas WHERE post_id = $1
  `;
  const { rows } = await dbClient.query(query, [post_id]);
  return parseInt(rows[0].count, 10);
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


//UPDATE post
async function updatePost(postId, content, image) {
  try {
    const query = `
      UPDATE posts
      SET content = $1,
          image = $2
      WHERE post_id = $3
      RETURNING *;
    `;
    const values = [content, image, postId];
    const result = await dbClient.query(query, values);

    if (result.rowCount === 0) {
      throw new Error('Post no encontrado');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error actualizando post:', error);
    throw error;
  }
}


// ===================================================
// EXPORTAR FUNCIONES
// ===================================================
module.exports = {
  getAllPosts,
  getPostsByUserId,
  getPostById,
  getPostsCount,
  getCategories,
  getPostsByCategory,
  createPost,
  deletePost,
  updatePost,
  addMoon,
  removeMoon,
  getMoonCount,
  hasMoon,
  getAllMoons
};
