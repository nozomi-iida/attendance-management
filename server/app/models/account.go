package models

import (
	"fmt"
	"gorm.io/gorm"
)

type AccountRoll = string

const (
	general AccountRoll = "general"
	admin   AccountRoll = "admin"
)

type Account struct {
	gorm.Model
	HandleName  string       `json:"handle_name"`
	Email       string       `json:"email" gorm:"not nul; unique"`
	Role        AccountRoll  `json:"role" gorm:"not null; default:general"`
	Attendances []Attendance `json:"attendances"`
}

func (a *Account) Create() (tx *gorm.DB) {
	return DB.Create(a)
}

func (a *Account) Test(w string) {
	fmt.Println(w)
}
