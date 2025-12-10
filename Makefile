# Levanta los contenedores en segundo plano
start-db:
	cd ./backend && docker compose up -d

# Detiene los contendores
stop-db:
	cd ./backend && docker compose down 

# Carga las tablas de la base de datos
load-db:
	sleep 5
	cd ./backend && docker compose exec -T postgres psql -U postgres -d dreamlog < src/tables.sql

# Carga datos de prueba (posts, users, comments...)
seed-db:
	cd ./backend && docker compose exec -T postgres psql -U postgres -d dreamlog < src/tests.sql

# Ejecuta el backend con nodemon
run-backend:
	cd ./backend && npm run dev

# Ejecuta el backend de forma normal
start-backend:
	cd ./backend && npm start

# Modo desarrollo completo: levanta DB, crea tablas, inserta test y corre backend
dev: start-db load-db seed-db run-backend
