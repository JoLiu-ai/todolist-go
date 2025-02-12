# Backend Directory Structure

```
backend/
├── cmd/                    # 应用程序的主入口点
│   └── main.go            # 主程序入口
├── config/                 # 配置文件和配置管理
│   └── config.go          # 配置结构和加载逻辑
├── docs/                   # 文档
│   ├── api.md             # API文档
│   └── directory_structure.md  # 本文档
├── internal/              # 私有应用程序代码
│   ├── handlers/         # HTTP处理器
│   │   ├── auth.go      # 认证相关处理器
│   │   └── task.go      # 任务相关处理器
│   ├── services/        # 业务逻辑层
│   │   ├── auth.go      # 认证相关服务
│   │   └── task.go      # 任务相关服务
│   ├── middleware/      # HTTP中间件
│   │   └── auth_middleware.go  # 认证中间件
│   ├── repository/      # 数据访问层
│   │   └── repository.go       # 数据库操作
│   └── router/          # 路由配置
│       └── router.go    # 路由设置
├── models/              # 数据模型（可被其他包引用）
│   ├── task.go         # 任务模型
│   └── user.go         # 用户模型
├── pkg/                # 可以被外部应用程序使用的库代码
│   ├── database/      # 数据库相关代码
│   │   └── db.go     # 数据库连接和配置
│   └── logger/        # 日志工具
│       └── logger.go  # 日志功能
└── migrations/        # 数据库迁移文件
    ├── 000001_init_schema.up.sql
    └── 000001_init_schema.down.sql
```

## 目录说明

- `cmd/`: 包含应用程序的主入口点
- `config/`: 配置文件和配置管理
- `docs/`: 项目文档
- `internal/`: 私有应用程序代码，不能被外部导入
  - `handlers/`: HTTP请求处理器
  - `services/`: 业务逻辑层
  - `middleware/`: HTTP中间件
  - `repository/`: 数据访问层
  - `router/`: 路由配置
- `models/`: 数据模型定义
- `pkg/`: 可以被外部应用程序使用的库代码
  - `database/`: 数据库相关代码
  - `logger/`: 日志工具
- `migrations/`: 数据库迁移文件

## 依赖关系

```
handlers -> services -> repository -> models
     ↓          ↓          ↓
  router  ->  middleware -> database
``` 