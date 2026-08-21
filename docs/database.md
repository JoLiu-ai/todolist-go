# 数据库设计文档

## 概述

项目使用 PostgreSQL。表结构以 `backend/migrations/` 中的 SQL 迁移为权威来源，
Go 侧对应的实体定义在 `backend/internal/models/`（每个实体通过 `TableName()` 与下表严格对应）。

| 表 | 说明 |
|----|------|
| `users` | 用户 |
| `tasks` | 待办任务 |
| `media` | 媒体（书籍/电影共用，`type` 区分） |
| `book_details` | 书籍扩展信息 |
| `movie_details` | 电影扩展信息 |
| `notes` | 挂在媒体下的笔记 |
| `knowledge` | 知识条目 |

## 表结构

### users

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

### tasks

```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    priority INTEGER DEFAULT 1,
    category VARCHAR(50) DEFAULT 'other',
    due_date TIMESTAMPTZ,
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

### media

书籍与电影共用，`type` 取 `book` / `movie`；`status` 取
`in_progress` / `completed` / `plan_to_read` / `dropped`。

```sql
CREATE TABLE media (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    creator VARCHAR(255),           -- 书籍作者 / 电影导演
    cover_image TEXT,
    status VARCHAR(50) DEFAULT 'plan_to_read',
    rating FLOAT DEFAULT 0,
    tags TEXT[],
    progress INTEGER DEFAULT 0,     -- 书籍已读页数 / 电影已看分钟数
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

### book_details

```sql
CREATE TABLE book_details (
    id SERIAL PRIMARY KEY,
    media_id INTEGER NOT NULL REFERENCES media(id),
    isbn VARCHAR(50),
    author VARCHAR(255),
    publisher VARCHAR(255),
    publish_date TIMESTAMPTZ,
    pages INTEGER,
    language VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

### movie_details

```sql
CREATE TABLE movie_details (
    id SERIAL PRIMARY KEY,
    media_id INTEGER NOT NULL REFERENCES media(id),
    director VARCHAR(255),
    cast_members TEXT[],
    release_date TIMESTAMPTZ,
    duration INTEGER,               -- 单位：分钟
    language VARCHAR(50),
    country VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

### notes

```sql
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    page INTEGER,
    media_id INTEGER NOT NULL REFERENCES media(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

### knowledge

```sql
CREATE TABLE knowledge (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'note',
    category VARCHAR(50) DEFAULT 'other',
    tags TEXT[],
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

## 数据库迁移

使用 [`golang-migrate`](https://github.com/golang-migrate/migrate) 管理迁移，文件位于 `backend/migrations/`，
命名格式 `{version}_{description}.{up|down}.sql`。

```bash
# 应用迁移（本地）
make local-migrate

# 或直接调用迁移命令
cd backend && DATABASE_URL="postgres://user:pass@host:5432/dbname?sslmode=disable" \
  go run ./cmd/migrate -direction up
```

创建新迁移：

```bash
cd backend && migrate create -ext sql -dir migrations -seq <migration_name>
```

## 备份与恢复

```bash
pg_dump -h localhost -U postgres -d todolist > backup.sql
psql   -h localhost -U postgres -d todolist < backup.sql
```
