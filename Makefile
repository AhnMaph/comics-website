COMPOSE = docker-compose
DC_FILE = docker-compose.yml

# ===== For local ===== #
run-backend: 
	python3 backend/manage.py runserver
run-frontend:
	cd frontend && npm run dev
migrate:
	python3 backend/manage.py migrate
makemigrations:
	python3 backend/manage.py makemigrations
add-demo-data:
	mkdir -p backend/media
	python3 backend/novel/import_data.py || true
	python3 backend/manga/import_data.py || true
	python3 backend/chapter/import_unreal_chapter.py
# ===== For docker ===== #
up:
	$(COMPOSE) -f $(DC_FILE) up --build

down:
	$(COMPOSE) -f $(DC_FILE) down -v

restart:
	$(MAKE) down
	sleep 2
	$(MAKE) up

logs:
	$(COMPOSE) -f $(DC_FILE) logs -f

build:
	$(COMPOSE) -f $(DC_FILE) build

shell-backend:
	$(COMPOSE) -f $(DC_FILE) exec backend /bin/bash

shell-frontend:
	$(COMPOSE) -f $(DC_FILE) exec frontend /bin/bash

ps:
	$(COMPOSE) -f $(DC_FILE) ps

clean:
	$(COMPOSE) -f $(DC_FILE) down -v --remove-orphans
prune:
	docker system prune -a --volumes -f
rebuild: clean build up

clean-port:
	docker ps --format '{{.ID}} {{.Ports}}' | grep '0.0.0.0:8000' | awk '{print $$1}' | xargs -r docker stop || true
	docker ps --format '{{.ID}} {{.Ports}}' | grep '0.0.0.0:5174' | awk '{print $$1}' | xargs -r docker stop
rm-network:
	docker network rm comics-website_webnet

.DEFAULT_GOAL := help
help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Local command:"
	@echo "  run-backend      Start backend"
	@echo "  run-frontend     Start frontend"
	@echo "  migrate     	  Migrate database"
	@echo "  makemigrations   Makemigrations database"
	@echo "  add-demo-data    Run backend import demo data"
	@echo ""
	@echo "Docker command:"
	@echo "  up               Start containers"
	@echo "  down             Stop containers"
	@echo "  restart          Restart containers"
	@echo "  logs             View logs"
	@echo "  build            Build containers"
	@echo "  shell-backend    Open shell in backend container"
	@echo "  shell-frontend   Open shell in frontend container"
	@echo "  ps               Show container status"
	@echo "  clean            Remove containers, volumes, orphans"
	@echo "  prune            Remove all containers, volumes, images unused"
	@echo "  rebuild          Clean, build, and up containers"
	@echo "  clean-port       Stop any container using port 8000/5174 on host"
	@echo "  rm-network       Remove the docker network"
.PHONY: run-backend rm-network run-frontend migrate makemigrations up down restart logs build shell-backend shell-frontend ps clean prune rebuild add-data-base help clean-port
