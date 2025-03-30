package models

import "gorm.io/gorm"

type Incident struct {
	gorm.Model
	UserID      uint    `json:"user_id"`
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Images      string  `json:"images" gorm:"type:json"`
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
	Status      string  `json:"status"`
}
