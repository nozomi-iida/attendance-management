package controllers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/nozomi-iida/attendance-management/app/controllers/concerns"
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
	account := concerns.CurrentAccount
	attendance := models.Attendance{Account: account}

	err := models.DB.Model(&account).Association("Attendances").Append(&attendance)
	if err != nil {
		fmt.Println("Association", err)
	}
	c.JSON(http.StatusCreated, attendance)
}

func (ac *AttendanceController) UpdateAttendance(c *gin.Context) {
}

func (ac *AttendanceController) DeleteAttendance(c *gin.Context) {

}
