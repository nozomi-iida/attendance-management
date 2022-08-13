package factories

import (
	"fmt"
	"github.com/nozomi-iida/attendance-management/app/models"
)

type MockAccountFunc func(*models.Account)

func MockAccount(account ...MockAccountFunc) *models.Account {
	email := "test@test.com"
	password := "password"
	args := &models.Account{
		HandleName: "nozomi",
		Email:      &email,
		Password:   &password,
	}
	for _, el := range account {
		el(args)
	}

	err := models.CreateAccount(args)
	if err != nil {
		fmt.Println("アカウントの作成に失敗しました")
		return args
	}
	return args
}
