package main

import (
	"github.com/joho/godotenv"
	"github.com/nozomi-iida/attendance-management/app/models"
	"github.com/nozomi-iida/attendance-management/config"
	"log"
	"os"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("error: %v", err)
	}
	models.ConnectDatabase(os.Getenv("DATABASE_NAME"))
	r := config.SetupRouter()
	r.Run(":8080")
}
