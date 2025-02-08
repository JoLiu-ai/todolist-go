# 数据库设计文档

## 概述

项目使用 PostgreSQL 15 作为数据库。主要包含以下表：
- `media`：媒体信息表
- `media_notes`：笔记表
- `media_categories`：分类表
- `book_details`：书籍详情表
- `movie_details`：影视详情表

## 表结构

### media 表

存储所有媒体的基本信息。

```sql
CREATE TABLE media (
    id SERIAL PRIMARY KEY,
    type VARCHAR(10) NOT NULL,  -- 'book' 或 'movie'
    display_name_primary VARCHAR(255) NOT NULL,
    display_name_secondary VARCHAR(255),
    original_name_primary VARCHAR(255),
    original_name_secondary VARCHAR(255),
    creator VARCHAR(255),
    description_primary TEXT,
    description_secondary TEXT,
    cover VARCHAR(1024),
    status VARCHAR(20) NOT NULL DEFAULT 'wishlist',
    rating INTEGER DEFAULT 0,
    category_id INTEGER,
    tags TEXT[],
    resource_link VARCHAR(1024),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_media_type ON media(type);
CREATE INDEX idx_media_status ON media(status);
CREATE INDEX idx_media_category ON media(category_id);
```

### media_notes 表

存储媒体的笔记信息。

```sql
CREATE TABLE media_notes (
    id SERIAL PRIMARY KEY,
    media_id INTEGER NOT NULL REFERENCES media(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notes_media ON media_notes(media_id);
```

### media_categories 表

存储媒体分类信息。

```sql
CREATE TABLE media_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    type VARCHAR(10) NOT NULL,  -- 'book' 或 'movie'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_category_name_type ON media_categories(name, type);
```

### book_details 表

存储书籍特有的详细信息。

```sql
CREATE TABLE book_details (
    id SERIAL PRIMARY KEY,
    media_id INTEGER NOT NULL REFERENCES media(id) ON DELETE CASCADE,
    isbn VARCHAR(20),
    pages INTEGER,
    current_page INTEGER DEFAULT 0,
    publish_date DATE,
    publisher VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_book_media ON book_details(media_id);
```

### movie_details 表

存储影视作品特有的详细信息。

```sql
CREATE TABLE movie_details (
    id SERIAL PRIMARY KEY,
    media_id INTEGER NOT NULL REFERENCES media(id) ON DELETE CASCADE,
    duration INTEGER,  -- 单位：分钟
    release_date DATE,
    country VARCHAR(50),
    language VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_movie_media ON movie_details(media_id);
```

## 数据库迁移

项目使用 `golang-migrate` 管理数据库迁移。迁移文件位于 `backend/migrations` 目录。

### 迁移文件命名规则

迁移文件采用以下格式命名：
```
{version}_{description}.{direction}.sql
```

例如：
- `000001_create_media_tables.up.sql`
- `000001_create_media_tables.down.sql`

### 运行迁移

1. 创建新的迁移：
   ```bash
   migrate create -ext sql -dir migrations -seq migration_name
   ```

2. 应用迁移：
   ```bash
   migrate -path migrations -database "postgres://user:pass@host:5432/dbname?sslmode=disable" up
   ```

3. 回滚迁移：
   ```bash
   migrate -path migrations -database "postgres://user:pass@host:5432/dbname?sslmode=disable" down
   ```

## 数据备份与恢复

### 备份数据库

```bash
pg_dump -h localhost -U postgres -d todolist > backup.sql
```

### 恢复数据库

```bash
psql -h localhost -U postgres -d todolist < backup.sql
```

## 性能优化

1. 索引优化
   - 已为常用查询字段创建索引
   - 复合索引用于多字段查询
   - 唯一索引用于保证数据一致性

2. 查询优化
   - 使用 JOIN 而不是子查询
   - 适当使用视图简化复杂查询
   - 分页查询使用 LIMIT 和 OFFSET

3. 配置优化
   - 根据服务器内存调整 shared_buffers
   - 适当设置 work_mem
   - 调整 max_connections

## 监控与维护

1. 定期维护
   - VACUUM 清理无用空间
   - ANALYZE 更新统计信息
   - 检查长时间运行的查询

2. 性能监控
   - 使用 pg_stat_statements 跟踪查询性能
   - 监控表大小和索引使用情况
   - 检查死锁和阻塞查询 