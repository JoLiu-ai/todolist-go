package router

import (
	"cute-todo/backend/internal/handlers"
	"time"

	"github.com/gin-gonic/gin"
)

func SetupRouter(categoryHandler *handlers.CategoryHandler, mediaHandler *handlers.MediaHandler) *gin.Engine {
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
		categories := v1.Group("/categories")
		{
			categories.GET("", categoryHandler.GetCategories)
			categories.POST("", categoryHandler.CreateCategory)
			categories.PUT("/:id", categoryHandler.UpdateCategory)
			categories.DELETE("/:id", categoryHandler.DeleteCategory)
		}

		// Register media routes
		media := v1.Group("/media")
		{
			media.GET("", mediaHandler.ListMedia)
			media.POST("", mediaHandler.CreateMedia)
			media.GET("/:id", mediaHandler.GetMedia)
			media.PUT("/:id", mediaHandler.UpdateMedia)
			media.DELETE("/:id", mediaHandler.DeleteMedia)

			// Note routes
			media.GET("/:id/notes", mediaHandler.GetNotes)
			media.POST("/:id/notes", mediaHandler.CreateNote)
			media.PUT("/:id/notes/:noteId", mediaHandler.UpdateNote)
			media.DELETE("/:id/notes/:noteId", mediaHandler.DeleteNote)
		}
	}

	return r
}
