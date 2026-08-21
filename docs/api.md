# API 文档

## 基础信息

- 基础 URL：`http://localhost:8080`
- API 前缀：`/api/v1`（健康检查 `/health` 除外）
- 请求与响应均为 JSON
- 鉴权：受保护接口需在请求头携带 `Authorization: Bearer <token>`

### 健康检查

```http
GET /health
```

```json
{ "status": "ok", "time": "2026-08-22T10:00:00Z" }
```

## 认证

### 注册

```http
POST /api/v1/auth/register
```

请求体（`username` 可选，缺省时取邮箱前缀）：

```json
{ "email": "test@example.com", "password": "test123456", "username": "test" }
```

响应：

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "email": "test@example.com", "username": "test" }
}
```

### 登录

```http
POST /api/v1/auth/login
```

请求体（`username` 字段可传用户名或邮箱）：

```json
{ "username": "test", "password": "test123456" }
```

响应同注册。

### 获取当前用户

```http
GET /api/v1/auth/profile        （需鉴权）
```

## 媒体（书籍 / 电影，需鉴权）

媒体记录字段：`type`(`book`|`movie`)、`title`、`description`、`creator`、`cover_image`、
`status`(`in_progress`|`completed`|`plan_to_read`|`dropped`)、`rating`、`tags`(字符串数组)、`progress`。

### 列表

```http
GET /api/v1/media?type={book|movie}&status=&title=&creator=&rating=&page=1&page_size=20
```

```json
{ "items": [ /* Media[] */ ], "total": 42, "page": 1, "size": 20 }
```

### 创建 / 详情 / 更新 / 删除

```http
POST   /api/v1/media
GET    /api/v1/media/:id
PUT    /api/v1/media/:id
DELETE /api/v1/media/:id
```

创建请求体示例：

```json
{
  "type": "book",
  "title": "三体",
  "creator": "刘慈欣",
  "description": "地球文明向宇宙发出广播……",
  "status": "in_progress",
  "rating": 5,
  "tags": ["科幻", "硬科幻"],
  "progress": 120
}
```

`GET /api/v1/media/:id` 返回媒体本身、关联笔记与书籍/电影详情：

```json
{ "media": { /* Media */ }, "notes": [ /* Note[] */ ], "details": { /* BookDetails|MovieDetails */ } }
```

### 统计与最近

```http
GET /api/v1/media/stats
GET /api/v1/media/recent?limit=5
```

`stats` 响应：

```json
{ "total_books": 10, "reading_books": 2, "total_movies": 8, "watching_movies": 1 }
```

## 笔记（挂在媒体下，需鉴权）

```http
POST   /api/v1/media/:id/notes
PUT    /api/v1/media/:id/notes/:noteId
DELETE /api/v1/media/:id/notes/:noteId
```

请求体：

```json
{ "content": "这是一条笔记", "page": 42 }
```

## 任务（需鉴权）

任务字段：`title`、`description`、`status`、`priority`(整数)、`category`、`due_date`。

```http
POST   /api/v1/tasks
GET    /api/v1/tasks
GET    /api/v1/tasks/today
GET    /api/v1/tasks/stats
GET    /api/v1/tasks/:id
PUT    /api/v1/tasks/:id
DELETE /api/v1/tasks/:id
```

创建请求体：

```json
{
  "title": "完成项目文档",
  "description": "编写技术文档",
  "priority": 1,
  "category": "work",
  "due_date": "2026-09-20T15:00:00Z"
}
```

`stats` 响应：

```json
{ "total_tasks": 12, "completed_tasks": 5, "pending_tasks": 7, "overdue_tasks": 2 }
```

## 知识条目（需鉴权）

字段：`title`、`content`、`type`、`category`、`tags`(字符串数组)。

```http
POST   /api/v1/knowledge
GET    /api/v1/knowledge
GET    /api/v1/knowledge/:id
PUT    /api/v1/knowledge/:id
DELETE /api/v1/knowledge/:id
```

## 首页公开数据

```http
GET /api/v1/home
```

## 错误处理

错误统一返回对应 HTTP 状态码与消息体：

```json
{ "error": "错误信息描述" }
```

常见状态码：`200` 成功、`201` 已创建、`400` 参数错误、`401` 未认证、`404` 资源不存在、`500` 服务器错误。
