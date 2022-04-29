package config

import (
	"github.com/gin-gonic/gin"
	"github.com/nozomi-iida/attendance-management/app/controllers"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()
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
		attendancesRoutes.GET("", attendanceController.IndexAttendance)
		attendancesRoutes.POST("", attendanceController.CreateAttendance)
		attendancesRoutes.GET("/:attendanceId", attendanceController.GetAttendance)
		attendancesRoutes.PATCH("/:attendanceId", attendanceController.UpdateAttendance)
		attendancesRoutes.DELETE("/:attendanceId", attendanceController.DeleteAttendance)
	}
	return r
}
