# Frontend Directory Structure

```
frontend/
├── docs/                    # 文档
│   └── directory_structure.md
├── public/                  # 静态资源
├── src/                     # 源代码
│   ├── api/                # API 接口定义
│   │   ├── auth.ts        # 认证相关接口
│   │   └── task.ts        # 任务相关接口
│   ├── components/        # 可复用组件
│   │   ├── common/       # 通用组件
│   │   │   ├── Button/
│   │   │   └── Input/
│   │   └── layout/       # 布局组件
│   │       └── Layout.tsx
│   ├── contexts/         # React Context
│   │   └── AuthContext.tsx
│   ├── hooks/            # 自定义 Hooks
│   │   ├── useAuth.ts
│   │   └── useTasks.ts
│   ├── pages/            # 页面组件
│   │   ├── HomePage/
│   │   ├── LoginPage/
│   │   ├── TaskListPage/
│   │   └── CreateTaskPage/
│   ├── services/         # 业务逻辑服务
│   │   ├── auth.ts
│   │   └── task.ts
│   ├── types/           # TypeScript 类型定义
│   │   ├── auth.ts
│   │   └── task.ts
│   ├── utils/           # 工具函数
│   │   ├── date.ts
│   │   └── storage.ts
│   ├── styles/          # 样式文件
│   │   ├── global.css
│   │   └── variables.css
│   ├── App.tsx          # 应用程序入口
│   ├── main.tsx         # 渲染入口
│   └── routes.tsx       # 路由配置
├── .env                  # 环境变量
├── .env.development     # 开发环境变量
├── .env.production      # 生产环境变量
├── index.html           # HTML 模板
├── package.json         # 项目依赖配置
├── tsconfig.json        # TypeScript 配置
└── vite.config.ts       # Vite 配置
```

## 目录说明

- `api/`: API 接口定义，包含与后端通信的接口
- `components/`: 可复用的 React 组件
  - `common/`: 通用组件（按钮、输入框等）
  - `layout/`: 布局相关组件
- `contexts/`: React Context 定义
- `hooks/`: 自定义 React Hooks
- `pages/`: 页面级组件
- `services/`: 业务逻辑服务
- `types/`: TypeScript 类型定义
- `utils/`: 工具函数
- `styles/`: 样式文件

## 最佳实践

1. 组件结构
```
components/
└── Button/
    ├── index.tsx        # 组件实现
    ├── styles.css       # 组件样式
    └── types.ts         # 组件类型
```

2. 页面结构
```
pages/
└── HomePage/
    ├── index.tsx        # 页面组件
    ├── components/      # 页面专用组件
    ├── hooks/           # 页面专用 hooks
    └── styles.css       # 页面样式
```

## 命名规范

- 组件文件：使用 PascalCase（如 `Button.tsx`）
- 工具文件：使用 camelCase（如 `dateUtils.ts`）
- 样式文件：使用 kebab-case（如 `button-styles.css`）
- 类型定义：使用 PascalCase（如 `TaskType.ts`）

## 导入顺序

```typescript
// 1. React 相关
import React, { useState, useEffect } from 'react';

// 2. 第三方库
import { useNavigate } from 'react-router-dom';

// 3. 组件
import { Button } from '@/components/common';

// 4. Hooks
import { useAuth } from '@/hooks';

// 5. 工具函数
import { formatDate } from '@/utils';

// 6. 类型
import type { Task } from '@/types';

// 7. 样式
import './styles.css';
``` 