# 前端目录结构

前端为 React + Vite + TypeScript 单页应用。入口链路为
`index.html → src/main.tsx → src/router.tsx`。

```
frontend/
├── public/                  # 静态资源（favicon 等）
├── src/
│   ├── api/                 # 后端接口封装
│   │   ├── client.ts        # Axios 实例 + 鉴权/媒体接口
│   │   ├── config.ts        # API 基础配置
│   │   ├── tasks.ts         # 任务接口
│   │   └── media.ts         # 媒体接口
│   ├── components/
│   │   ├── common/          # 基础组件
│   │   │   ├── Button/      # index.tsx + styles.css + types.ts
│   │   │   └── Input/
│   │   ├── layout/          # 布局组件（Layout / Header / Sidebar）
│   │   ├── Layout.tsx       # 页面通用布局（多数页面使用）
│   │   ├── MediaCard.tsx    # 媒体卡片
│   │   ├── ProtectedRoute.tsx
│   │   └── withAuth.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx  # 全局鉴权状态
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── pages/               # 页面组件，与 router.tsx 一一对应
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx / RegisterPage.tsx
│   │   ├── TaskListPage.tsx / TaskDetailPage.tsx / CreateTaskPage.tsx / EditTaskPage.tsx
│   │   ├── MediaPage.tsx / MediaDetailPage.tsx / CreateMediaPage.tsx
│   │   ├── KnowledgePage.tsx / KnowledgeDetailPage.tsx / CreateKnowledgePage.tsx / EditKnowledgePage.tsx
│   │   └── NotFoundPage.tsx
│   ├── types/               # TypeScript 类型（含 media.ts / types.ts 与全局声明）
│   ├── index.css            # 全局样式（Tailwind 入口）
│   ├── main.tsx             # 应用入口（Providers + Router）
│   └── router.tsx           # 路由表
├── docs/                    # 本目录
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## 约定

- **入口**：`main.tsx` 挂载 `AuthProvider` + React Query + `RouterProvider`，路由表在 `router.tsx`。
- **路径别名**：`@/*` 指向 `src/*`（见 `tsconfig.json` 与 `vite.config.ts`）。
- **页面即路由**：`src/pages/*.tsx` 与 `router.tsx` 中的条目一一对应，受保护页面用 `ProtectedRoute` 包裹。
- **基础组件**：`components/common/<Name>/` 采用 `index.tsx + styles.css + types.ts` 三件套。

## 命名规范

- 组件 / 页面文件：PascalCase（`MediaCard.tsx`）。
- Hooks / 工具：camelCase（`useAuth.ts`）。
- 类型定义：PascalCase 接口名，集中在 `src/types/`。
