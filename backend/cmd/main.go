package main

import (
	"fmt"
	"log"
	"os"

	"cute-todo/backend/internal/core/ports"
	"cute-todo/backend/internal/handlers"
	"cute-todo/backend/internal/router"
	"cute-todo/backend/internal/services"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	fmt.Println("Starting server...")

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

	fmt.Println("Connecting to database...")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	fmt.Println("Database connected successfully")

	// 初始化服务
	fmt.Println("Initializing services...")
	var mediaService ports.MediaService
	mediaService = services.NewMediaService(db)
	taskService := services.NewTaskService(db)

	// 从环境变量获取 JWT 密钥
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("JWT_SECRET environment variable is required")
	}

	// 初始化处理器
	fmt.Println("Initializing handlers...")
	authHandler := handlers.NewAuthHandler(jwtSecret, db)
	mediaHandler := handlers.NewMediaHandler(mediaService, db)
	taskHandler := handlers.NewTaskHandler(taskService)

	// 设置路由
	fmt.Println("Setting up routes...")
	r := router.SetupRouter(authHandler, mediaHandler, taskHandler)

	// 打印所有路由
	routes := r.Routes()
	fmt.Println("\nRegistered routes:")
	for _, route := range routes {
		fmt.Printf("%s %s\n", route.Method, route.Path)
	}

	// 从环境变量获取服务器端口
	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8080" // 默认端口
	}

	// 启动服务器
	fmt.Printf("\nStarting HTTP server on :%s...\n", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
