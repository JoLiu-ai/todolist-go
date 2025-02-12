# 构建阶段
FROM golang:1.22-alpine AS builder

WORKDIR /app

ENV GOTOOLCHAIN=local
ENV CGO_ENABLED=0
ENV GOOS=linux

RUN apk add --no-cache git

# 复制 go mod 文件
COPY backend/go.mod backend/go.sum ./

# 下载依赖
RUN go mod download && go mod verify

# 复制源代码
COPY backend/ .

# 编译
RUN go mod tidy && \
    go build -o main ./cmd/server

# 运行阶段
FROM alpine:latest

WORKDIR /app

# 安装必要的运行时依赖
RUN apk --no-cache add ca-certificates tzdata

# 从构建阶段复制编译好的二进制文件
COPY --from=builder /app/main .
COPY --from=builder /app/config ./config

# 暴露端口
EXPOSE 8080

# 运行应用
ENTRYPOINT ["./main"] 