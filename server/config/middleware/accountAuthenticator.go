package middleware

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/nozomi-iida/attendance-management/app/models"
	"github.com/nozomi-iida/attendance-management/lib/errors"
	"strings"
)

/*
	1. headerのAuthorizationからtokenを取り出す
	2. tokenをdecodeし、accountを特定する
	3. accountが見つからなかったらエラーを出す
	3. accountをsessionにいれる

*/

var CurrentAccount models.Account

func AuthenticateAccount() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		if token == "" {
			c.Abort()
			c.Error(errors.Unauthorized)
			return
		}

		fmt.Println("token", len(token))
		currentJwt := strings.Split(token, "Bearer ")[1]
		var authClaims models.AuthClaims
		_, err := jwt.ParseWithClaims(currentJwt, &authClaims, func(token *jwt.Token) (interface{}, error) {
			return []byte("auth_token"), nil
		})
		if err != nil {
			c.Abort()
			c.Error(err)
			return
		}
		account := models.Account{ID: authClaims.ID}
		models.DB.Find(&account)
		if len(account.Email) == 0 {
			c.Abort()
			CurrentAccount = models.Account{}
			c.Error(errors.Unauthorized)
			return
		}
		CurrentAccount = account
	}
}
