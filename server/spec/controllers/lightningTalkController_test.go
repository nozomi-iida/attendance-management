package controllers

import (
	"github.com/nozomi-iida/attendance-management/app/models"
	"github.com/nozomi-iida/attendance-management/spec"
	"github.com/nozomi-iida/attendance-management/spec/factories"
	"testing"
	"time"
)

func TestIndexLightningTalk(t *testing.T) {
	spec.SetUp(t)
	defer spec.CloseDb()
	var account = factories.MockAccount()
	models.DB.Create(&account)
	lightningTalk := factories.MockLightningTalk(func(lightningTalk *models.LightningTalk) {
		lightningTalk.TalkDay = time.Date(2014, time.December, 31, 12, 13, 24, 0, time.UTC)
	})
	models.DB.Create(&lightningTalk)

	t.Run("get lightning talks", func(t *testing.T) {
	})
	t.Run("error: get lightning talks without month", func(t *testing.T) {
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

func TestCreate(t *testing.T) {
	spec.SetUp(t)
	defer spec.CloseDb()
	var account = factories.MockAccount()
	models.DB.Create(&account)

	t.Run("create lightning talk", func(t *testing.T) {
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
