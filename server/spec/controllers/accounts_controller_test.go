package controllers

import (
	"fmt"
	"github.com/go-playground/assert/v2"
	"github.com/nozomi-iida/attendance-management/app/models"
	"github.com/nozomi-iida/attendance-management/config"
	"github.com/nozomi-iida/attendance-management/spec"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
)

func TestMain(m *testing.M) {
	spec.SetUp()
	code := m.Run()
	spec.CleanUpFixture()
	os.Exit(code)
}

func TestInviteAccount(t *testing.T) {
	router := config.SetupRouter()
	reqBody := strings.NewReader(`{"Emails": ["test@test.com"]}`)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/accounts/invite", reqBody)
	router.ServeHTTP(w, req)
	assert.Equal(t, w.Code, 200)

	var account models.Account
	models.DB.First(&account)
	var accounts []models.Account
	models.DB.Find(&accounts)
	fmt.Println("accounts", accounts)
	assert.Equal(t, "test", account.HandleName)
}