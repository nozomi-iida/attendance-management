package config

import (
	"github.com/gin-gonic/gin"
	"github.com/nozomi-iida/attendance-management/app/controllers"
	"github.com/nozomi-iida/attendance-management/app/controllers/concerns"
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
		attendancesRoutes.Use(concerns.AuthenticateAccount())
		attendancesRoutes.GET("", attendanceController.IndexAttendance)
		attendancesRoutes.POST("", attendanceController.CreateAttendance)
		attendancesRoutes.GET("/:attendanceId", attendanceController.GetAttendance)
		attendancesRoutes.PATCH("/:attendanceId", attendanceController.UpdateAttendance)
		attendancesRoutes.DELETE("/:attendanceId", attendanceController.DeleteAttendance)
	}
	return r
}
