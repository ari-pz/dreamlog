start-db:
	cd ./backend && docker compose up -d

run-backend:
	cd ./backend && npm run dev

dev: start-db run-backend
