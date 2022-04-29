package config

import (
	"github.com/gin-gonic/gin"
	"github.com/nozomi-iida/attendance-management/app/controllers"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()
	r.POST("/accounts/invite", controllers.InviteAccount)
	authController := controllers.NewAuthController()
	r.POST("/sign_up", authController.SignUp)
	r.POST("/sign_in", authController.SignIn)
	return r
}
