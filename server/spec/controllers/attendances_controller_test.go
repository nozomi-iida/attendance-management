package controllers

import (
	"github.com/go-playground/assert/v2"
	"github.com/nozomi-iida/attendance-management/config"
	"github.com/nozomi-iida/attendance-management/spec"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestMain(m *testing.M) {
	spec.SetUp()
	m.Run()
	spec.CloseDb()
}

func TestCreateAttendance(t *testing.T) {
	defer spec.CleanUpFixture()
	router := config.SetupRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/attendances", nil)
	router.ServeHTTP(w, req)
	assert.Equal(t, w.Code, 201)
}
