package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/nozomi-iida/attendance-management/app/models"
	"log"
	"net/http"
	"time"
)

type AuthController struct{}

func NewAuthController() *AuthController {
	return new(AuthController)
}

/*
	1. tokenとpasswordを受け取る
	2. tokenをdecodeしてemailを取り出す
	3. emailからHandleNameを設定する
	4. アカウントを作成する
	5. 認証用のtokenを作成する
	6. アカウント, tokenを返す
*/
type SignUpInput struct {
	Token    string `json:"token"`
	Password string `json:"password"`
}

type SignUpClaims struct {
	ID uint `json:"id"`
	jwt.RegisteredClaims
}

func (ac *AuthController) SignUp(c *gin.Context) {
	var signUpInput SignUpInput
	err := c.BindJSON(&signUpInput)
	// このエラーハンドリング間違えてそう
	if err != nil {
		log.Fatal(err)
	}
	inviteClaims := InviteTokenClaims{}
	_, err = jwt.ParseWithClaims(signUpInput.Token, &inviteClaims, func(token *jwt.Token) (interface{}, error) {
		return []byte("invite_token"), nil
	})
	if err != nil {
		log.Fatal(err)
	}
	var accounts []models.Account
	models.DB.Find(&accounts)
	account := models.Account{Email: inviteClaims.Email}
	if result := account.Create(); result.Error != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"err": result.Error,
		})
		return
	}
	signUpClaims := SignUpClaims{
		account.ID,
		jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}
	signUpToken := jwt.NewWithClaims(jwt.SigningMethodHS256, signUpClaims)
	tokenString, _ := signUpToken.SignedString([]byte("sign_up_token"))
	c.JSON(http.StatusCreated, gin.H{
		"account": account,
		"token":   tokenString,
	})
}
