package factories

import "github.com/nozomi-iida/attendance-management/app/models"

type MockAccountFunc func(*models.Account)

func MockAccountEmaiiil(email string) MockAccountFunc {
	return func(args *models.Account) {
		args.Email = email
	}
}

func MockAccount(account ...MockAccountFunc) *models.Account {
	args := &models.Account{
		HandleName: "nozomi",
		Email:      "test@test.com",
		Password:   "password",
	}
	for _, el := range account {
		el(args)
	}

	return args
}
