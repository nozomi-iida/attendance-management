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
	AttendanceStatus AttendanceStatus `json:"attendanceStatus"`
}

func (as AccountSerializer) Response() AccountSerializer {
	var attendance models.Attendance
	now := time.Now()
	models.DB.Where("account_id = ?", as.ID).Where("started_at BETWEEN ? AND ?", bod(now), truncate(now)).First(&attendance)

	if !attendance.EndedAt.IsZero() {
		as.AttendanceStatus = leavingWork
	} else if attendance.IsBroke {
		as.AttendanceStatus = breaking
	} else if !attendance.StartedAt.IsZero() {
		as.AttendanceStatus = working
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
