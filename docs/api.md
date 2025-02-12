# API 文档

## 基础信息

- 基础 URL：`http://localhost:8080`
- API 版本：v1
- 所有请求和响应均使用 JSON 格式

## 媒体管理

### 获取媒体列表

```http
GET /api/v1/media?type={type}
```

参数：
- `type`：媒体类型，可选值：`book` 或 `movie`

响应示例：
```json
[
  {
    "id": 1,
    "type": "book",
    "display_name": {
      "primary": "三体",
      "secondary": null
    },
    "original_name": {
      "primary": "The Three-Body Problem",
      "secondary": null
    },
    "creator": "刘慈欣",
    "description": {
      "primary": "地球文明向宇宙发出广播，被三体文明接收到...",
      "secondary": null
    },
    "cover": "https://example.com/cover.jpg",
    "status": "finished",
    "rating": 5,
    "category_id": 1,
    "tags": ["科幻", "硬科幻"],
    "resource_link": "https://example.com/book",
    "notes": []
  }
]
```

### 获取单个媒体详情

```http
GET /api/v1/media/{id}
```

参数：
- `id`：媒体 ID

响应格式同上。

### 创建媒体

```http
POST /api/v1/media
```

请求体示例：
```json
{
  "type": "book",
  "display_name": {
    "primary": "三体"
  },
  "original_name": {
    "primary": "The Three-Body Problem"
  },
  "creator": "刘慈欣",
  "description": {
    "primary": "地球文明向宇宙发出广播，被三体文明接收到..."
  },
  "cover": "https://example.com/cover.jpg",
  "status": "finished",
  "rating": 5,
  "category_id": 1,
  "tags": ["科幻", "硬科幻"],
  "resource_link": "https://example.com/book"
}
```

### 更新媒体

```http
PUT /api/v1/media/{id}
```

请求体格式同创建媒体。

### 删除媒体

```http
DELETE /api/v1/media/{id}
```

## 笔记管理

### 获取媒体的笔记列表

```http
GET /api/v1/media/{id}/notes
```

响应示例：
```json
[
  {
    "id": 1,
    "media_id": 1,
    "content": "这是一条笔记",
    "created_at": "2024-01-26T12:00:00Z",
    "updated_at": "2024-01-26T12:00:00Z"
  }
]
```

### 添加笔记

```http
POST /api/v1/media/{id}/notes
```

请求体示例：
```json
{
  "content": "这是一条新笔记"
}
```

### 更新笔记

```http
PUT /api/v1/media/{id}/notes/{note_id}
```

请求体示例：
```json
{
  "content": "更新后的笔记内容"
}
```

### 删除笔记

```http
DELETE /api/v1/media/{id}/notes/{note_id}
```

## 分类管理

### 获取分类列表

```http
GET /api/v1/categories?type={type}
```

参数：
- `type`：媒体类型，可选值：`book` 或 `movie`

响应示例：
```json
[
  {
    "id": 1,
    "name": "科幻",
    "type": "book"
  }
]
```

### 创建分类

```http
POST /api/v1/categories
```

请求体示例：
```json
{
  "name": "科幻",
  "type": "book"
}
```

### 更新分类

```http
PUT /api/v1/categories/{id}
```

请求体格式同创建分类。

### 删除分类

```http
DELETE /api/v1/categories/{id}
```

## 任务管理

### 创建任务

POST /api/tasks

请求体：
```json
{
    "title": "完成项目文档",
    "description": "编写项目的技术文档和用户手册",
    "priority": 1,
    "due_date": "2024-03-20T15:00:00Z"
}
```

### 获取任务列表

GET /api/tasks?status=pending

查询参数：
- status: 任务状态（可选）

### 更新任务

PUT /api/tasks/:id

请求体：
```json
{
    "status": "completed",
    "priority": 2
}
```

### 删除任务

DELETE /api/tasks/:id

## 认证 API

### 登录

```http
POST /api/v1/auth/login

请求体：
{
    "username": "your_username",
    "password": "your_password"
}

响应：
{
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
        "id": 1,
        "username": "your_username"
    }
}
```

## 错误处理

所有 API 在发生错误时会返回相应的 HTTP 状态码和错误信息：

```json
{
  "error": "错误信息描述"
}
```

常见状态码：
- 200：成功
- 400：请求参数错误
- 404：资源不存在
- 500：服务器内部错误 