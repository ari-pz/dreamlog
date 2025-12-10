INSERT INTO users (username, password, bio, pfp, pet_id) VALUES
('ari-dreamlog', '1234', 'im always sleeping Zzz', 'https://i.pinimg.com/736x/e6/a2/39/e6a239754826cc9ea0000eaf4c72cc02.jpg', 1),
('maga-dreamlog', '1234', '<3', 'https://ovicio.com.br/wp-content/uploads/2024/11/20241118-arcane-temporada-2-ovicio-1-555x555.webp', 2),
('bren-dreamlog', '1234', 'tengo que dormir 8 horas', 'https://i.pinimg.com/736x/c9/e4/41/c9e4411b4ae20d9a6e8abeb7f893a633.jpg', 3);


INSERT INTO posts (user_id, content, image, category_id) VALUES
(1, 'sigo soñando con ascensores wtf', null, 2),
(2, 'soñe que estaba dentro de un videojuego y perdia mis tres vidas', null, 3),
(3, 'soñe que despertaba pero seguia durmiendo, esa cosa me seguia persiguiendo', null, 6);


INSERT INTO comments (user_id, post_id, content) VALUES
(1, 1, 'Qué miedo con los ascensores 😱'),
(1, 2, 'Uy, los videojuegos pueden ser intensos 😅'),
(1, 3, 'Eso es demasiado extraño, me pasó algo parecido');


INSERT INTO lunas (user_id, post_id) VALUES
(1, 1),
(1, 2),
(1, 3);
       
