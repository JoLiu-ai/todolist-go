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
- 构建工具：Make

## 快速开始

### 前置要求

- Docker & Docker Compose
- Make
- Go 1.22+ (可选，用于本地开发)

### 安装和运行

1. 克隆项目
```bash
git clone <repository-url>
cd <project-directory>
```

2. 使用 Make 启动服务
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

3. 访问服务
- 应用主页：http://localhost:8080

## 项目结构

```
.
├── backend/              # 后端 Go 应用
│   ├── cmd/             # 主程序入口
│   ├── config/          # 配置文件
│   └── ...
├── docker/              # Docker 相关文件
│   ├── local/          # 本地开发环境
│   ├── prod/           # 生产环境
│   └── scripts/        # 构建和部署脚本
└── docker-compose.yml   # Docker compose 配置
```

## 常用命令

### Make 命令

| 命令 | 说明 |
|------|------|
| `make up` | 启动所有服务 |
| `make down` | 停止所有服务 |
| `make build` | 构建服务 |
| `make logs` | 查看日志 |
| `make test` | 运行测试 |
| `make clean` | 清理环境 |

### Docker 命令

| 命令 | 说明 |
|------|------|
| `./docker/scripts/build.sh local` | 构建本地环境 |
| `./docker/scripts/build.sh prod` | 构建生产环境 |
| `./docker/scripts/deploy.sh local` | 本地部署 |
| `./docker/scripts/deploy.sh prod` | 生产环境部署 |

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

### 本地开发

1. 安装依赖：
```bash
cd backend
go mod download
```

2. 启动开发环境：
```bash
make up
```

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件
