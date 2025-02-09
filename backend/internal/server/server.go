package server

import (
	"fmt"
	"os"

	"cute-todo/backend/internal/handlers"
	"cute-todo/backend/internal/middleware"
	"cute-todo/backend/internal/services"

	"github.com/gin-gonic/gin"
)

type Server struct {
	router *gin.Engine
}

func NewServer() *Server {
	return &Server{
		router: gin.Default(),
	}
}

func (s *Server) Start() error {
	// 从环境变量获取配置
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // 默认端口
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "your-jwt-secret" // 默认密钥
	}

	// 初始化服务和处理程序
	mediaService := services.NewMediaService()
	authHandler := handlers.NewAuthHandler(jwtSecret)
	mediaHandler := handlers.NewMediaHandler(mediaService)

	// 健康检查
	s.router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
		})
	})

	// API 路由
	v1 := s.router.Group("/api/v1")
	{
		// 认证路由
		auth := v1.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
		}

		// 媒体路由 (需要认证)
		media := v1.Group("/media")
		media.Use(middleware.GinAuthMiddleware(jwtSecret))
		{
			media.GET("", mediaHandler.List)
			media.POST("", mediaHandler.Create)
			media.GET("/:id", mediaHandler.GetByID)
			media.PUT("/:id", mediaHandler.Update)
			media.DELETE("/:id", mediaHandler.Delete)

			// 笔记相关路由
			media.POST("/:id/notes", mediaHandler.AddNote)
			media.PUT("/:mediaId/notes/:noteId", mediaHandler.UpdateNote)
			media.DELETE("/:mediaId/notes/:noteId", mediaHandler.DeleteNote)
		}
	}

	return s.router.Run(fmt.Sprintf(":%s", port))
}
