FROM golang:1.22-alpine

# 设置工作目录
WORKDIR /go/src/cute-todo

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

# 创建目录结构
RUN mkdir -p /go/src/cute-todo/backend

# 复制整个项目
COPY . .

# 进入后端目录
WORKDIR /go/src/cute-todo/backend

# 下载依赖
RUN go mod download

# 确保依赖是最新的
RUN go mod tidy

# 暴露端口
EXPOSE 8080

# 创建启动脚本
COPY docker/local/start.sh /start.sh
RUN chmod +x /start.sh

# 使用启动脚本
CMD ["/start.sh"]