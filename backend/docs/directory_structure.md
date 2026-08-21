# 后端目录结构

后端为标准的 Go 分层应用，模块名 `cute-todo/backend`，采用 `cmd + internal` 布局。

```
backend/
├── cmd/                        # 可执行程序入口
│   ├── server/
│   │   └── main.go            # HTTP 服务唯一入口（装配依赖 + 优雅关闭）
│   └── migrate/
│       └── main.go            # 数据库迁移命令（golang-migrate）
├── internal/                   # 私有代码，禁止被模块外部导入
│   ├── config/
│   │   ├── config.go          # 从环境变量加载配置（端口、JWT 等）
│   │   └── database.go        # 构建 DSN 并创建 GORM 连接
│   ├── models/                # 领域模型（GORM 实体 + DTO）
│   │   ├── user.go            # User
│   │   ├── auth.go            # 登录/注册请求与响应 DTO
│   │   ├── task.go            # Task / TaskStats
│   │   ├── media.go           # Media / MediaFilter / MediaStats / HomeData + 常量
│   │   ├── note.go            # Note
│   │   ├── knowledge.go       # Knowledge
│   │   └── details.go         # BookDetails / MovieDetails
│   ├── repository/            # 数据访问层（GORM 查询）
│   │   ├── db.go
│   │   ├── user_repository.go
│   │   ├── auth_repository.go
│   │   ├── task_repository.go
│   │   ├── media_repository.go
│   │   └── knowledge_repository.go
│   ├── services/             # 业务逻辑层
│   │   ├── task_service.go
│   │   ├── media_service.go
│   │   └── knowledge_service.go
│   ├── handlers/             # HTTP 处理器（Gin）
│   │   ├── auth.go
│   │   ├── task.go
│   │   ├── media.go
│   │   └── knowledge.go
│   ├── middleware/
│   │   └── auth_middleware.go # JWT 鉴权中间件
│   └── router/
│       └── router.go         # 路由装配 + CORS + 健康检查
├── migrations/               # golang-migrate SQL 迁移
│   ├── 000001_init_schema.up.sql / .down.sql
│   └── 000002_add_knowledge.up.sql / .down.sql
├── scripts/                  # 种子数据与一次性数据处理脚本
├── config/
│   └── config.yaml           # 供 scripts/config-to-env.sh 生成环境变量（Docker/Make 流程）
├── docs/                     # 本目录
├── Dockerfile
├── .air.toml                 # air 热重载配置（构建 ./cmd/server）
└── go.mod / go.sum
```

## 分层依赖

```
router → handlers → services → repository → models
              │          │           │
          middleware   （业务规则）  （GORM/数据库）
```

- **handlers** 只负责解析请求、校验、拼装响应。
- **services** 承载业务规则（如媒体类型/状态校验、默认值）。
- **repository** 是唯一访问数据库的层，返回 `models` 中的实体。
- **models** 是纯数据结构，为每个实体显式声明 `TableName()`，与迁移中的表名严格对应。

## 配置来源

运行时配置全部来自环境变量（`internal/config` 使用 `godotenv` 读取 `.env`）：
`DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME/DB_SSLMODE/DB_TIMEZONE`、`PORT`、`JWT_SECRET`。
`config/config.yaml` 只在 Docker/Make 流程中由 `scripts/config-to-env.sh` 用 `yq` 转换为环境变量，
Go 代码本身不直接读取它。

## 入口约定

- 服务入口统一为 `./cmd/server`（`start.sh`、`Makefile`、`Dockerfile`、`.air.toml` 均指向此处）。
- 迁移入口为 `./cmd/migrate`。
