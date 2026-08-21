// Command server 是 cute-todo 后端的唯一入口。
// 它负责装配依赖（配置、数据库、仓储、服务、处理器、路由），
// 启动 HTTP 服务，并在收到终止信号时优雅关闭。
package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"cute-todo/backend/internal/config"
	"cute-todo/backend/internal/handlers"
	"cute-todo/backend/internal/repository"
	"cute-todo/backend/internal/router"
	"cute-todo/backend/internal/services"
)

// shutdownTimeout 是收到终止信号后等待在途请求完成的最长时间。
const shutdownTimeout = 10 * time.Second

func main() {
	// 加载配置（数据库连接串、端口、JWT 密钥等，全部来自环境变量）。
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	// 连接数据库。
	db, err := config.NewGormDB()
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	// 装配仓储层。
	taskRepo := repository.NewTaskRepository(db)
	mediaRepo := repository.NewMediaRepository(db)
	authRepo := repository.NewAuthRepository(db)
	knowledgeRepo := repository.NewKnowledgeRepository(db)

	// 装配服务层。
	mediaService := services.NewMediaService(mediaRepo)
	taskService := services.NewTaskService(taskRepo)
	knowledgeService := services.NewKnowledgeService(knowledgeRepo)

	// 装配处理器层。
	taskHandler := handlers.NewTaskHandler(taskService)
	mediaHandler := handlers.NewMediaHandler(mediaService, mediaRepo)
	authHandler := handlers.NewAuthHandler(cfg.JWTSecret, authRepo)
	knowledgeHandler := handlers.NewKnowledgeHandler(knowledgeService)

	// 组装路由。
	engine := router.SetupRouter(authHandler, mediaHandler, taskHandler, knowledgeHandler)

	srv := &http.Server{
		Addr:    fmt.Sprintf(":%d", cfg.Port),
		Handler: engine,
	}

	// 在独立 goroutine 中启动服务，避免阻塞信号监听。
	go func() {
		log.Printf("server listening on %s", srv.Addr)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("server error: %v", err)
		}
	}()

	// 等待终止信号（Ctrl+C 或容器 stop）。
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("shutdown signal received, draining connections...")

	// 给在途请求预留时间后再退出。
	ctx, cancel := context.WithTimeout(context.Background(), shutdownTimeout)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("forced shutdown: %v", err)
	}
	log.Println("server stopped cleanly")
}
