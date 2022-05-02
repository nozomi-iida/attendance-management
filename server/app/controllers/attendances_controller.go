package controllers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/nozomi-iida/attendance-management/app/models"
	"github.com/nozomi-iida/attendance-management/config/middleware"
	"net/http"
)

type AttendanceController struct{}

func NewAttendanceController() *AttendanceController {
	return new(AttendanceController)
}

func (ac *AttendanceController) IndexAttendance(c *gin.Context) {
	account := middleware.CurrentAccount
	var attendances []models.Attendance
	err := models.DB.Model(&account).Association("Attendances").Find(&attendances)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"attendances": attendances})
}

func (ac *AttendanceController) GetAttendance(c *gin.Context) {

}

func (ac *AttendanceController) CreateAttendance(c *gin.Context) {
	account := middleware.CurrentAccount
	attendance := models.Attendance{Account: &account}
	if err := models.DB.Create(&attendance).Error; err != nil {
		c.Error(err)
		return
	}
	fmt.Println(attendance.CreatedAt)
	c.JSON(http.StatusCreated, attendance)
}

func (ac *AttendanceController) UpdateAttendance(c *gin.Context) {
}

func (ac *AttendanceController) DeleteAttendance(c *gin.Context) {

}
