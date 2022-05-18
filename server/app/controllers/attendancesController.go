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

	monthTime := stringToTime(month)
	firstDay := time.Date(monthTime.Year(), monthTime.Month(), 1, 0, 0, 0, 0, time.Local)
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
	attendance := models.Attendance{Account: &account, StartedAt: time.Now()}
	if err := models.DB.Create(&attendance).Error; err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusCreated, attendance)
}

type UpdateAttendanceInput struct {
	StartedAt time.Time  `json:"startedAt"`
	EndedAt   *time.Time `json:"endedAt"`
	WorkTime  int        `json:"workTime"`
	BreakTime int        `json:"breakTime"`
	IsBreak   *bool      `json:"isBreak"`
}

func (ac *AttendanceController) UpdateAttendance(c *gin.Context) {
	var updateAttendanceInput UpdateAttendanceInput
	if err := c.ShouldBindJSON(&updateAttendanceInput); err != nil {
		println("badrequest", err.Error())
		c.Error(errors.BadRequest(err))
		return
	}
	var attendance models.Attendance

	if err := models.DB.Where("id = ?", c.Param("id")).First(&attendance).Error; err != nil {
		c.Error(err)
		return
	}

	if updateAttendanceInput.EndedAt != nil {
		// ISO8601規格の時間しか受け取らない
		EndedAtJST := updateAttendanceInput.EndedAt.In(time.FixedZone("JST", 9*60*60))
		updateAttendanceInput.EndedAt = &EndedAtJST
		updateAttendanceInput.WorkTime = int(updateAttendanceInput.EndedAt.Sub(attendance.StartedAt).Minutes())
	}

	if err := models.DB.Model(&attendance).Where("id = ?", c.Param("id")).Updates(models.Attendance{
		//IsBreak:   *updateAttendanceInput.IsBreak,
		StartedAt: updateAttendanceInput.StartedAt,
		EndedAt:   updateAttendanceInput.EndedAt,
		WorkTime:  updateAttendanceInput.WorkTime,
		BreakTime: updateAttendanceInput.BreakTime,
	}).Error; err != nil {
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
	t, err := time.ParseInLocation("2006-01", str, time.Local)
	if err != nil {
		println("err", err.Error())
	}
	return t
}
