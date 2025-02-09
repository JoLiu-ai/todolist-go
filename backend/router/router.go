package router

import (
	"cute-todo/backend/internal/handlers"
	"time"

	"github.com/gin-gonic/gin"
)

func SetupRouter(authHandler *handlers.AuthHandler, categoryHandler *handlers.CategoryHandler, mediaHandler *handlers.MediaHandler) *gin.Engine {
	r := gin.Default()

	// Add CORS middleware
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

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
			"time":   time.Now().Format(time.RFC3339),
		})
	})

	v1 := r.Group("/api/v1")
	{
		// Auth routes
		auth := v1.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
		}

		// Categories routes
		categories := v1.Group("/categories")
		{
			categories.GET("", categoryHandler.GetCategories)
			categories.POST("", categoryHandler.CreateCategory)
			categories.PUT("/:id", categoryHandler.UpdateCategory)
			categories.DELETE("/:id", categoryHandler.DeleteCategory)
		}

		// Media routes
		media := v1.Group("/media")
		{
			media.GET("", mediaHandler.List)
			media.POST("", mediaHandler.Create)
			media.GET("/:id", mediaHandler.GetByID)
			media.PUT("/:id", mediaHandler.Update)
			media.DELETE("/:id", mediaHandler.Delete)

			// Note routes
			media.POST("/:id/notes", mediaHandler.AddNote)
			media.PUT("/:id/notes/:noteId", mediaHandler.UpdateNote)
			media.DELETE("/:id/notes/:noteId", mediaHandler.DeleteNote)
		}
	}

	return r
}
