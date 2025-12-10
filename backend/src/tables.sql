-- Eliminamos tablas durante el desarrollo
DROP TABLE IF EXISTS users, categories, posts, pets, lunas, comments CASCADE;

-- MASCOTAS
CREATE TABLE IF NOT EXISTS pets (
    pet_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);
INSERT INTO pets (name) VALUES
('Gato'),
('Perezoso'),
('Panda');


-- USUARIOS
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(20) NOT NULL,
    bio VARCHAR(255),
    pfp VARCHAR(255),
    pet_id INT REFERENCES pets(pet_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE
);
INSERT INTO categories (name) VALUES
('Pesadilla'),
('Recurrente'),
('Absurdo'),
('Sensorial'),
('Lucido'),
('Inquietante');



-- POSTS
CREATE TABLE IF NOT EXISTS posts (
    post_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id),
    content VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    category_id INT REFERENCES categories(category_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- LUNAS
CREATE TABLE IF NOT EXISTS lunas (
  luna_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(user_id),
  post_id INT NOT NULL REFERENCES posts(post_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, post_id) 
)

-- COMENTARIOS
CREATE TABLE IF NOT EXISTS comments (
    comment_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id),
    post_id INT NOT NULL REFERENCES posts(post_id),
    content VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
