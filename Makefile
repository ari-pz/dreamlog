start-db:
	cd ./backend && docker compose up -d

load-db:
	cd ./backend && docker compose exec -T postgres psql -U postgres -d dreamlog < src/tables.sql

run-backend:
	cd ./backend && npm run dev

dev: start-db load-db run-backend
