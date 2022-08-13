package factories

import (
	"fmt"
	"github.com/nozomi-iida/attendance-management/app/models"
	"math/rand"
	"time"
)

type MockLightningTalkFunc func(lightningTalk *models.LightningTalk)

// MockLightningTalk lightningTalkは無名関数を引数として受け取る
func MockLightningTalk(lightningTalk ...MockLightningTalkFunc) *models.LightningTalk {
	email := fmt.Sprintf(`test%d@test.com`, rand.Int())
	account := MockAccount(func(account *models.Account) {
		account.Email = &email
	})
	args := &models.LightningTalk{
		Title:     "Reactを勉強してみた",
		TalkDay:   time.Now(),
		AccountId: account.ID,
	}

	// lightningTalk(args)
	for _, el := range lightningTalk {
		// argsを無名関数に渡している = 無名関数のなかでargsの値を変更できる
		el(args)
	}

	models.DB.Create(args)
	return args
}
