package concerns

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/nozomi-iida/attendance-management/app/models"
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
		currentJwt := strings.Split(c.GetHeader("Authorization"), "Bearer ")[1]
		var authClaims models.AuthClaims
		_, err := jwt.ParseWithClaims(currentJwt, &authClaims, func(token *jwt.Token) (interface{}, error) {
			return []byte("auth_token"), nil
		})
		if err != nil {
			fmt.Println("ParseWithClaims", err)
		}
		account := models.Account{ID: authClaims.ID}
		models.DB.Find(&account)
		CurrentAccount = account
	}
}
