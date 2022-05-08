package config

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/nozomi-iida/attendance-management/app/controllers"
	"github.com/nozomi-iida/attendance-management/config/middleware"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowHeaders = []string{
		"Authorization",
	}
	r.Use(cors.New(config))
	r.Use(middleware.ErrorHandler())
	accountController := controllers.NewAccountController()
	authController := controllers.NewAuthController()
	attendanceController := controllers.NewAttendanceController()
	{
		r.POST("/sign_up", authController.SignUp)
		r.POST("/sign_in", authController.SignIn)
	}

	accountsRoutes := r.Group("/accounts")
	{
		accountsRoutes.Use(middleware.AuthenticateAccount())
		accountsRoutes.GET("/:accountId", accountController.GetAccount)
		accountsRoutes.POST("/invite", accountController.InviteAccount)
	}

	attendancesRoutes := r.Group("/accounts/:accountId/attendances")
	{
		attendancesRoutes.Use(middleware.AuthenticateAccount())
		attendancesRoutes.GET("", attendanceController.IndexAttendance)
		attendancesRoutes.POST("", attendanceController.CreateAttendance)
		attendancesRoutes.GET("/:id", attendanceController.GetAttendance)
		attendancesRoutes.PATCH("/:id", attendanceController.UpdateAttendance)
		attendancesRoutes.DELETE("/:id", attendanceController.DeleteAttendance)
	}
	return r
}
