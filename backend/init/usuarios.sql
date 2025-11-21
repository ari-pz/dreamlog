CREATE TABLE usuarios {
	id_usuario SERIAL PRIMARY KEY,
	usuario VARCHAR(50) NOT NULL,
	bio VARCHAR(100) NOT NULL,
	contrasena VARCHAR(50) NOT NULL,
	fecha_registro DATE NOT NULL
	foto_perfil TEXT DEFAULT 'foto_perfil.webp'
};
