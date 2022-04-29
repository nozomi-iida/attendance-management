package models

import (
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"strings"
)

// TODO: enumの書き方
type AccountRoll = string

const (
	general AccountRoll = "general"
	admin   AccountRoll = "admin"
)

// TODO: メールのバリデーションをかける
// TODO: IDをuuidにしたい
// FIXME: roleのデフォルト値入ってない
type Account struct {
	gorm.Model
	HandleName  string       `json:"handleName"`
	Email       string       `json:"email" gorm:"not nul; unique"`
	Password    string       `json:"password" gorm:"not null"`
	Role        AccountRoll  `json:"role" gorm:"not null; default:general"`
	Attendances []Attendance `json:"attendances"`
}

func (a *Account) Create() (tx *gorm.DB) {
	handleName := strings.Split(a.Email, "@")[0]
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(a.Password), bcrypt.DefaultCost)
	return DB.Create(&Account{Email: a.Email, HandleName: handleName, Password: string(hashedPassword)})
}
