package main

import (
	"log"

	"cute-todo/backend/internal/core/services"
	"cute-todo/backend/internal/handlers"
	"cute-todo/backend/internal/infrastructure/database"
	"cute-todo/backend/internal/infrastructure/repositories"
	"cute-todo/backend/router"
)

func main() {
	log.Println("Starting server...")

	// Initialize database
	db, err := database.ConnectDB()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Initialize repositories
	categoryRepo := repositories.NewGormCategoryRepository(db)
	mediaRepo := repositories.NewGormMediaRepository(db)

	// Initialize services
	categoryService := services.NewCategoryService(categoryRepo)
	mediaService := services.NewMediaService(mediaRepo)

	// Initialize handlers
	categoryHandler := handlers.NewCategoryHandler(categoryService)
	mediaHandler := handlers.NewMediaHandler(mediaService)

	// Setup router
	r := router.SetupRouter(categoryHandler, mediaHandler)

	// Run the server
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
