package controllers

import (
	"bytes"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/nozomi-iida/attendance-management/app/models"
	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

type InviteAccountsInput struct {
	Emails []string `json:"emails" binding:"required"`
}

/*
	1. 送られたEmailsがそれぞれuniqかを調べる => 重複してたら重複を削除する
	2. emailが既に登録サれているアカウントと重複がないかを調べる => 重複してたらエラーを返す
	3. accountにメールを送信する => 失敗したら4は実行しない
	4. accountを作成する
	5, 3, 4をメールアドレスの数ループする
	6. 作成したアカウントを返す
*/

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

func checkAccountExist(email string) bool {
	var accounts []models.Account
	models.DB.Find(&accounts)
	for _, account := range accounts {
		if account.Email == email {
			return true
		}
	}
	return false
}

func useIoutilReadFile(fileName string) {
	bytes, err := ioutil.ReadFile(fileName)
	if err != nil {
		panic(err)
	}

	fmt.Println(string(bytes))
}

func Invite(c *gin.Context) {
	var inviteAccount InviteAccountsInput
	err := c.BindJSON(&inviteAccount)
	if err != nil {
		log.Fatal(err)
	}

	// 1. 送られたEmailsがそれぞれuniqかを調べる => 重複してたら重複を削除する
	inviteAccount.Emails = sliceUnique(inviteAccount.Emails)

	// 2. emailが既に登録サれているアカウントと重複がないかを調べる => 重複してたらエラーを返す
	for _, email := range inviteAccount.Emails {
		if checkAccountExist(email) {
			c.JSON(http.StatusBadRequest, gin.H{"message": "入力されたメールアドレスは既に登録されています"})
			return
		}
	}

	// 3. accountにメールを送信する => 失敗したら4は実行しない
	for _, email := range inviteAccount.Emails {
		from := mail.NewEmail("SIMULA Labs", "iida19990106@gmail.com")
		subject := "本人確認のお願い"
		to := mail.NewEmail("Example User", email)
		plainTextContent := "and easy to do anywhere, even with Go"
		t, err := template.ParseFiles("app/views/account_mailer/verification_email.html")
		if err != nil {
			fmt.Println("エラー発生", err)
		}
		var tpl bytes.Buffer

		if err = t.Execute(&tpl, t); err != nil {
			log.Println(err)
		}
		htmlContent := tpl.String()
		message := mail.NewSingleEmail(from, subject, to, plainTextContent, htmlContent)
		client := sendgrid.NewSendClient(os.Getenv("SENDGRID_API_KEY"))
		response, err := client.Send(message)
		if err != nil {
			log.Println(err)
			fmt.Println("送信失敗。。。")
		} else {
			fmt.Println("response.StatusCode", response.StatusCode)
			fmt.Println("response.Body", response.Body)
			fmt.Println("response.Headers", response.Headers)
			fmt.Println("送信成功！！")
		}
	}

	//for _, email := range inviteAccount.Emails {
	//	models.DB.Find(&accounts)
	//	fmt.Println(accounts)
	//	account := models.Account{Email: email}
	//	if result := models.DB.Create(&account); result.Error != nil {
	//		c.JSON(http.StatusBadRequest, gin.H{"error": result.Error})
	//		return
	//	} else {
	//
	//	}
	//}
	//c.JSON(http.StatusOK, gin.H{"accounts": accounts})
}
