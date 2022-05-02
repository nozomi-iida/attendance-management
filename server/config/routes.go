package config

import (
	"github.com/gin-gonic/gin"
	"github.com/nozomi-iida/attendance-management/app/controllers"
	"github.com/nozomi-iida/attendance-management/config/middleware"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()
	r.Use(middleware.ErrorHandler())
	accountController := controllers.NewAccountController()
	authController := controllers.NewAuthController()
	attendanceController := controllers.NewAttendanceController()

	accountsRoutes := r.Group("/accounts")
	{
		accountsRoutes.POST("/invite", accountController.InviteAccount)
	}
	{
		r.POST("/sign_up", authController.SignUp)
		r.POST("/sign_in", authController.SignIn)
	}
	attendancesRoutes := r.Group("/attendances")
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
