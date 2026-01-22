const { Pool } = require("pg");
const dbClient = new Pool ({
  user: "postgres",
  password: "postgres",
  host: "localhost",
  port: 5432,
  database: "dreamlog",
});

//Testeo conexion
dbClient.on('connect', () => {
  console.log('Conectado a PostgreSQL (users.js)');
});

// ===================================================
// VALIDACIÓN DE CONTRASEÑA
// ===================================================
function isValidPassword(password) {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
  return regex.test(password);
}

// ===================================================
// VALIDACIÓN DE USERNAME
// ===================================================
function isValidUsername(username) {
  return typeof username === "string" && username.length >= 4;
}


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
async function createUser({ username, password, bio, pfp, pet_id }) {

  if (!isValidUsername(username)) {
    throw new Error(
      "El nombre de usuario debe tener al menos 4 caracteres"
    );
  }

  if (!isValidPassword(password)) {
    throw new Error(
      'La contraseña debe tener: mínimo 8 caracteres, una mayúscula, un número, un caracter especial (!@#$...)'
    );
  }
  
  const result = await dbClient.query( 
    `INSERT INTO users (username, password, bio, pfp, pet_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [username, password, bio, pfp, pet_id]
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


//MODIFICAR Datos del Usuario
async function updateUser(user_id, username, password, bio, pfp) {
    try {
        let campos = [];
        let valores = [];
        let contador = 1;

        if (username) {
            campos.push(`username = $${contador}`);
            valores.push(username);
            contador = contador + 1;
        }
      
        if (password) {

            if (!isValidPassword(password)) {
                throw new Error(
                  'La contraseña debe tener: mínimo 8 caracteres, una mayúscula, un número, un caracter especial (!@#$...)'
                );
            }

            campos.push(`password = $${contador}`);
            valores.push(password);
            contador = contador + 1;
        }


        if (bio !== undefined && bio !== null) { 
            campos.push(`bio = $${contador}`);
            valores.push(bio);
            contador = contador + 1;
        }

        if (pfp) { 
            campos.push(`pfp = $${contador}`);
            valores.push(pfp);
            contador = contador + 1;
        }

        if (campos.length === 0) {
            console.log('No hay campos que actualizar');
            return undefined;
        }

        valores.push(user_id)
        const query = `UPDATE users SET ${campos.join(', ')} WHERE user_id = $${contador}`;

        console.log('Query:', query); 
        console.log('Valores:', valores); 


        const result = await dbClient.query(query, valores);
        console.log('Filas actualizadas:', result.rowCount)

        if (result.rowCount === 0) {
            console.log('No se encontro el usuari')
            return undefined;
        }

        const usuarioActualizado = await getUserById(user_id);
        return usuarioActualizado;

    } catch (error) {
        console.error('Error actualizando perfil:', error);
        return undefined;
    }
}



// Verificar si un nombre ya está en uso.  Si ya existe el nombre => True
async function nameInUse(username, excluyendoUserId = null) {
    try {
        let query, params;
        
        if (excluyendoUserId) {
            query = "SELECT user_id FROM users WHERE username = $1 and user_id != $2";
            params = [username, excluyendoUserId];
        } else {
            query = "SELECT user_id FROM users WHERE username = $1";
            params = [username];
        }
        
        const result = await dbClient.query(query, params);
        
        return result.rowCount > 0;
    } catch (error) {
        console.error('Error verificando nombre:', error);
        return undefined;
    }
}


//ELIMINAR Usuario
async function deleteUser(user_id) {
    try {
        const query = "DELETE FROM users WHERE user_id = $1";
        const result = await dbClient.query(query, [user_id]);
        
        console.log('Usuario eliminado, filas afectadas:', result.rowCount);
        
        if (result.rowCount === 0) {
            return false; 
        }
        return true;
        
    } catch (error) {
        console.error('Error eliminando usuario:', error);
        return false;
    }
}

module.exports = {
    getLoggedUserProfile,
    getAllUsers,
    getUserById,
    getUserByUsername,
    createUser,
    updateUser,
    nameInUse, 
    deleteUser
};
