package main

import (
	"github.com/gin-gonic/gin"
	"github.com/nozomi-iida/attendance-management/models"
)

func main() {
	r := gin.Default()
	r.GET("/sum", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	models.ConnectDatabase()
	r.Run()
}
