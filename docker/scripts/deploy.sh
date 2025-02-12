#!/bin/bash

# 设置环境变量
ENV=${1:-local}  # 默认为 local 环境

if [ "$ENV" = "prod" ]; then
    docker-compose -f docker-compose.prod.yml up -d
else
    docker-compose up -d
fi

echo "Deployment completed for $ENV environment" 