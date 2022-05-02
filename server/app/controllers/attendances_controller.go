package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/nozomi-iida/attendance-management/app/models"
	"github.com/nozomi-iida/attendance-management/config/middleware"
	"github.com/nozomi-iida/attendance-management/lib/errors"
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
	var attendance models.Attendance
	if err := models.DB.Where("id = ?", c.Param("id")).First(&attendance).Error; err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, attendance)
}

func (ac *AttendanceController) CreateAttendance(c *gin.Context) {
	account := middleware.CurrentAccount
	attendance := models.Attendance{Account: &account}
	if err := models.DB.Create(&attendance).Error; err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusCreated, attendance)
}

func (ac *AttendanceController) UpdateAttendance(c *gin.Context) {
	var attendance models.Attendance
	if err := c.ShouldBindJSON(&attendance); err != nil {
		c.Error(errors.BadRequest(err))
		return
	}
	if err := models.DB.Model(&attendance).Where("id = ?", c.Param("id")).Updates(&attendance).Error; err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, attendance)
}

func (ac *AttendanceController) DeleteAttendance(c *gin.Context) {
	if err := models.DB.Where("id = ?", c.Param("id")).Delete(&models.Attendance{}).Error; err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusNoContent, gin.H{})
}
