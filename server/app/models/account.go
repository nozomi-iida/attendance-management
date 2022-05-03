package models

import (
	"fmt"
	"github.com/golang-jwt/jwt/v4"
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
type Account struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `json:"deletedAt" gorm:"index"`
	HandleName  string         `json:"handleName"`
	Email       string         `json:"email" gorm:"not nul; unique"`
	Password    string         `json:"password" gorm:"not null"`
	Role        AccountRoll    `json:"role" gorm:"not null; default:general"`
	Attendances []Attendance   `json:"attendances" gorm:"constraint:OnDelete:SET NULL"`
}

func CreateAccount(account *Account) error {
	handleName := strings.Split(account.Email, "@")[0]
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(account.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	account = &Account{Email: account.Email, HandleName: handleName, Password: string(hashedPassword)}

	if err = DB.Create(&account).Error; err != nil {
		return err
	}

	return nil
}

func CheckAccountExist(email string) bool {
	var accounts []Account
	DB.Find(&accounts)
	for _, account := range accounts {
		if account.Email == email {
			return true
		}
	}
	return false
}

type AuthClaims struct {
	ID uint `json:"id"`
	jwt.RegisteredClaims
}

func (a *Account) Jwt() string {
	authClaims := AuthClaims{
		ID: a.ID,
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}
	authToken := jwt.NewWithClaims(jwt.SigningMethodHS256, authClaims)
	signedString, err := authToken.SignedString([]byte("auth_token"))
	if err != nil {
		fmt.Print("SignedString", err)
	}
	return signedString
}
