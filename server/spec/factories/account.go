package factories

import "github.com/nozomi-iida/attendance-management/app/models"

func Account() models.Account {
	return models.Account{
		HandleName: "nozomi",
		Email:      "test@test.com",
		Password:   "password",
	}
}
