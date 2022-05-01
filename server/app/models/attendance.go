package models

import (
	"gorm.io/gorm"
	"time"
)

type Attendance struct {
	ID        uint           `json:"id" gorm:"primarykey"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `json:"deletedAt" gorm:"index"`
	IsBroke   bool           `json:"isBroke default:false not null"`
	StartedAt time.Time      `json:"startedAt" gorm:"not null"`
	EndedAt   time.Time      `json:"endedAt"`
	WorkTime  int            `json:"workTime" gorm:"not null"`
	BreakTime int            `json:"breakTime" gorm:"not null"`
	AccountId uint           `json:"accountId"`
	Account   Account        `json:"account" gorm:"constraint:OnDelete:SET NULL"`
}

func (a *Attendance) Create() (tx *gorm.DB) {
	return DB.Create(&Attendance{})
}
