package controllers

import (
	"bytes"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/nozomi-iida/attendance-management/app/models"
	"github.com/nozomi-iida/attendance-management/lib/errors"
	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
	"html/template"
	"log"
	"net/http"
	"os"
	"time"
)

type AccountController struct{}

func NewAccountController() *AccountController {
	return new(AccountController)
}

type InviteAccountsInput struct {
	Emails []string `json:"emails" binding:"required"`
}

type InviteTokenClaims struct {
	Email string `json:"email"`
	jwt.RegisteredClaims
}

/*
	1. 送られたEmailsがそれぞれuniqかを調べる => 重複してたら重複を削除する
	2. emailが既に登録サれているアカウントと重複がないかを調べる => 重複してたらエラーを返す
	3. emailを含んだtokenを作成する
	4. accountにメールを送信する => 失敗したら4は実行しない
	5, 3, 4をメールアドレスの数ループする
	6. 200を返す
*/
func (ac *AccountController) InviteAccount(c *gin.Context) {
	var inviteAccountInput InviteAccountsInput
	err := c.BindJSON(&inviteAccountInput)
	if err != nil {
		log.Fatal(err)
	}

	// 1. 送られたEmailsがそれぞれuniqかを調べる => 重複してたら重複を削除する
	inviteAccountInput.Emails = sliceUnique(inviteAccountInput.Emails)

	// 2. emailが既に登録されているアカウントと重複がないかを調べる => 重複してたらエラーを返す
	for _, email := range inviteAccountInput.Emails {
		if models.CheckAccountExist(email) {
			c.Error(errors.DuplicateEmailError)
			return
		}
	}

	for _, email := range inviteAccountInput.Emails {
		// 3. emailを含んだtokenを作成する
		// token作成の時にsecret_keyなくても問題ないのかな？
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, InviteTokenClaims{
			email,
			jwt.RegisteredClaims{
				IssuedAt:  jwt.NewNumericDate(time.Now()),
				NotBefore: jwt.NewNumericDate(time.Now()),
			},
		})
		tokenString, _ := token.SignedString([]byte("invite_token"))

		//// 4. accountにメールを送信する
		from := mail.NewEmail("SIMULA Labs", "iida19990106@gmail.com")
		subject := "本人確認のお願い"
		to := mail.NewEmail("Example User", email)
		plainTextContent := "and easy to do anywhere, even with Go"
		t, err := template.ParseFiles("app/views/account_mailer/verification_email.html")
		if err != nil {
			fmt.Println("エラー発生", err)
		}
		var tpl bytes.Buffer

		if err = t.Execute(&tpl, tokenString); err != nil {
			log.Println(err)
		}
		htmlContent := tpl.String()
		message := mail.NewSingleEmail(from, subject, to, plainTextContent, htmlContent)
		client := sendgrid.NewSendClient(os.Getenv("SENDGRID_API_KEY"))
		_, err = client.Send(message)
		if err != nil {
			log.Println(err)
		}
	}

	c.JSON(http.StatusOK, gin.H{})
}

func (ac *AccountController) GetAccount(c *gin.Context) {
	var account models.Account
	println("GetAccount")
	if err := models.DB.Where("id = ?", c.Param("id")).First(&account).Error; err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, account)
}

func sliceUnique(target []string) (unique []string) {
	m := map[string]bool{}

	for _, v := range target {
		if !m[v] {
			m[v] = true
			unique = append(unique, v)
		}
	}

	return unique
}
