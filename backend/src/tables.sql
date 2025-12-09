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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS categories (
    FOREIGN KEY (post_id) REFERENCES cat_post(post_id),
    FOREIGN KEY (user_id) REFERENCES cat_users(user_id)
);

-- Insert inicial
INSERT INTO users (username, password, bio, pfp)
SELECT 'arito', '1234', 'always sleeping', 'https://i.pinimg.com/736x/e6/a2/39/e6a239754826cc9ea0000eaf4c72cc02.jpg'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'arito');

-- Insert inicial del post solo si no existe
INSERT INTO posts (user_id, content)
SELECT 
    (SELECT user_id FROM users WHERE username = 'arito'),
    'Mi primer sueño en DreamLog 🌙'
WHERE NOT EXISTS (
    SELECT 1 FROM posts 
    WHERE user_id = (SELECT user_id FROM users WHERE username = 'arito')
    AND content = 'soñe con un apocalipsis zombie y no sobreviví la primera noche'
);
