package factories

import (
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

	// CreateAccountにしたいが、エラーが出る
	//err := models.CreateAccount(args)
	models.DB.Create(args)
	return args
}
