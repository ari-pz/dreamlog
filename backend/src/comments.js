const { Pool } = require("pg");
const dbClient = new Pool ({
  user: "postgres",
  password: "postgres",
  host: "localhost",
  port: 5432,
  database: "dreamlog",
});



async function getAllComments() {
  const response = await dbClient.query("SELECT * FROM comments");
  return response.rows;
}


// Obtener comentarios de un post
async function getCommentsByPostId(post_id) {
  const query = `
    SELECT 
      comments.comment_id,
      comments.user_id,
      comments.content,
      comments.url,
      comments.created_at,
      users.username
    FROM comments
    INNER JOIN users ON comments.user_id = users.user_id
    WHERE comments.post_id = $1
    ORDER BY comments.created_at ASC
  `;
  const { rows } = await dbClient.query(query, [post_id]);
  return rows;
}



// Obtener comentarios de un post
async function getCommentsByPostId(post_id) {
  const query = `
    SELECT 
      comments.comment_id,
      comments.user_id,
      comments.content,
      comments.url,
      comments.created_at,
      users.username
    FROM comments
    INNER JOIN users ON comments.user_id = users.user_id
    WHERE comments.post_id = $1
    ORDER BY comments.created_at ASC
  `;
  const { rows } = await dbClient.query(query, [post_id]);
  return rows;
}

// Crear un comentario
async function insertComment(user_id, post_id, content, url) {
  const query = `
    INSERT INTO comments (user_id, post_id, content, url)
    VALUES ($1, $2, $3, $4)
    RETURNING comment_id, created_at
  `;
  const { rows } = await dbClient.query(query, [user_id, post_id, content, url]);
  return rows[0];
}

async function deleteComment(comment_id) {
  const query = "DELETE FROM comments WHERE comment_id = $1 RETURNING *";
  const result = await dbClient.query(query, [comment_id]);
  // Retorna true si borró algo, false si no encontró nada
  return result.rowCount > 0;
}


// Actualizar comentario
async function updateComment(comment_id, content, url) {
  const query = `
    UPDATE comments
    SET content = $1,
        url = $2
    WHERE comment_id = $3
    RETURNING *;
  `;
  const values = [content, url, comment_id]; 
  const result = await dbClient.query(query, values);
  
  return result.rows[0];
}


module.exports = {
  getAllComments,
  getCommentsByPostId,
  insertComment,
  deleteComment,
  updateComment
};
