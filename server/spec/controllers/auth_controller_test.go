package controllers

import (
	"fmt"
	"github.com/go-playground/assert/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/nozomi-iida/attendance-management/app/controllers"
	"github.com/nozomi-iida/attendance-management/app/models"
	"github.com/nozomi-iida/attendance-management/config"
	"github.com/nozomi-iida/attendance-management/spec"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"
)

func TestMain(m *testing.M) {
	spec.SetUp()
	m.Run()
	spec.CloseDb()
}

func TestSignUp(t *testing.T) {
	defer spec.CleanUpFixture()
	email := "test@gmail.com"
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, controllers.InviteTokenClaims{
		Email: email,
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	})
	tokenString, _ := token.SignedString([]byte("invite_token"))
	router := config.SetupRouter()

	t.Run("success", func(t *testing.T) {
		// reqBodyはそれぞれで定義しないとダメかも
		reqBody := strings.NewReader(fmt.Sprintf(`{"token": "%s", "password": "password"}`, tokenString))
		request, _ := http.NewRequest("POST", "/sign_up", reqBody)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, request)
		assert.Equal(t, w.Code, 201)
		var account models.Account
		models.DB.First(&account)
		assert.Equal(t, email, account.Email)
	})
	t.Run("error with badRequest", func(t *testing.T) {
		reqBody := strings.NewReader(fmt.Sprintf(`{"password": "password"}`))
		request, _ := http.NewRequest("POST", "/sign_up", reqBody)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, request)
		assert.Equal(t, w.Code, 400)
	})
	t.Run("email duplicate", func(t *testing.T) {
		reqBody := strings.NewReader(fmt.Sprintf(`{"token": "%s", "password": "password"}`, tokenString))
		request, _ := http.NewRequest("POST", "/sign_up", reqBody)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, request)
		assert.Equal(t, w.Code, 422)
	})
}

func TestSignIn(t *testing.T) {
	defer spec.CleanUpFixture()

	account := models.Account{Email: "test@test.com", Password: "password", HandleName: "test"}
	models.CreateAccount(&account)

	t.Run("success", func(t *testing.T) {
		router := config.SetupRouter()
		reqBody := strings.NewReader(fmt.Sprintf(`{"email": "%s", "password": "%s"}`, account.Email, account.Password))
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("POST", "/sign_in", reqBody)
		router.ServeHTTP(w, req)
		assert.Equal(t, w.Code, 200)
		assert.MatchRegex(t, w.Body.String(), account.Email)
	})
}
