package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"cute-todo/backend/internal/adapters/repositories"
	"cute-todo/backend/internal/core/services"
	"cute-todo/backend/internal/handlers"
	"cute-todo/backend/internal/infrastructure/database"

	"github.com/gin-gonic/gin"
)

func main() {
	log.Println("Starting server...")

	// 初始化数据库
	dbConfig := database.NewConfig()
	db, err := database.Connect(dbConfig)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// 初始化仓储层
	mediaRepo := repositories.NewMediaRepository(db)

	// 初始化服务层
	mediaService := services.NewMediaService(mediaRepo)

	// 初始化处理器
	mediaHandler := handlers.NewMediaHandler(mediaService)

	// 初始化 Gin
	r := gin.Default()

	// 设置路由
	setupRoutes(r, mediaHandler)
	log.Println("Routes initialized")

	// 创建 HTTP 服务器
	srv := &http.Server{
		Addr:    ":8080",
		Handler: r,
	}

	// 优雅关闭
	go func() {
		log.Println("Server is starting on :8080")
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	// 等待中断信号
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	// 设置关闭超时
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("Server exiting")
}

func setupRoutes(r *gin.Engine, mediaHandler *handlers.MediaHandler) {
	// CORS 中间件
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// 健康检查
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
			"time":   time.Now().Format(time.RFC3339),
		})
	})

	// 注册媒体处理器路由
	mediaHandler.RegisterRoutes(r)
}
