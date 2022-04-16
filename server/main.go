package main

import (
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/nozomi-iida/attendance-management/app/controllers"
	"github.com/nozomi-iida/attendance-management/app/models"
	"log"
)

func main() {
	err_read := godotenv.Load()
	if err_read != nil {
		log.Fatalf("error: %v", err_read)
	}
	r := gin.Default()
	r.POST("/accounts/invite", controllers.Invite)
	models.ConnectDatabase()
	r.Run()
}
