package controller

import (
	"fmt"
	"time"

	"github.com/YerzatCode/ReportApp_backend/pkg/db"
	"github.com/YerzatCode/ReportApp_backend/pkg/models"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var jwtKey = []byte("secret_key")

func Register(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(400, gin.H{"error": "Invalid input"})
		return
	}
	user.Role = "user"
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 10)
	if err != nil {
		c.JSON(500, gin.H{"error": "Error hashing password"})
		return
	}
	user.Password = string(hashedPassword)

	db.DB.Create(&user)
	c.JSON(201, gin.H{"message": "User registered"})
}

func Login(c *gin.Context) {
	var input struct {
		Login    string `json:"login"`
		Password string `json:"password"`
	}
	var user models.User

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request"})
		return
	}

	// Ищем пользователя в базе
	db.DB.Where("login = ?", input.Login).First(&user)

	// Проверяем, найден ли пользователь
	if user.ID == 0 {
		c.JSON(401, gin.H{"error": "Invalid credentials"})
		return
	}
	fmt.Print(user.Password)
	// Проверяем пароль
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		c.JSON(401, gin.H{"error": err.Error()})
		return
	}

	// Создаем токен
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":  user.ID,
		"exp": time.Now().Add(time.Hour * 24).Unix(),
	})
	tokenString, _ := token.SignedString(jwtKey)

	c.JSON(200, gin.H{"token": tokenString})
}

func Auth(c *gin.Context) {
	user, _ := c.Get("user")
	c.JSON(200, gin.H{"user": user})
}
