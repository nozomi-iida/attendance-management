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

var account = factories.Account()
var router = config.SetupRouter()

func TestMain(m *testing.M) {
	spec.SetUp()
	models.DB.Create(&account)
	models.DB.Create(&models.Attendance{Account: &account})
	models.DB.Create(&models.Attendance{Account: &account})
	models.DB.Create(&models.Attendance{Account: &account})
	m.Run()
	spec.CloseDb()
}

type IndexAttendancesResponse struct {
	Attendances []models.Attendance `json:"attendances"`
}

func TestIndexAttendance(t *testing.T) {
	t.Run("badRequest for not select month", func(t *testing.T) {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/attendances", nil)
		req.Header.Set("Authorization", fmt.Sprintf(`Bearer %s`, account.Jwt()))
		router.ServeHTTP(w, req)
		assert.Equal(t, w.Code, 400)
	})
	t.Run("success", func(t *testing.T) {
		w := httptest.NewRecorder()
		testTime := time.Date(2020, 4, 15, 16, 48, 32, 12345, time.Local)
		models.DB.Create(&models.Attendance{Account: &account, StartedAt: testTime})
		req, _ := http.NewRequest("GET", "/attendances", nil)
		query := req.URL.Query()
		query.Add("month", testTime.Format("2006-01-02 15:04:05"))
		req.URL.RawQuery = query.Encode()
		req.Header.Set("Authorization", fmt.Sprintf(`Bearer %s`, account.Jwt()))
		router.ServeHTTP(w, req)
		var attendances IndexAttendancesResponse
		json.Unmarshal([]byte(w.Body.String()), &attendances)
		assert.Equal(t, w.Code, 200)
		assert.Equal(t, len(attendances.Attendances), 1)
	})
}

func TestGetAttendance(t *testing.T) {
	attendance := models.Attendance{Account: &account}
	models.DB.Create(&attendance)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", fmt.Sprintf("/attendances/%s", strconv.FormatUint(uint64(attendance.ID), 10)), nil)
	req.Header.Set("Authorization", fmt.Sprintf(`Bearer %s`, account.Jwt()))
	router.ServeHTTP(w, req)
	assert.Equal(t, w.Code, 200)
}

func TestCreateAttendance(t *testing.T) {
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/attendances", nil)
	req.Header.Set("Authorization", fmt.Sprintf(`Bearer %s`, account.Jwt()))
	router.ServeHTTP(w, req)
	assert.Equal(t, w.Code, 201)
}

func TestUpdateAttendance(t *testing.T) {
	attendance := models.Attendance{Account: &account}
	workTime := 500
	models.DB.Create(&attendance)
	reqBody := strings.NewReader(fmt.Sprintf(`{"WorkTime": %d}`, workTime))
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("PATCH", fmt.Sprintf("/attendances/%s", strconv.FormatUint(uint64(attendance.ID), 10)), reqBody)
	req.Header.Set("Authorization", fmt.Sprintf(`Bearer %s`, account.Jwt()))
	router.ServeHTTP(w, req)
	assert.Equal(t, w.Code, 200)
	assert.MatchRegex(t, w.Body.String(), strconv.Itoa(workTime))
}

func TestDeleteAttendance(t *testing.T) {
	attendance := models.Attendance{Account: &account}
	models.DB.Create(&attendance)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", fmt.Sprintf("/attendances/%s", strconv.FormatUint(uint64(attendance.ID), 10)), nil)
	req.Header.Set("Authorization", fmt.Sprintf(`Bearer %s`, account.Jwt()))
	router.ServeHTTP(w, req)
	assert.Equal(t, w.Code, 204)
}
