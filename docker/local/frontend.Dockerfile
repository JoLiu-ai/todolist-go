FROM node:18-alpine

WORKDIR /app

# 安装依赖
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps

# 复制源代码
COPY frontend/ .

# 暴露端口
EXPOSE 5173

# 启动开发服务器，允许外部访问
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"] 