package controllers

import (
	"encoding/json"
	"fmt"
	"github.com/go-playground/assert/v2"
	"github.com/nozomi-iida/attendance-management/app/models"
	"github.com/nozomi-iida/attendance-management/app/serializers"
	"github.com/nozomi-iida/attendance-management/config"
	"github.com/nozomi-iida/attendance-management/spec"
	"github.com/nozomi-iida/attendance-management/spec/factories"
	"net/http"
	"net/http/httptest"
	"strconv"
	"strings"
	"testing"
	"time"
)

func TestInviteAccount(t *testing.T) {
	var account = factories.MockAccount()
	spec.SetUp(t)
	models.DB.Create(&account)
	defer spec.CloseDb()
	router := config.SetupRouter()

	t.Run("success", func(t *testing.T) {
		reqBody := strings.NewReader(`{"Emails": ["hoge@test.com"]}`)
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("POST", "/accounts/invite", reqBody)
		req.Header.Set("Authorization", fmt.Sprintf(`Bearer %s`, account.Jwt()))
		router.ServeHTTP(w, req)
		assert.Equal(t, w.Code, 200)
	})

	t.Run("duplicate email error", func(t *testing.T) {
		reqBody := strings.NewReader(`{"Emails": ["test@test.com"]}`)
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("POST", "/accounts/invite", reqBody)
		req.Header.Set("Authorization", fmt.Sprintf(`Bearer %s`, account.Jwt()))
		router.ServeHTTP(w, req)
		assert.Equal(t, w.Code, 422)
	})
}

func TestGetAccount(t *testing.T) {
	spec.SetUp(t)
	defer spec.CloseDb()
	var account = factories.MockAccount()
	models.DB.Create(&account)
	models.DB.Create(&models.Attendance{Account: account, StartedAt: time.Now()})
	router := config.SetupRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", fmt.Sprintf("/accounts/%s", strconv.FormatUint(uint64(account.ID), 10)), nil)
	req.Header.Set("Authorization", fmt.Sprintf(`Bearer %s`, account.Jwt()))
	router.ServeHTTP(w, req)
	var accountSerializer serializers.AccountSerializer
	_ = json.Unmarshal([]byte(w.Body.String()), &accountSerializer)
	assert.Equal(t, w.Code, 200)
	//assert.Equal(t, accountSerializer.CurrentAttendance.IsBreak, false)
}
