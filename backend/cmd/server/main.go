package main

import (
	"cute-todo/backend/internal/config"
	"cute-todo/backend/internal/handlers"
	"cute-todo/backend/internal/repository"
	"cute-todo/backend/internal/router"
	"cute-todo/backend/internal/services"
	"fmt"
	"log"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatal("Failed to load config:", err)
	}

	db, err := config.NewGormDB()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	taskRepo := repository.NewTaskRepository(db)
	mediaRepo := repository.NewMediaRepository(db)
	authRepo := repository.NewAuthRepository(db)
	knowledgeRepo := repository.NewKnowledgeRepository(db)

	mediaService := services.NewMediaService(mediaRepo)
	taskService := services.NewTaskService(taskRepo)
	knowledgeService := services.NewKnowledgeService(knowledgeRepo)

	taskHandler := handlers.NewTaskHandler(taskService)
	mediaHandler := handlers.NewMediaHandler(mediaService, mediaRepo)
	authHandler := handlers.NewAuthHandler(cfg.JWTSecret, authRepo)
	knowledgeHandler := handlers.NewKnowledgeHandler(knowledgeService)

	r := router.SetupRouter(authHandler, mediaHandler, taskHandler, knowledgeHandler)

	addr := fmt.Sprintf(":%d", cfg.Port)
	log.Printf("Server starting on %s", addr)
	if err := r.Run(addr); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
