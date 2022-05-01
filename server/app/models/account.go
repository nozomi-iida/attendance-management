package models

import (
	"fmt"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"strings"
	"time"
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
	ID          uint           `json:"id" gorm:"primarykey"`
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `json:"deletedAt" gorm:"index"`
	HandleName  string         `json:"handleName"`
	Email       string         `json:"email" gorm:"not nul; unique"`
	Password    string         `json:"password" gorm:"not null"`
	Role        AccountRoll    `json:"role" gorm:"not null; default:general"`
	Attendances []Attendance   `json:"attendances" gorm:"constraint:OnDelete:SET NULL"`
}

func CreateAccount(account *Account) {
	handleName := strings.Split(account.Email, "@")[0]
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(account.Password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println("GenerateFromPassword", err)
	}
	account = &Account{Email: account.Email, HandleName: handleName, Password: string(hashedPassword)}

	if err = DB.Create(&account).Error; err != nil {
		fmt.Println("Create", err)
	}
}
