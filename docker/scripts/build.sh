#!/bin/bash

# 设置环境变量
ENV=${1:-local}  # 默认为 local 环境

# 构建后端镜像
if [ "$ENV" = "prod" ]; then
    docker build -t backend:prod -f docker/prod/backend.Dockerfile .
else
    docker build -t backend:local -f docker/local/backend.Dockerfile .
fi

echo "Build completed for $ENV environment" 