package main

import (
	"cute-todo/backend/internal/handlers"
	"cute-todo/backend/internal/repository"
	"cute-todo/backend/internal/router"
	"cute-todo/backend/internal/services"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// 加载环境变量
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found")
	}

	// 从环境变量获取数据库配置
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbSSLMode := os.Getenv("DB_SSLMODE")
	dbTimeZone := os.Getenv("DB_TIMEZONE")

	// 构建数据库连接字符串
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s TimeZone=%s",
		dbHost, dbPort, dbUser, dbPass, dbName, dbSSLMode, dbTimeZone,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// 初始化 repositories
	authRepo := repository.NewAuthRepository(db)
	mediaRepo := repository.NewMediaRepository(db)
	taskRepo := repository.NewTaskRepository(db)
	knowledgeRepo := repository.NewKnowledgeRepository(db)

	// 初始化 services
	mediaService := services.NewMediaService(mediaRepo)

	// 初始化 handlers
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("JWT_SECRET environment variable is not set")
	}

	authHandler := handlers.NewAuthHandler(jwtSecret, authRepo)
	mediaHandler := handlers.NewMediaHandler(mediaService, mediaRepo)
	taskHandler := handlers.NewTaskHandler(taskRepo)
	knowledgeHandler := handlers.NewKnowledgeHandler(knowledgeRepo)

	// 设置路由
	r := router.SetupRouter(authHandler, mediaHandler, taskHandler, knowledgeHandler)

	// 启动服务器
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
