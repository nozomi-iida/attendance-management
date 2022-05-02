package jwt

import (
	"github.com/golang-jwt/jwt/v4"
	"log"
)

// 使ってない
func Encode(key string, claims jwt.Claims) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(key))
}

func Decode(tokenString string, key string, claims jwt.Claims) {
	_, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(key), nil
	})
	if err != nil {
		log.Fatal(err)
	}
}
