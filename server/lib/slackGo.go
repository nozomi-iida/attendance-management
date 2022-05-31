package lib

import (
	"github.com/slack-go/slack"
)

func SlackApi(slackToken string) *slack.Client {
	return slack.New(slackToken)
}
