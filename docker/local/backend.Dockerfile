FROM golang:1.22-alpine

WORKDIR /app

# 安装必要的系统依赖
RUN apk add --no-cache gcc musl-dev git

# 安装指定版本的 air
RUN go install github.com/cosmtrek/air@v1.44.0

# 创建 tmp 目录
RUN mkdir -p /app/tmp

# 复制 go.mod 和 go.sum
COPY go.mod go.sum ./

# 预先下载依赖
RUN go mod download

# 复制源代码
COPY . .

# 确保依赖是最新的
RUN go mod tidy

# 暴露端口
EXPOSE 8080

# 使用 air 运行应用（支持热重载）
CMD ["air", "-c", ".air.toml"] 