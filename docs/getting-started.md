# 项目启动指南

## 目录结构

```
cute-todo/
├── frontend/           # 前端项目目录
│   ├── src/           # 源代码
│   ├── public/        # 静态资源
│   └── package.json   # 前端依赖配置
├── backend/           # 后端项目目录
│   ├── cmd/          # 入口文件
│   ├── internal/     # 内部代码
│   └── migrations/   # 数据库迁移文件
├── docker/           # Docker 配置文件
│   ├── frontend/     # 前端 Docker 配置
│   └── backend/      # 后端 Docker 配置
└── Makefile          # 项目管理脚本
```

## 环境要求

- Docker
- Docker Compose
- Make

## 快速开始

1. 克隆项目：
   ```bash
   git clone <repository-url>
   cd cute-todo
   ```

2. 启动项目：
   ```bash
   make up
   ```
   这个命令会：
   - 构建并启动所有必要的容器
   - 运行数据库迁移
   - 启动前端和后端服务

3. 访问应用：
   - 前端：http://localhost:3000
   - 后端 API：http://localhost:8081

## 数据库配置

数据库配置位于 `docker/postgres/init.sql` 和 `backend/config/config.yaml`。

默认配置：
- 数据库：PostgreSQL 15
- 用户名：postgres
- 密码：postgres
- 数据库名：todolist
- 端口：5432

## Docker 配置

Docker 相关配置文件位置：
- 主配置：`docker-compose.yml`（项目根目录）
- 前端：`docker/frontend/Dockerfile`
- 后端：`docker/backend/Dockerfile`
- 数据库初始化：`docker/postgres/init.sql`

## Makefile 命令

项目提供了以下 Make 命令：

- `make up`：启动所有服务
- `make down`：停止所有服务
- `make restart`：重启所有服务
- `make logs`：查看服务日志
- `make migrate`：运行数据库迁移

## 开发指南

### 前端开发

1. 本地开发模式：
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. 构建：
   ```bash
   npm run build
   ```

### 后端开发

1. 本地开发模式：
   ```bash
   cd backend
   go mod download
   go run cmd/main.go
   ```

2. 构建：
   ```bash
   go build -o app cmd/main.go
   ```

### 数据库迁移

1. 创建新的迁移：
   ```bash
   cd backend
   migrate create -ext sql -dir migrations -seq migration_name
   ```

2. 运行迁移：
   ```bash
   make migrate
   ```

## 常见问题

1. 端口冲突
   - 前端默认端口：3000
   - 后端默认端口：8080
   - 数据库默认端口：5432
   
   如果遇到端口冲突，可以在 `docker-compose.yml` 中修改端口映射。

2. 数据库连接问题
   - 检查数据库容器是否正常运行：`docker ps`
   - 检查数据库日志：`docker logs cute-todo-db-1`
   - 确认数据库配置是否正确

3. 服务启动失败
   - 检查 Docker 日志：`make logs`
   - 确认所有必要的环境变量都已设置
   - 检查配置文件是否正确

## 开发环境

开发环境下的访问地址：

- 前端界面：http://localhost:5173
- 后端 API：http://localhost:8080 