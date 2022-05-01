package concerns

import (
	"fmt"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/nozomi-iida/attendance-management/app/controllers"
	"github.com/nozomi-iida/attendance-management/app/models"
	"strings"
)

/*
	1. headerのAuthorizationからtokenを取り出す
	2. tokenをdecodeし、accountを特定する
	3. accountが見つからなかったらエラーを出す
	3. accountをsessionにいれる

*/
func AuthenticateAccount() gin.HandlerFunc {
	return func(c *gin.Context) {
		currentJwt := strings.Split(c.GetHeader("Authorization"), "Bearer")[1]
		authClaims := controllers.AuthClaims{}
		fmt.Println("currentJwt", currentJwt)
		_, err := jwt.ParseWithClaims(currentJwt, &authClaims, func(token *jwt.Token) (interface{}, error) {
			return []byte("auth_token"), nil
		})
		if err != nil {
			fmt.Println("ParseWithClaims", err)
		}
		fmt.Println("authClaims", authClaims)
		account := models.Account{ID: authClaims.ID}
		models.DB.Find(&account)
		session := sessions.Default(c)
		session.Set("currentAccount", account)
		err = session.Save()
		if err != nil {
			fmt.Println("session.Save", err)
		}
	}
}
