package controllers

import (
	"fmt"
	"github.com/go-playground/assert/v2"
	"github.com/nozomi-iida/attendance-management/app/models"
	"github.com/nozomi-iida/attendance-management/config"
	"github.com/nozomi-iida/attendance-management/spec"
	"github.com/nozomi-iida/attendance-management/spec/factories"
	"net/http"
	"net/http/httptest"
	"testing"
)

var account = factories.Account()

func TestMain(m *testing.M) {
	spec.SetUp()
	models.DB.Create(&account)
	m.Run()
	spec.CloseDb()
}

func TestIndexAttendance(t *testing.T) {
	defer spec.CleanUpFixture()
}

func TestCreateAttendance(t *testing.T) {
	defer spec.CleanUpFixture()
	router := config.SetupRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/attendances", nil)
	// TODO: tokenをセット
	req.Header.Set("Authorization", fmt.Sprintf(`Bearer %s`, account.Jwt()))
	router.ServeHTTP(w, req)
	assert.Equal(t, w.Code, 201)
}
