package controllers

import (
	"fmt"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/nozomi-iida/attendance-management/app/models"
	"net/http"
)

type AttendanceController struct{}

func NewAttendanceController() *AttendanceController {
	return new(AttendanceController)
}

func (ac *AttendanceController) IndexAttendance(c *gin.Context) {

}

func (ac *AttendanceController) GetAttendance(c *gin.Context) {

}

func (ac *AttendanceController) CreateAttendance(c *gin.Context) {
	session := sessions.Default(c)
	account := session.Get("currentAccount")
	fmt.Println("account", account)
	var attendance models.Attendance
	if err := attendance.Create().Error; err != nil {
		fmt.Println(err)
		return
	}
	c.JSON(http.StatusCreated, attendance)
}

func (ac *AttendanceController) UpdateAttendance(c *gin.Context) {
}

func (ac *AttendanceController) DeleteAttendance(c *gin.Context) {

}
