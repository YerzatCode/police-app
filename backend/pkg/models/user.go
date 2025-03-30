package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	FirstName  string `json:"first_name"`
	LastName   string `json:"last_name"`
	Email      string `json:"email" gorm:"unique"`
	Phone      string `json:"phone" gorm:"unique"`
	PassportID string `json:"passport_id"`
	Login      string `json:"login" gorm:"unique"`
	Password   string `json:"password"` // скрываем пароль в API
	Role       string `json:"role"`     // "user" или "operator"
}
