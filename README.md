# Personal Task Management System

一个集成了任务管理、倒计时事件和笔记功能的个人管理系统。

## 功能特点

- 📝 任务管理：创建、编辑和跟踪您的日常任务
- ⏰ 倒计时事件：管理重要日期和事件
- 📒 笔记功能：记录和整理您的想法
- 🏠 个性化主页：直观展示所有重要信息

## 技术栈

- 后端：Go 1.22
- 数据库：PostgreSQL 16
- 容器化：Docker & Docker Compose
- 前端：React + Vite
- 构建工具：Make / npm

## 快速开始

### 前置要求

- Make
- Go 1.22+
- Node.js 18+ 和 npm
- PostgreSQL 15+ 或 16+
- Docker & Docker Compose（可选，仅用于容器启动）

### 不使用 Docker 启动

1. 克隆项目
```bash
git clone <repository-url>
cd <project-directory>
```

2. 准备本机 PostgreSQL

确保 PostgreSQL 已启动，并且 `backend/.env` 中的连接信息能连上本机数据库。默认配置为：

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=todolist
```

3. 一键启动

```bash
./start.sh
```

脚本会检查本机 PostgreSQL、自动创建缺失的数据库、安装前端依赖、执行后端迁移，并同时启动后端和前端。

如果默认数据库里已有其他版本的 `schema_migrations` 记录，例如旧项目留下的迁移版本高于当前仓库迁移文件，脚本会自动改用 `${DB_NAME}_local` 作为干净的本地开发库。也可以手动指定：

```bash
LOCAL_DB_NAME=todolist_dev ./start.sh
```

访问地址：

- 前端：http://localhost:5173
- 后端 API：http://localhost:8080
- 健康检查：http://localhost:8080/health

启动日志：

| 文件 | 内容 |
|------|------|
| `logs/start.log` | 依赖安装、数据库迁移、测试账号写入日志 |
| `logs/backend.log` | 后端服务运行日志和错误 |
| `logs/frontend.log` | 前端 Vite 服务运行日志和错误 |

实时查看日志：

```bash
tail -f logs/start.log logs/backend.log logs/frontend.log
```

测试账号：

| 字段 | 值 |
|------|----|
| 邮箱 | `test@example.com` |
| 用户名 | `test` |
| 密码 | `test123456` |

`./start.sh` 会自动写入这个账号。单独写入账号可以运行：

```bash
make local-seed
```

也可以使用 Make 命令分开启动：

```bash
make local-migrate
make local-seed
make local-backend
make local-frontend
```

### 使用 Docker 启动

```bash
# 启动所有服务
make up

# 查看日志
make logs

# 停止服务
make down
```

或者使用 Docker 脚本：

```bash
# 构建服务
./docker/scripts/build.sh local

# 部署服务
./docker/scripts/deploy.sh local
```

### 访问服务

- 本地开发前端：http://localhost:5173
- 后端 API：http://localhost:8080

## 项目结构

```
.
├── backend/              # 后端 Go 应用（cute-todo/backend）
│   ├── cmd/
│   │   ├── server/      # HTTP 服务入口（含优雅关闭）
│   │   └── migrate/     # 数据库迁移命令
│   ├── internal/        # 分层代码：config/models/repository/services/handlers/router
│   ├── migrations/      # 数据库迁移
│   └── config/          # config.yaml（供 config-to-env.sh 生成环境变量）
├── frontend/             # 前端 React 应用（入口 main.tsx → router.tsx）
├── docker/               # Docker 相关文件
│   ├── local/           # 本地容器环境
│   ├── prod/            # 生产环境
│   └── scripts/         # 构建和部署脚本
├── docs/                 # 项目文档（入门 / API / 数据库）
└── start.sh              # 无 Docker 本地启动脚本
```

> 完整结构见 [structure.md](structure.md)；后端 / 前端目录说明见
> [backend/docs/directory_structure.md](backend/docs/directory_structure.md) 与
> [frontend/docs/directory_structure.md](frontend/docs/directory_structure.md)。

## 常用命令

### 本地命令

| 命令 | 说明 |
|------|------|
| `./start.sh` | 不使用 Docker 启动前端、后端和迁移 |
| `make local-migrate` | 对本机 PostgreSQL 执行迁移 |
| `make local-seed` | 写入本地测试账号 |
| `make local-backend` | 本地启动后端 |
| `make local-frontend` | 本地启动前端 |

### Docker / Make 命令

| 命令 | 说明 |
|------|------|
| `make up` | 启动所有 Docker 服务 |
| `make down` | 停止 Docker 服务 |
| `make build` | 构建服务 |
| `make logs` | 查看日志 |
| `make test` | 运行测试 |
| `make clean` | 清理环境 |

### Docker 脚本

| 命令 | 说明 |
|------|------|
| `./docker/scripts/build.sh local` | 构建本地容器环境 |
| `./docker/scripts/build.sh prod` | 构建生产容器环境 |
| `./docker/scripts/deploy.sh local` | 本地容器部署 |
| `./docker/scripts/deploy.sh prod` | 生产容器部署 |

## 功能展示

### 主页
![Home Page](https://github.com/user-attachments/assets/7aca68f3-443e-4051-ac42-2d1982ae2821)

### 任务管理
![Task Management](https://github.com/user-attachments/assets/6e503c80-3d5c-4799-8382-f8c7d99b484d)

### 倒计时事件
![Countdown Events](https://github.com/user-attachments/assets/1ca471be-010f-4c87-8207-4951b799071b)

### 笔记系统
![Notes](https://github.com/user-attachments/assets/d3329599-6870-4f24-a98d-befc4745dd2f)

## 开发

### 后端依赖

```bash
cd backend
go mod download
```

### 前端依赖

```bash
cd frontend
npm install
```

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件
