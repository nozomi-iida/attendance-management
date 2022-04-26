package controllers

import (
	"github.com/go-playground/assert/v2"
	"github.com/nozomi-iida/attendance-management/config"
	"github.com/nozomi-iida/attendance-management/spec"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestMain(m *testing.M) {
	spec.SetUp()
	m.Run()
	spec.CleanUpFixture()
}

func TestInviteAccount(t *testing.T) {
	router := config.SetupRouter()
	reqBody := strings.NewReader(`{"Emails": ["test@test.com"]}`)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/accounts/invite", reqBody)
	router.ServeHTTP(w, req)
	assert.Equal(t, w.Code, 200)
}
