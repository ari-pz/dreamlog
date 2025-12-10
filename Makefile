# ==========================
# Base de datos (Docker)
# ==========================

# Levanta los contenedores en segundo plano
start-db:
	cd ./backend && docker compose up -d

# Espera a Postgres y luego crea tablas
load-db:
	cd ./backend && \
	docker compose exec -T postgres sh -c "until pg_isready -U postgres; do sleep 1; done; psql -U postgres -d dreamlog < src/tables.sql"

# Inserta datos de prueba
seed-db:
	cd ./backend && \
	docker compose exec -T postgres psql -U postgres -d dreamlog < src/tests.sql

# ==========================
# Backend
# ==========================

run-backend:
	cd ./backend && npm run dev

# ==========================
# Flujo combinado
# ==========================

# Solo crea DB
setup-db: start-db load-db

# Crea DB + test data
test-db: setup-db seed-db

# Desarrollo completo
dev: test-db run-backend
