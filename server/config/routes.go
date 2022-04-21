package config

import (
	"github.com/gin-gonic/gin"
	"github.com/nozomi-iida/attendance-management/app/controllers"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()
	r.POST("/accounts/invite", controllers.InviteAccount)
	return r
}
