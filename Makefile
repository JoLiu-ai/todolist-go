DOCKER_COMPOSE_FILE = docker/local/docker-compose.yml

.PHONY: setup
setup:
	@if [ ! -f $(ENV_FILE) ]; then \
		echo "Creating .env file from example..."; \
		cp $(ENV_EXAMPLE_FILE) $(ENV_FILE); \
	fi

.PHONY: up
up: setup
	docker-compose -f $(DOCKER_COMPOSE_FILE) up

.PHONY: up-build
up-build: setup
	docker-compose -f $(DOCKER_COMPOSE_FILE) up --build

.PHONY: down
down:
	docker-compose -f $(DOCKER_COMPOSE_FILE) down

.PHONY: build
build:
	docker-compose -f $(DOCKER_COMPOSE_FILE) build

.PHONY: logs
logs:
	docker-compose -f $(DOCKER_COMPOSE_FILE) logs -f

.PHONY: ps
ps:
	docker-compose -f $(DOCKER_COMPOSE_FILE) ps

.PHONY: clean
clean: down
	docker-compose -f $(DOCKER_COMPOSE_FILE) down -v --remove-orphans

.PHONY: restart-frontend
restart-frontend:
	docker-compose -f $(DOCKER_COMPOSE_FILE) restart frontend

.PHONY: restart-app
restart-app:
	docker-compose -f $(DOCKER_COMPOSE_FILE) restart app

.PHONY: restart
restart: restart-app restart-frontend 