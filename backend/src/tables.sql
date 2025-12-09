CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(20) NOT NULL,
    bio VARCHAR(255),
    pfp VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
    post_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    content VARCHAR(255) NOT NULL,
    --image VARCHAR(255), 
    --lunas INT DEFAULT 0,
    --category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    --FOREIGN KEY (category_id) REFERENCES categories(category_id)
);


--CREATE TABLE IF NOT EXISTS categories (
--    category_id SERIAL PRIMARY KEY,
--    name VARCHAR(50) NOT NULL UNIQUE
--);

TRUNCATE TABLE posts, users RESTART IDENTITY CASCADE;

INSERT INTO users (username, password, bio, pfp) VALUES
('ari-dreamlog', '1234', 'im always sleeping Zzz', 'https://i.pinimg.com/736x/e6/a2/39/e6a239754826cc9ea0000eaf4c72cc02.jpg'),
('maga-dreamlog', '1234', '<3', 'https://ovicio.com.br/wp-content/uploads/2024/11/20241118-arcane-temporada-2-ovicio-1-555x555.webp'),
('bren-dreamlog', '1234', 'tengo que dormir 8 horas', 'https://i.pinimg.com/736x/c9/e4/41/c9e4411b4ae20d9a6e8abeb7f893a633.jpg');

INSERT INTO posts (user_id, content) VALUES
(1, 'sigo soñando con ascensores wtf'),
(2, 'soñe que estaba dentro de un videojuego y perdia mis tres vidas'),
(3, 'soñe que despertaba pero seguia durmiendo, esa cosa me seguia persiguiendo');









