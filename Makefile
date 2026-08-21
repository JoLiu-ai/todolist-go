# Docker compose files
DOCKER_COMPOSE = docker/local/docker-compose.yml

# Docker compose command
DOCKER_CMD = docker compose -f $(DOCKER_COMPOSE)

# Development Environment Variables
ENV_FILE = docker/local/.env
ENV_EXAMPLE_FILE = docker/local/.env.example

# Database URL construction
define DATABASE_URL
postgres://$(DB_USER):$(DB_PASSWORD)@$(DB_HOST):5432/$(DB_NAME)?sslmode=$(DB_SSL_MODE)
endef

.PHONY: up down build rebuild logs clean help export-env setup up-build ps restart-frontend restart-backend docker-build docker-up docker-down migrate-up migrate-down lint fmt tidy docker-dev local-start local-migrate local-seed local-backend local-frontend

# Default target
.DEFAULT_GOAL := help

export-env: ## Export environment variables from config
	@chmod +x scripts/config-to-env.sh
	@. ./scripts/config-to-env.sh

help: ## Show this help message
	@echo 'Usage:'
	@echo '  make <target>'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*##"; printf "\033[36m"} /^[a-zA-Z_-]+:.*?##/ { printf "  %-15s %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

build: export-env ## Build all services and backend binary
	$(DOCKER_CMD) build
	cd backend && go build -o bin/main ./cmd/server

clean: down ## Clean up all containers, volumes and binary
	$(DOCKER_CMD) down -v
	docker system prune -f
	cd backend && rm -rf bin/

up: export-env ## Start services (usage: make up service=backend)
	@if [ "$(service)" ]; then \
		$(DOCKER_CMD) up -d $(service); \
	else \
		$(DOCKER_CMD) up -d; \
	fi

down: ## Stop services (usage: make down service=backend)
	@if [ "$(service)" ]; then \
		$(DOCKER_CMD) down $(service); \
	else \
		$(DOCKER_CMD) down; \
	fi

rebuild: down export-env ## Rebuild and restart all services
	$(DOCKER_CMD) build --no-cache
	$(DOCKER_CMD) up -d

logs: ## View logs (usage: make logs service=backend)
	@if [ "$(service)" ]; then \
		$(DOCKER_CMD) logs -f $(service); \
	else \
		$(DOCKER_CMD) logs -f; \
	fi

exec: ## Execute command in container (usage: make exec service=backend cmd="sh")
	@if [ "$(service)" ] && [ "$(cmd)" ]; then \
		$(DOCKER_CMD) exec $(service) $(cmd); \
	else \
		echo "Usage: make exec service=<service_name> cmd=<command>"; \
		exit 1; \
	fi

%: ## Catch-all target for passing arguments
	@:

frontend-shell: ## Open a shell in the frontend container
	$(DOCKER_CMD) exec frontend sh

backend-shell: ## Open a shell in the backend container
	$(DOCKER_CMD) exec backend sh

db-shell: ## Open a shell in the database container
	$(DOCKER_CMD) exec db psql -U postgres -d cute_todo

# Development commands
dev-frontend: ## Start frontend development server
	cd frontend && npm run dev

dev-backend: ## Start backend development server
	cd backend && go run ./cmd/server

local-start: ## Start frontend and backend locally without Docker
	./start.sh

local-migrate: ## Run database migrations against local PostgreSQL
	cd backend && set -a && . ./.env && set +a && DATABASE_URL="postgres://$$DB_USER:$$DB_PASSWORD@$$DB_HOST:$$DB_PORT/$$DB_NAME?sslmode=$${DB_SSLMODE:-disable}" go run cmd/migrate/main.go -direction up

local-seed: ## Seed local PostgreSQL with the test account
	cd backend && set -a && . ./.env && set +a && PGPASSWORD="$$DB_PASSWORD" psql -v ON_ERROR_STOP=1 -h "$$DB_HOST" -p "$$DB_PORT" -U "$$DB_USER" -d "$${LOCAL_DB_NAME:-$$DB_NAME}" -f scripts/seed_test_user.sql

local-backend: ## Start backend locally without Docker
	cd backend && go run ./cmd/server

local-frontend: ## Start frontend locally without Docker
	cd frontend && npm run dev

install-frontend: ## Install frontend dependencies
	cd frontend && npm install

install-backend: ## Install backend dependencies
	cd backend && go mod download

init-db: ## Initialize database
	$(DOCKER_CMD) exec db psql -U postgres -d cute_todo -f /docker-entrypoint-initdb.d/init.sql

gen-types: ## Generate frontend types
	cd frontend && npm run generate-types

test-frontend: ## Run frontend tests
	cd frontend && npm test

test-backend: ## Run backend tests
	cd backend && go test ./...

setup: ## Setup initial configuration
	@if [ ! -f $(ENV_FILE) ]; then \
		echo "Creating .env file from example..."; \
		cp $(ENV_EXAMPLE_FILE) $(ENV_FILE); \
	fi

up-build: setup ## Build and start all services
	$(DOCKER_CMD) up --build

ps: ## List containers (usage: make ps service=backend)
	@if [ "$(service)" ]; then \
		$(DOCKER_CMD) ps | grep $(service); \
	else \
		$(DOCKER_CMD) ps; \
	fi

restart: ## Restart services (usage: make restart service=backend)
	@if [ "$(service)" ]; then \
		$(DOCKER_CMD) restart $(service); \
	else \
		echo "Usage: make restart service=<service_name>"; \
		exit 1; \
	fi

run: ## Run backend application
	cd backend && go run ./cmd/server

test: test-frontend test-backend ## Run all tests

# Database migration commands
migrate-deps: ## Install migration dependencies
	cd backend && go get -u github.com/golang-migrate/migrate/v4
	cd backend && go get -u github.com/golang-migrate/migrate/v4/database/postgres
	cd backend && go get -u github.com/golang-migrate/migrate/v4/source/file
	cd backend && go mod tidy

migrate-up: migrate-deps ## Run database migrations up
	$(DOCKER_CMD) exec backend sh -c 'cd /app && DATABASE_URL="postgres://$$DB_USER:$$DB_PASSWORD@db:5432/$$DB_NAME?sslmode=$$DB_SSL_MODE" go run cmd/migrate/main.go -direction up'

migrate-down: migrate-deps ## Run database migrations down
	$(DOCKER_CMD) exec backend sh -c 'cd /app && DATABASE_URL="postgres://$$DB_USER:$$DB_PASSWORD@db:5432/$$DB_NAME?sslmode=$$DB_SSL_MODE" go run cmd/migrate/main.go -direction down'

# Development helper commands
lint: ## Run backend linter
	cd backend && golangci-lint run

fmt: ## Format backend code
	cd backend && go fmt ./...

tidy:
	$(DOCKER_CMD) exec backend sh -c "cd /app && go mod tidy"
	$(DOCKER_CMD) restart backend

docker-up: ## Quick build and start services without setup checks
	$(DOCKER_CMD) up --build -d

docker-dev: ## Build and start services using cache (faster, no dependency downloads)
	$(DOCKER_CMD) build --no-deps
	$(DOCKER_CMD) up -d 
