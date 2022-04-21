package main

import (
	"github.com/joho/godotenv"
	"github.com/nozomi-iida/attendance-management/app/models"
	"github.com/nozomi-iida/attendance-management/config"
	"log"
	"os"
)

func main() {
	err_read := godotenv.Load()
	if err_read != nil {
		log.Fatalf("error: %v", err_read)
	}
	models.ConnectDatabase(os.Getenv("DATABASE_NAME"))
	r := config.SetupRouter()
	r.Run()
}
