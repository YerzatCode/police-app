package models

import "gorm.io/gorm"

type Message struct {
	gorm.Model
	SenderID   string `json:"sender_id"`
	ReceiverID string `json:"receiver_id"`
	Text       string `json:"text"`
	IsRead     bool   `json:"is_read"`
}
