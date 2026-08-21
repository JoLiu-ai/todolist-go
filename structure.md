# 项目结构总览

一个前后端分离的个人管理系统：Go(Gin + GORM) 后端 + React(Vite) 前端 + PostgreSQL。

```
todolist-go/
├── backend/                # Go 后端（模块名 cute-todo/backend）
│   ├── cmd/
│   │   ├── server/         # 唯一 HTTP 服务入口（含优雅关闭）
│   │   └── migrate/        # 数据库迁移命令
│   ├── internal/           # 私有应用代码，不对外导出
│   │   ├── config/         # 配置与数据库连接（读环境变量）
│   │   ├── models/         # 领域模型（GORM）
│   │   ├── repository/     # 数据访问层
│   │   ├── services/       # 业务逻辑层
│   │   ├── handlers/       # HTTP 处理器
│   │   ├── middleware/     # 中间件（JWT 鉴权）
│   │   └── router/         # 路由装配（Gin）
│   ├── migrations/         # golang-migrate SQL 迁移
│   ├── scripts/            # 种子数据与一次性数据脚本
│   ├── config/config.yaml  # 供 scripts/config-to-env.sh 生成环境变量
│   └── docs/               # 后端目录说明
├── frontend/               # React + Vite + TypeScript 前端
│   ├── src/
│   │   ├── api/            # 后端接口封装
│   │   ├── components/     # 组件（common/ 基础组件、layout/ 布局）
│   │   ├── contexts/       # React Context（鉴权）
│   │   ├── hooks/          # 自定义 Hooks
│   │   ├── pages/          # 页面（与路由一一对应）
│   │   ├── types/          # TypeScript 类型
│   │   ├── main.tsx        # 应用入口
│   │   └── router.tsx      # 路由表
│   └── docs/               # 前端目录说明
├── docker/                 # 容器编排
│   ├── local/              # 本地容器环境
│   ├── prod/               # 生产环境
│   ├── scripts/            # 构建 / 部署脚本
│   └── db/                 # 数据库初始化 SQL
├── docs/                   # 项目文档（入门、API、数据库）
├── scripts/                # 根级脚本（config-to-env.sh）
├── Makefile                # 开发 / Docker 命令入口
├── start.sh                # 无 Docker 本地一键启动
└── README.md
```

各子目录的详细说明见 [backend/docs/directory_structure.md](backend/docs/directory_structure.md) 与
[frontend/docs/directory_structure.md](frontend/docs/directory_structure.md)。
