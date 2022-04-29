package controllers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/nozomi-iida/attendance-management/app/models"
	"golang.org/x/crypto/bcrypt"
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

type AuthClaims struct {
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
	signUpClaims := AuthClaims{
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

/*
	1. emailとパスワードを受け取る
	2. accountを特定する
	3. tokenを生成する
	4. accountとtokenを返す
*/
type SignInInput struct {
	email    string `json:"email"`
	Password string `json:"password"`
}

func (ac *AuthController) SignIn(c *gin.Context) {
	var signInInput SignInInput
	err := c.BindJSON(&signInInput)
	if err != nil {
		log.Fatal(err)
	}
	var account models.Account
	// FIXME: きれいに書きたい
	models.DB.Find(&account)
	err = bcrypt.CompareHashAndPassword([]byte(account.Password), []byte(signInInput.Password))
	if err != nil {
		log.Fatal(err)
	}
	signInClaims := AuthClaims{
		account.ID,
		jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}
	signInToken := jwt.NewWithClaims(jwt.SigningMethodHS256, signInClaims)
	tokenString, _ := signInToken.SignedString([]byte("sign_in_token"))
	fmt.Println("account", account.HandleName)
	c.JSON(http.StatusOK, gin.H{
		"account": account,
		"token":   tokenString,
	})
}
