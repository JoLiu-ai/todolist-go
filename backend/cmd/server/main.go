package main

import (
	"log"

	"cute-todo/backend/internal/server"
)

func main() {
	srv := server.NewServer()
	log.Println("Starting server on :8080")
	if err := srv.Start(); err != nil {
		log.Fatal(err)
	}
}
