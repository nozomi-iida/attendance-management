package serializers

import (
	"github.com/nozomi-iida/attendance-management/app/models"
	"time"
)

type AttendanceStatus = string

const (
	working     = AttendanceStatus("working")
	breaking    = AttendanceStatus("breaking")
	leavingWork = AttendanceStatus("leavingWork")
)

type AccountSerializer struct {
	models.Account
	CurrentAttendance *models.Attendance `json:"currentAttendance"`
}

func (as AccountSerializer) Response() AccountSerializer {
	var attendance models.Attendance
	now := time.Now()
	models.DB.Where("account_id = ?", as.ID).Where("started_at BETWEEN ? AND ?", bod(now), truncate(now)).First(&attendance)
	if attendance.ID != 0 {
		as.CurrentAttendance = &attendance
	}

	return as
}

func bod(t time.Time) time.Time {
	year, month, day := t.Date()
	return time.Date(year, month, day, 0, 0, 0, 0, t.Location())
}

func truncate(t time.Time) time.Time {
	year, month, day := t.Date()
	return time.Date(year, month, day, 23, 59, 59, 59, t.Location())
}
