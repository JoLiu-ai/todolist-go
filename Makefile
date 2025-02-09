.PHONY: up down build rebuild logs clean help

# Default target
.DEFAULT_GOAL := help

# Docker compose files
DOCKER_COMPOSE = docker/local/docker-compose.yml

help: ## Show this help message
	@echo 'Usage:'
	@echo '  make <target>'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*##"; printf "\033[36m"} /^[a-zA-Z_-]+:.*?##/ { printf "  %-15s %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

up: ## Start all services
	docker-compose -f $(DOCKER_COMPOSE) up -d

down: ## Stop all services
	docker-compose -f $(DOCKER_COMPOSE) down

build: ## Build all services
	docker-compose -f $(DOCKER_COMPOSE) build

rebuild: down ## Rebuild and restart all services
	docker-compose -f $(DOCKER_COMPOSE) build --no-cache
	docker-compose -f $(DOCKER_COMPOSE) up -d

logs: ## View logs of all services
	docker-compose -f $(DOCKER_COMPOSE) logs -f

clean: down ## Clean up all containers and volumes
	docker-compose -f $(DOCKER_COMPOSE) down -v
	docker system prune -f

frontend-shell: ## Open a shell in the frontend container
	docker-compose -f $(DOCKER_COMPOSE) exec frontend sh

backend-shell: ## Open a shell in the backend container
	docker-compose -f $(DOCKER_COMPOSE) exec backend sh

db-shell: ## Open a shell in the database container
	docker-compose -f $(DOCKER_COMPOSE) exec db psql -U postgres -d cute_todo

# 前端开发
dev-frontend:
	cd frontend && npm run dev

# 后端开发
dev-backend:
	cd backend && go run cmd/server/main.go

# 安装前端依赖
install-frontend:
	cd frontend && npm install

# 安装后端依赖
install-backend:
	cd backend && go mod download

# 初始化数据库
init-db:
	docker compose -f docker/local/docker-compose.yml exec db psql -U postgres -d cute_todo -f /docker-entrypoint-initdb.d/init.sql

# 生成前端类型
gen-types:
	cd frontend && npm run generate-types

# 运行前端测试
test-frontend:
	cd frontend && npm test

# 运行后端测试
test-backend:
	cd backend && go test ./...

.PHONY: setup
setup:
	@if [ ! -f $(ENV_FILE) ]; then \
		echo "Creating .env file from example..."; \
		cp $(ENV_EXAMPLE_FILE) $(ENV_FILE); \
	fi

.PHONY: up-build
up-build: setup
	docker-compose -f $(DOCKER_COMPOSE) up --build

.PHONY: ps
ps:
	docker-compose -f $(DOCKER_COMPOSE) ps

.PHONY: restart-frontend
restart-frontend:
	docker-compose -f $(DOCKER_COMPOSE) restart frontend

.PHONY: restart-app
restart-app:
	docker-compose -f $(DOCKER_COMPOSE) restart app

.PHONY: build run test clean docker-build docker-up docker-down

# 开发环境命令
build:
	cd backend && go build -o bin/main cmd/main.go

run:
	cd backend && go run cmd/main.go

test:
	cd backend && go test ./...

clean:
	cd backend && rm -rf bin/

# Docker 相关命令
docker-build:
	docker-compose build

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

# 数据库迁移命令
migrate-up:
	cd backend && go run cmd/migrate/main.go up

migrate-down:
	cd backend && go run cmd/migrate/main.go down

# 开发辅助命令
lint:
	cd backend && golangci-lint run

fmt:
	cd backend && go fmt ./... 