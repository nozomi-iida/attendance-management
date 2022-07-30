package models

import (
	"gorm.io/gorm"
	"time"
)

type LightningTalk struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `json:"deletedAt,omitempty" gorm:"index"`
	TalkDay     time.Time      `json:"talkDay"`
	Title       string         `json:"title"`
	Description string         `json:"description"`
	AccountId   uint           `json:"accountId"`
	Author      *Account       `json:"auth,omitempty" gorm:"constraint:OnDelete:SET NULL;foreignKey:AccountId"`
}
