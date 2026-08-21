# 构建阶段
FROM golang:1.22-alpine AS builder

WORKDIR /app

# 安装必要的系统依赖
RUN apk add --no-cache gcc musl-dev

# 复制 go mod 文件
COPY go.mod go.sum ./
RUN go mod download

# 复制源代码
COPY . .

# 编译
RUN CGO_ENABLED=1 GOOS=linux go build -o main ./cmd/server && \
    chmod +x main && \
    ls -la main

# 最终镜像
FROM alpine:latest

WORKDIR /app

# 复制编译好的二进制文件
COPY --from=builder /app/main .
RUN chmod +x main && \
    ls -la main
COPY --from=builder /app/.env.docker .env
# 复制migrations目录
COPY --from=builder /app/migrations ./migrations

# 暴露端口
EXPOSE 8080

# 启动应用
CMD ["./main"] 