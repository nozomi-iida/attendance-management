package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/nozomi-iida/attendance-management/app/models"
	"github.com/nozomi-iida/attendance-management/config/middleware"
	"github.com/nozomi-iida/attendance-management/lib/errors"
	"net/http"
	"time"
)

type AttendanceController struct{}

func NewAttendanceController() *AttendanceController {
	return new(AttendanceController)
}

func (ac *AttendanceController) IndexAttendance(c *gin.Context) {
	account := middleware.CurrentAccount
	var attendances []models.Attendance
	search := models.DB.Where("")
	month := c.Query("month")
	if month == "" {
		c.Error(errors.NewError(http.StatusBadRequest, "月を指定してください"))
		return
	}

	mothTime := stringToTime(month)
	firstDay := time.Date(mothTime.Year(), mothTime.Month(), 1, 0, 0, 0, 0, time.Local)
	lastDay := firstDay.AddDate(0, 1, 0).Add(time.Nanosecond * -1)
	search.Where("started_at BETWEEN ? AND ?", firstDay, lastDay).Model(&account)
	if err := search.Model(&account).Association("Attendances").Find(&attendances); err != nil {
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

func stringToTime(str string) time.Time {
	t, err := time.ParseInLocation("2006-01-02 15:04:05", str, time.Local)
	if err != nil {
		println("err", err.Error())
	}
	return t
}
