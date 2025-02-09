package router

import (
	"cute-todo/backend/internal/handlers"
	"cute-todo/backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRouter(
	authHandler *handlers.AuthHandler,
	mediaHandler *handlers.MediaHandler,
) *gin.Engine {
	router := gin.Default()

	// API v1
	v1 := router.Group("/api/v1")
	{
		// 认证相关路由
		auth := v1.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
		}

		// 需要认证的路由
		protected := v1.Group("")
		protected.Use(middleware.AuthMiddleware())
		{
			// 媒体相关路由
			media := protected.Group("/media")
			{
				media.GET("", mediaHandler.GetMediaList)       // 获取媒体列表
				media.GET("/:id", mediaHandler.GetMediaByID)   // 获取单个媒体
				media.POST("", mediaHandler.CreateMedia)       // 创建媒体
				media.PUT("/:id", mediaHandler.UpdateMedia)    // 更新媒体
				media.DELETE("/:id", mediaHandler.DeleteMedia) // 删除媒体

				// 媒体笔记相关路由
				media.POST("/:id/notes", mediaHandler.AddNote)                   // 添加笔记
				media.PUT("/:mediaId/notes/:noteId", mediaHandler.UpdateNote)    // 更新笔记
				media.DELETE("/:mediaId/notes/:noteId", mediaHandler.DeleteNote) // 删除笔记
			}
		}
	}

	return router
}
