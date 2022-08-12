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
	"strings"
	"testing"
	"time"
)

type indexLightningTalks struct {
	LightningTalks []models.LightningTalk `json:"lightningTalks"`
}

func TestIndexLightningTalk(t *testing.T) {
	spec.SetUp(t)
	defer spec.CloseDb()
	var account = factories.MockAccount()
	models.DB.Create(&account)
	mockLightningTalk := factories.MockLightningTalk()
	models.DB.Create(&mockLightningTalk)

	var router = config.SetupRouter()

	t.Run("get lightning talks", func(t *testing.T) {
		testTime := time.Date(2020, 4, 15, 16, 48, 32, 12345, time.Local)
		testLightningTalk := factories.MockLightningTalk(func(lightningTalk *models.LightningTalk) {
			lightningTalk.TalkDay = testTime
			lightningTalk.Author = account
		})
		models.DB.Create(&testLightningTalk)
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/lightning_talks", nil)
		query := req.URL.Query()
		query.Add("month", testTime.Format("2006-01"))
		req.URL.RawQuery = query.Encode()
		req.Header.Set("Authorization", fmt.Sprintf(`Bearer %s`, account.Jwt()))
		router.ServeHTTP(w, req)
		var lightningTalks indexLightningTalks
		_ = json.Unmarshal([]byte(w.Body.String()), &lightningTalks)
		assert.Equal(t, w.Code, 200)
		assert.Equal(t, len(lightningTalks.LightningTalks), 1)
	})
	t.Run("error: get lightning talks without month", func(t *testing.T) {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/lightning_talks", nil)
		req.Header.Set("Authorization", fmt.Sprintf(`Bearer %s`, account.Jwt()))
		router.ServeHTTP(w, req)
		assert.Equal(t, w.Code, 400)
	})
}

func TestIndexMy(t *testing.T) {
	spec.SetUp(t)
	defer spec.CloseDb()
	var account = factories.MockAccount()
	models.DB.Create(&account)

	t.Run("get my lightning talks", func(t *testing.T) {
	})
	t.Run("error: get my lightning talks without month", func(t *testing.T) {
	})
}

func TestCreateLightningTalk(t *testing.T) {
	spec.SetUp(t)
	defer spec.CloseDb()
	var account = factories.MockAccount()
	models.DB.Create(&account)
	var router = config.SetupRouter()

	t.Run("create lightning talk", func(t *testing.T) {
		w := httptest.NewRecorder()
		title := "testLT会"
		fmt.Println("time.Format", time.Now().Format(time.RFC3339), "time.now", time.Now())
		reqBody := strings.NewReader(fmt.Sprintf(`{"title": "%s", "talkDay": "%s"}`, title, time.Now().Format(time.RFC3339)))
		req, _ := http.NewRequest("POST", "/lightning_talks", reqBody)
		req.Header.Set("Authorization", fmt.Sprintf(`Bearer %s`, account.Jwt()))
		router.ServeHTTP(w, req)
		assert.Equal(t, w.Code, 201)
		assert.MatchRegex(t, w.Body.String(), title)
	})
}

func TestGet(t *testing.T) {
	spec.SetUp(t)
	defer spec.CloseDb()
	var account = factories.MockAccount()
	models.DB.Create(&account)

	t.Run("get lightning talk", func(t *testing.T) {
	})
}

func TestPatch(t *testing.T) {
	spec.SetUp(t)
	defer spec.CloseDb()
	var account = factories.MockAccount()
	models.DB.Create(&account)

	t.Run("patch lightning talk", func(t *testing.T) {
	})
	t.Run("error: not patch lightning talk when other author try to patch", func(t *testing.T) {
	})
}

func TestDelete(t *testing.T) {
	spec.SetUp(t)
	defer spec.CloseDb()
	var account = factories.MockAccount()
	models.DB.Create(&account)

	t.Run("delete lightning talk", func(t *testing.T) {
	})
	t.Run("error: not delete lightning talk when other author try to delete", func(t *testing.T) {
	})
}
