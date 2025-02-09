FROM golang:1.22-alpine

WORKDIR /app

# 设置环境变量
ENV GOTOOLCHAIN=local

# 安装依赖
RUN apk add --no-cache git

# 复制 go.mod 和 go.sum
COPY backend/go.mod backend/go.sum ./

# 下载并验证依赖
RUN go mod download && go mod verify

# 复制源代码
COPY backend/ .

# 构建应用
RUN go mod tidy && go build -o main ./cmd/server

# 暴露端口
EXPOSE 8080

# 运行应用
CMD ["./main"] 