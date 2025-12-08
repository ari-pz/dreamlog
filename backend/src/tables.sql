DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(20) NOT NULL,
    bio VARCHAR(255),
    pfp VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    content VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Insert inicial
INSERT INTO users (username, password, bio, pfp) VALUES
('arito', '1234', 'always sleeping', 'https://i.pinimg.com/736x/e6/a2/39/e6a239754826cc9ea0000eaf4c72cc02.jpg');

-- Insert posts iniciales
INSERT INTO posts (user_id, content) VALUES
(1, 'soñe con un apocalipsis zombie y no sobreviví la primera noche');

