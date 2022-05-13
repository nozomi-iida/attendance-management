package controllers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/nozomi-iida/attendance-management/app/models"
	"github.com/nozomi-iida/attendance-management/lib/errors"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/http"
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
	Token    string `json:"token" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func (ac *AuthController) SignUp(c *gin.Context) {
	var signUpInput SignUpInput
	err := c.ShouldBindJSON(&signUpInput)
	if err != nil {
		c.Error(errors.BadRequest(err))
		return
	}
	inviteClaims := InviteTokenClaims{}
	_, err = jwt.ParseWithClaims(signUpInput.Token, &inviteClaims, func(token *jwt.Token) (interface{}, error) {
		return []byte("invite_token"), nil
	})
	if err != nil {
		c.Error(errors.BadRequest(err))
		return
	}
	if models.CheckAccountExist(inviteClaims.Email) {
		c.Error(errors.DuplicateEmailError)
		return
	}
	account := models.Account{Email: inviteClaims.Email, Password: signUpInput.Password}
	if err = models.CreateAccount(&account); err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusCreated, gin.H{
		"account": account,
		"token":   account.Jwt(),
	})
}

/*
	1. emailとパスワードを受け取る
	2. accountを特定する
	3. tokenを生成する
	4. accountとtokenを返す
*/
type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (ac *AuthController) Login(c *gin.Context) {
	var loginInput LoginInput
	err := c.BindJSON(&loginInput)
	if err != nil {
		log.Fatal(err)
	}
	var account models.Account
	if err := models.DB.Where("email = ?", loginInput.Email).First(&account).Error; err != nil {
		c.Error(errors.Unauthorized)
		return
	}
	// FIXME: きれいに書きたい
	err = bcrypt.CompareHashAndPassword([]byte(account.Password), []byte(loginInput.Password))
	if err != nil {
		fmt.Println("CompareHashAndPassword", err)
	}
	c.JSON(http.StatusOK, gin.H{
		"account": account,
		"token":   account.Jwt(),
	})
}
