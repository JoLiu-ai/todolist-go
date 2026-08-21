# 项目启动指南

> 面向开发者的快速上手说明。更完整的命令列表见根目录 [README.md](../README.md)。

## 目录结构

```
todolist-go/
├── frontend/            # React + Vite 前端
│   ├── src/            # 源代码（入口 main.tsx → router.tsx）
│   ├── public/         # 静态资源
│   └── package.json
├── backend/            # Go 后端（cute-todo/backend）
│   ├── cmd/
│   │   ├── server/    # HTTP 服务入口
│   │   └── migrate/   # 迁移命令
│   ├── internal/      # 分层应用代码（config/models/repository/services/handlers/router）
│   └── migrations/    # 数据库迁移
├── docker/            # 容器编排（local / prod / scripts / db）
├── docs/              # 项目文档
├── Makefile
└── start.sh           # 无 Docker 一键启动
```

## 环境要求

- Go 1.22+
- Node.js 18+ 与 npm
- PostgreSQL 15/16
- Make
- Docker & Docker Compose（可选，仅用于容器启动）

## 快速开始（无 Docker）

确保本机 PostgreSQL 已启动，且 `backend/.env` 的连接信息可用，然后：

```bash
./start.sh
```

脚本会检查数据库、安装前端依赖、执行迁移、写入测试账号，并同时启动前后端。

访问地址：

- 前端：http://localhost:5173
- 后端 API：http://localhost:8080
- 健康检查：http://localhost:8080/health

测试账号：`test@example.com` / 用户名 `test` / 密码 `test123456`。

## 快速开始（Docker）

```bash
make up      # 启动所有服务
make logs    # 查看日志
make down    # 停止服务
```

## 配置说明

后端运行时配置全部来自环境变量（由 `backend/.env` 提供）：

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=todolist
DB_SSLMODE=disable
JWT_SECRET=<your-secret>
PORT=8080
```

`backend/config/config.yaml` 仅在 Docker/Make 流程中由 `scripts/config-to-env.sh`（依赖 `yq`）
转换为上述环境变量；Go 代码本身不直接读取该 YAML。

## 本地开发

### 前端

```bash
cd frontend
npm install
npm run dev        # 开发服务器（http://localhost:5173）
npm run build      # 生产构建（tsc + vite build）
```

### 后端

```bash
cd backend
go mod download
go run ./cmd/server   # 启动服务
go build -o bin/main ./cmd/server
```

### 数据库迁移

```bash
make local-migrate                 # 对本机 PostgreSQL 执行迁移
# 新建迁移文件：
cd backend && migrate create -ext sql -dir migrations -seq <name>
```

## 常见问题

1. **端口冲突**：前端 5173、后端 8080、数据库 5432，可在 `.env` 或 docker compose 中调整。
2. **数据库连接失败**：确认 PostgreSQL 已启动、`backend/.env` 配置正确；Docker 下用 `make logs` 查看日志。
3. **服务启动失败**：确认 `JWT_SECRET` 等必需环境变量已设置。
