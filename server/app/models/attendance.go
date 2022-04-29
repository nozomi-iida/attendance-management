package models

import (
	"gorm.io/gorm"
	"time"
)

type Attendance struct {
	gorm.Model
	IsBroke   bool      `json:"isBroke default:false not null"`
	StartedAt time.Time `json:"startedAt" gorm:"not null"`
	EndedAt   time.Time `json:"endedAt"`
	WorkTime  int       `json:"workTime" gorm:"not null"`
	BreakTime int       `json:"breakTime" gorm:"not null"`
	AccountId uint      `json:"accountId"`
}

func (a *Attendance) Create() (tx *gorm.DB) {
	return DB.Create(&Attendance{})
}
