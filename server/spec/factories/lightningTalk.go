package factories

import (
	"github.com/nozomi-iida/attendance-management/app/models"
	"time"
)

type MockLightningTalkFunc func(lightningTalk *models.LightningTalk)

// MockLightningTalk lightningTalkは無名関数を引数として受け取る
func MockLightningTalk(lightningTalk ...MockLightningTalkFunc) *models.LightningTalk {
	args := &models.LightningTalk{
		Title:     "Reactを勉強してみた",
		TalkDay:   time.Now(),
		AccountId: MockAccount().ID,
	}

	// lightningTalk(args)
	for _, el := range lightningTalk {
		// argsを無名関数に渡している = 無名関数のなかでargsの値を変更できる
		el(args)
	}

	return args
}
