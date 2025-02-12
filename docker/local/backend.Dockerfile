FROM golang:1.22-alpine

# 设置工作目录
WORKDIR /app

# 设置 Go 模块路径和代理
ENV GO111MODULE=on
ENV GOPROXY=https://goproxy.cn,direct
ENV CGO_ENABLED=0
ENV GOOS=linux

# 安装必要的系统依赖
RUN apk add --no-cache gcc musl-dev git curl netcat-openbsd postgresql-client

# 安装 golang-migrate
RUN go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

# 安装 air
RUN go install github.com/cosmtrek/air@v1.44.0

# 首先只复制依赖文件
COPY backend/go.mod backend/go.sum ./

# 下载依赖
RUN go mod download && go mod verify

# 复制后端源代码
COPY backend/ .

# 确保依赖是最新的
RUN go mod tidy

# 暴露端口
EXPOSE 8080

# 创建启动脚本
COPY docker/local/start.sh /start.sh
RUN chmod +x /start.sh

# 使用启动脚本
CMD ["/start.sh"]