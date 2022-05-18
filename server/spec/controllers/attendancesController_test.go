package controllers

import (
	"encoding/json"
	"fmt"
	"github.com/go-playground/assert/v2"
	"github.com/nozomi-iida/attendance-management/app/models"
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

type indexAttendanceResponse struct {
	Attendances []models.Attendance `json:"attendances"`
}

func TestIndexAttendance(t *testing.T) {
	spec.SetUp(t)
	defer spec.CloseDb()
	var account = factories.MockAccount()
	models.DB.Create(&account)
	models.DB.Create(&models.Attendance{Account: account})
	models.DB.Create(&models.Attendance{Account: account})
	models.DB.Create(&models.Attendance{Account: account})
	var router = config.SetupRouter()

	t.Run("badRequest for not select month", func(t *testing.T) {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", fmt.Sprintf(`/accounts/%d/attendances`, account.ID), nil)
		req.Header.Set("Authorization", fmt.Sprintf(`Bearer %s`, account.Jwt()))
		router.ServeHTTP(w, req)
		assert.Equal(t, w.Code, 400)
	})
	t.Run("success", func(t *testing.T) {
		w := httptest.NewRecorder()
		testTime := time.Date(2020, 4, 15, 16, 48, 32, 12345, time.Local)
		models.DB.Create(&models.Attendance{Account: account, StartedAt: testTime})
		req, _ := http.NewRequest("GET", fmt.Sprintf(`/accounts/%d/attendances`, account.ID), nil)
		query := req.URL.Query()
		query.Add("month", testTime.Format("2006-01"))
		req.URL.RawQuery = query.Encode()
		req.Header.Set("Authorization", fmt.Sprintf(`Bearer %s`, account.Jwt()))
		router.ServeHTTP(w, req)
		var attendances indexAttendanceResponse
		_ = json.Unmarshal([]byte(w.Body.String()), &attendances)
		assert.Equal(t, w.Code, 200)
		assert.Equal(t, len(attendances.Attendances), 1)
	})
}

func TestGetAttendance(t *testing.T) {
	spec.SetUp(t)
	defer spec.CloseDb()
	var account = factories.MockAccount()
	models.DB.Create(&account)
	models.DB.Create(&models.Attendance{Account: account})
	var router = config.SetupRouter()

	attendance := models.Attendance{Account: account}
	models.DB.Create(&attendance)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", fmt.Sprintf("/accounts/%d/attendances/%d", account.ID, attendance.ID), nil)
	req.Header.Set("Authorization", fmt.Sprintf(`Bearer %s`, account.Jwt()))
	router.ServeHTTP(w, req)
	assert.Equal(t, w.Code, 200)
}

func TestCreateAttendance(t *testing.T) {
	spec.SetUp(t)
	defer spec.CloseDb()
	var account = factories.MockAccount()
	models.DB.Create(&account)
	var router = config.SetupRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", fmt.Sprintf(`/accounts/%d/attendances`, account.ID), nil)
	req.Header.Set("Authorization", fmt.Sprintf(`Bearer %s`, account.Jwt()))
	router.ServeHTTP(w, req)
	assert.Equal(t, w.Code, 201)
}

// TODO: 退勤・休憩のテスト書く
func TestUpdateAttendance(t *testing.T) {
	spec.SetUp(t)
	defer spec.CloseDb()
	account := factories.MockAccount()
	models.DB.Create(&account)
	var router = config.SetupRouter()

	t.Run("update attendance", func(t *testing.T) {
		attendance := models.Attendance{Account: account}
		workTime := 500
		models.DB.Create(&attendance)
		reqBody := strings.NewReader(fmt.Sprintf(`{"workTime": %d}`, workTime))
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("PATCH", fmt.Sprintf("/accounts/%d/attendances/%d", account.ID, attendance.ID), reqBody)
		req.Header.Set("Authorization", fmt.Sprintf(`Bearer %s`, account.Jwt()))
		router.ServeHTTP(w, req)
		assert.Equal(t, w.Code, 200)
		assert.MatchRegex(t, w.Body.String(), strconv.Itoa(workTime))
	})

	t.Run("leaving work", func(t *testing.T) {
		attendance := models.Attendance{Account: account, StartedAt: time.Date(2014, 12, 20, 12, 0, 0, 0, time.Local)}
		endedAt := time.Date(2014, 12, 20, 15, 0, 0, 0, time.UTC).Format(time.RFC3339)
		models.DB.Create(&attendance)
		reqBody := strings.NewReader(fmt.Sprintf(`{"endedAt": "%s"}`, endedAt))
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("PATCH", fmt.Sprintf("/accounts/%d/attendances/%d", account.ID, attendance.ID), reqBody)
		req.Header.Set("Authorization", fmt.Sprintf(`Bearer %s`, account.Jwt()))
		router.ServeHTTP(w, req)
		var response models.Attendance
		_ = json.Unmarshal([]byte(w.Body.String()), &response)
		assert.Equal(t, w.Code, 200)
		assert.Equal(t, response.WorkTime, 720)
	})
}

func TestDeleteAttendance(t *testing.T) {
	spec.SetUp(t)
	defer spec.CloseDb()
	var account = factories.MockAccount()
	models.DB.Create(&account)
	models.DB.Create(&models.Attendance{Account: account})
	var router = config.SetupRouter()

	attendance := models.Attendance{Account: account}
	models.DB.Create(&attendance)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", fmt.Sprintf("/accounts/%d/attendances/%d", account.ID, attendance.ID), nil)
	req.Header.Set("Authorization", fmt.Sprintf(`Bearer %s`, account.Jwt()))
	router.ServeHTTP(w, req)
	assert.Equal(t, w.Code, 204)
}
