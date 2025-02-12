FROM node:18-alpine

WORKDIR /app

# 设置环境变量
ENV NODE_ENV=development
ENV VITE_API_URL=/api
ENV HOST=0.0.0.0
ENV PORT=5173

# 复制 package.json 和 package-lock.json
COPY frontend/package*.json ./

# 安装依赖
RUN npm install --legacy-peer-deps

# 复制源代码
COPY frontend/ ./

# 暴露端口
EXPOSE 5173

# 启动开发服务器，允许外部访问
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"] 