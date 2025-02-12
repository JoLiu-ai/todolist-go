#!/bin/bash

# 从config.yaml生成环境变量
export SERVER_PORT=$(yq e '.server.port' backend/config/config.yaml)
export SERVER_HOST=$(yq e '.server.host' backend/config/config.yaml)

export DB_HOST=$(yq e '.database.host' backend/config/config.yaml)
export DB_PORT=$(yq e '.database.port' backend/config/config.yaml)
export DB_USER=$(yq e '.database.user' backend/config/config.yaml)
export DB_PASSWORD=$(yq e '.database.password' backend/config/config.yaml)
export DB_NAME=$(yq e '.database.dbname' backend/config/config.yaml)

export JWT_SECRET=$(yq e '.auth.jwt_secret' backend/config/config.yaml)

export FRONTEND_PORT=$(yq e '.frontend.port' backend/config/config.yaml)
export API_URL=$(yq e '.frontend.api_url' backend/config/config.yaml)

# 在开发环境中使用
if [ "$NODE_ENV" = "development" ]; then
  export API_URL=$(yq e '.frontend.local_api_url' backend/config/config.yaml)
fi 