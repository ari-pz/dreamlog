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
    image VARCHAR(255), 
    lunas INT DEFAULT 0,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);


CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);






-- Insert inicial
INSERT INTO users (username, password, bio, pfp)
SELECT 'ari-dreamlog', '1234', 'im always sleeping Zzz', 'https://i.pinimg.com/736x/e6/a2/39/e6a239754826cc9ea0000eaf4c72cc02.jpg'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'ari-dreamlog');

INSERT INTO users (username, password, bio, pfp)
SELECT 'maga-dreamlog', '1234', '<3', 'https://ovicio.com.br/wp-content/uploads/2024/11/20241118-arcane-temporada-2-ovicio-1-555x555.webp'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'maga-dreamlog');

INSERT INTO users (username, password, bio, pfp)
SELECT 'bren-dreamlog', '1234', 'tengo que dormir 8 horas', 'https://i.pinimg.com/736x/c9/e4/41/c9e4411b4ae20d9a6e8abeb7f893a633.jpg'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'bren-dreamlog');



-- Insert inicial del post solo si no existe
INSERT INTO posts (user_id, content, image)
VALUES (1, 'sigo soñando con ascensores wtf', NULL);

INSERT INTO posts (user_id, content, image)
VALUES (2, 'soñe que estaba dentro de un videojuego y perdia mis tres vidas', NULL);

INSERT INTO posts (user_id, content, image)
VALUES (3, 'soñe que despertaba pero seguia durmiendo, esa cosa me seguia persiguiendo', NULL);



