# Docker compose files
DOCKER_COMPOSE = docker/local/docker-compose.yml

# Docker compose command
DOCKER_CMD = docker compose -f $(DOCKER_COMPOSE)

# Development Environment Variables
ENV_FILE = docker/local/.env
ENV_EXAMPLE_FILE = docker/local/.env.example

.PHONY: up down build rebuild logs clean help export-env setup up-build ps restart-frontend restart-app docker-build docker-up docker-down migrate-up migrate-down lint fmt

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
	cd backend && go build -o bin/main cmd/main.go

clean: down ## Clean up all containers, volumes and binary
	$(DOCKER_CMD) down -v
	docker system prune -f
	cd backend && rm -rf bin/

up: export-env ## Start all services
	$(DOCKER_CMD) up -d

down: ## Stop all services
	$(DOCKER_CMD) down

rebuild: down export-env ## Rebuild and restart all services
	$(DOCKER_CMD) build --no-cache
	$(DOCKER_CMD) up -d

logs: ## View logs of all services
	$(DOCKER_CMD) logs -f

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
	cd backend && go run cmd/server/main.go

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

ps: ## Show running containers
	$(DOCKER_CMD) ps

restart-frontend: ## Restart frontend container
	$(DOCKER_CMD) restart frontend

restart-app: ## Restart app container
	$(DOCKER_CMD) restart app

run: ## Run backend application
	cd backend && go run cmd/main.go

test: test-frontend test-backend ## Run all tests

# Database migration commands
migrate-up: ## Run database migrations up
	cd backend && go run cmd/migrate/main.go up

migrate-down: ## Run database migrations down
	cd backend && go run cmd/migrate/main.go down

# Development helper commands
lint: ## Run backend linter
	cd backend && golangci-lint run

fmt: ## Format backend code
	cd backend && go fmt ./... 