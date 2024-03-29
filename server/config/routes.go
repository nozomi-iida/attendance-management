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
		"Content-Type",
		"Access-Control-Allow-Origin",
	}
	r.Use(cors.New(config))
	r.Use(middleware.ErrorHandler())
	accountController := controllers.NewAccountController()
	authController := controllers.NewAuthController()
	attendanceController := controllers.NewAttendanceController()
	lightningTalk := controllers.NewLightningTalkController()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "healthy",
		})
	})
	{
		r.POST("/sign_up", authController.SignUp)
		r.POST("/login", authController.Login)
		r.GET("/slack_auth", authController.SlackAuth)
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
		attendancesRoutes.PATCH("/:id/break", attendanceController.BreakAttendance)
		attendancesRoutes.PATCH("/:id/leave", attendanceController.LeaveAttendance)
		attendancesRoutes.DELETE("/:id", attendanceController.DeleteAttendance)
	}

	lightningTalkRoutes := r.Group("/lightning_talks")
	{
		lightningTalkRoutes.Use(middleware.AuthenticateAccount())
		lightningTalkRoutes.GET("", lightningTalk.IndexLightningTalk)
		lightningTalkRoutes.POST("", lightningTalk.CreateLightningTalk)
		lightningTalkRoutes.GET("/:id", lightningTalk.GetLightningTalk)
		lightningTalkRoutes.PATCH("/:id", lightningTalk.PatchLightningTalk)
		lightningTalkRoutes.DELETE("/:id", lightningTalk.DeleteLightningTalk)
	}
	r.GET("accounts/:accountId/lightning_talks", lightningTalk.IndexMyLightningTalk)
	return r
}
