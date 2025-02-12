package router

import (
	"cute-todo/backend/internal/handlers"
	"cute-todo/backend/internal/middleware"
	"time"

	"github.com/gin-gonic/gin"
)

func SetupRouter(
	authHandler *handlers.AuthHandler,
	mediaHandler *handlers.MediaHandler,
	taskHandler *handlers.TaskHandler,
) *gin.Engine {
	router := gin.Default()

	// CORS 中间件
	router.Use(func(c *gin.Context) {
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
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
			"time":   time.Now().Format(time.RFC3339),
		})
	})

	// API v1
	v1 := router.Group("/api/v1")
	{
		// 公开路由
		public := v1.Group("")
		{
			// 认证相关路由
			auth := public.Group("/auth")
			{
				auth.POST("/register", authHandler.Register)
				auth.POST("/login", authHandler.Login)
			}

			// 首页公开数据
			public.GET("/home", mediaHandler.GetHomeData)
		}

		// 需要认证的路由
		protected := v1.Group("")
		protected.Use(middleware.AuthMiddleware())
		{
			// 媒体相关路由
			media := protected.Group("/media")
			{
				media.GET("", mediaHandler.GetMediaList)
				media.POST("", mediaHandler.CreateMedia)
				media.GET("/:id", mediaHandler.GetMediaByID)
				media.PUT("/:id", mediaHandler.UpdateMedia)
				media.DELETE("/:id", mediaHandler.DeleteMedia)

				// 笔记相关路由
				notes := media.Group("/:id/notes")
				{
					notes.POST("", mediaHandler.AddNote)
					notes.PUT("/:noteId", mediaHandler.UpdateNote)
					notes.DELETE("/:noteId", mediaHandler.DeleteNote)
				}
			}

			// Task routes
			tasks := protected.Group("/tasks")
			{
				tasks.POST("", taskHandler.CreateTask)
				tasks.GET("", taskHandler.ListTasks)
				tasks.GET("/today", taskHandler.GetTodayTasks)
				tasks.GET("/stats", taskHandler.GetTaskStats)
				tasks.GET("/:id", taskHandler.GetTask)
				tasks.PUT("/:id", taskHandler.UpdateTask)
				tasks.DELETE("/:id", taskHandler.DeleteTask)
			}
		}
	}

	return router
}
