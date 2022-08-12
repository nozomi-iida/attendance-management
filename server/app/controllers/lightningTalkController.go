package controllers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/nozomi-iida/attendance-management/app/models"
	"github.com/nozomi-iida/attendance-management/config/middleware"
	"github.com/nozomi-iida/attendance-management/lib/errors"
	"net/http"
	"time"
)

type LightningTalkController struct {
}

func NewLightningTalkController() *LightningTalkController {
	return new(LightningTalkController)
}

func (lt *LightningTalkController) IndexLightningTalk(c *gin.Context) {
	var lightningTalks []models.LightningTalk
	month := c.Query("month")
	if month == "" {
		c.Error(errors.NewError(http.StatusBadRequest, "月を指定してください"))
		return
	}
	monthTime := stringToTime(month)
	firstDay := time.Date(monthTime.Year(), monthTime.Month(), 1, 0, 0, 0, 0, time.Local)
	lastDay := firstDay.AddDate(0, 1, 0).Add(time.Nanosecond * -1)
	// Whereもっとスマートな書き方がありそう
	models.DB.Where("talk_day BETWEEN ? AND ?", firstDay, lastDay).Find(&lightningTalks)

	c.JSON(http.StatusOK, gin.H{"lightningTalks": lightningTalks})

}

func (lt *LightningTalkController) IndexMyLightningTalk(c *gin.Context) {

}

type CreateLightningTalkInput struct {
	Title       string    `json:"title" binding:"required"`
	TalkDay     time.Time `json:"talkDay" binding:"required"`
	Description *string   `json:"description"`
}

func (lt *LightningTalkController) CreateLightningTalk(c *gin.Context) {
	var createLightningTalkInput CreateLightningTalkInput
	if err := c.ShouldBindJSON(&createLightningTalkInput); err != nil {
		fmt.Println("BadRequest", err)
		c.Error(errors.BadRequest(err))
		return
	}
	account := middleware.CurrentAccount
	lightningTalk := models.LightningTalk{Title: createLightningTalkInput.Title, TalkDay: createLightningTalkInput.TalkDay, Description: createLightningTalkInput.Description, Author: &account}

	if err := models.DB.Create(&lightningTalk).Error; err != nil {
		fmt.Println("err", err)
		c.Error(err)
		return
	}
	c.JSON(http.StatusCreated, lightningTalk)
}

func (lt *LightningTalkController) GetLightningTalk(c *gin.Context) {

}

func (lt *LightningTalkController) PatchLightningTalk(c *gin.Context) {

}

func (lt *LightningTalkController) DeleteLightningTalk(c *gin.Context) {

}
