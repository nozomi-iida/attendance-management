package models

import (
	"gorm.io/gorm"
	"time"
)

type Attendance struct {
	gorm.Model
	IsBreaked bool      `json:"is_breaked default:false not null"`
	StartedAt time.Time `json:"started_at" gorm:"not null"`
	EndedAt   time.Time `json:"ended_at"`
	WorkTime  int       `json:"working_time" gorm:"not null"`
	BreakTime int       `json:"break_time" gorm:"not null"`
	AccountId uint      `json:"account_id"`
}
