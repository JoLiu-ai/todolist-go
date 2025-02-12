package main

import (
	"cute-todo/backend/internal/config"
	"cute-todo/backend/internal/handlers"
	"cute-todo/backend/internal/repository"
	"cute-todo/backend/internal/router"
	"cute-todo/backend/internal/services"
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// 加载配置
	cfg, err := config.Load()
	if err != nil {
		log.Fatal("Failed to load config:", err)
	}

	// 连接数据库
	db, err := gorm.Open(postgres.Open(cfg.DatabaseURL), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// 初始化存储库
	taskRepo := repository.NewTaskRepository(db)
	mediaRepo := repository.NewMediaRepository(db)
	authRepo := repository.NewAuthRepository(db)
	knowledgeRepo := repository.NewKnowledgeRepository(db)

	// 初始化服务
	mediaService := services.NewMediaService(mediaRepo)

	// 初始化处理器
	taskHandler := handlers.NewTaskHandler(taskRepo)
	mediaHandler := handlers.NewMediaHandler(mediaService, mediaRepo)
	authHandler := handlers.NewAuthHandler(cfg.JWTSecret, authRepo)
	knowledgeHandler := handlers.NewKnowledgeHandler(knowledgeRepo)

	// 设置路由
	r := router.SetupRouter(authHandler, mediaHandler, taskHandler, knowledgeHandler)

	// 启动服务器
	addr := fmt.Sprintf(":%d", cfg.Port)
	log.Printf("Server starting on %s", addr)
	if err := r.Run(addr); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
