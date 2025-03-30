package controller

import (
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/YerzatCode/ReportApp_backend/pkg/db"
	"github.com/YerzatCode/ReportApp_backend/pkg/models"
	"github.com/gin-gonic/gin"
)

// 📌 Новый эндпоинт: загрузка фото и получение URL
func UploadImage(c *gin.Context) {
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(400, gin.H{"error": "No image provided"})
		return
	}

	userID := c.PostForm("user_id")
	if userID == "" {
		c.JSON(400, gin.H{"error": "User ID is required"})
		return
	}

	savePath := filepath.Join("uploads", "incidents", userID)
	if _, err := os.Stat(savePath); os.IsNotExist(err) {
		os.MkdirAll(savePath, os.ModePerm)
	}

	fileName := strconv.FormatInt(time.Now().UnixNano(), 10) + filepath.Ext(file.Filename)
	filePath := filepath.Join(savePath, fileName)

	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(500, gin.H{"error": "Failed to save image"})
		return
	}

	imageURL := filePath // Возвращаем относительный путь

	c.JSON(200, gin.H{"image_url": imageURL})
}

func ReportIncident(c *gin.Context) {
	var incident models.Incident
	if err := c.ShouldBindJSON(&incident); err != nil {
		c.JSON(400, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	// // ✅ Преобразуем images в JSON-строку
	// imagesJSON, err := json.Marshal(incident.Images)
	// if err != nil {
	// 	c.JSON(500, gin.H{"error": "Failed to process images", "details": err.Error()})
	// 	return
	// }
	// incident.Images = images// Заменяем []string на JSON-строку

	incident.Status = "open"

	if err := db.DB.Create(&incident).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to save incident", "details": err.Error()})
		return
	}

	c.JSON(201, gin.H{"message": "Incident reported", "incident": incident})
}

// 📌 Получить все инциденты
func GetIncidents(c *gin.Context) {
	var incidents []models.Incident
	db.DB.Find(&incidents)
	c.JSON(200, gin.H{"incidents": incidents})
}

// 📌 Получить инцидент по ID
func GetIncidentByID(c *gin.Context) {
	var incident models.Incident
	id := c.Param("id")

	if err := db.DB.Where("id = ?", id).First(&incident).Error; err != nil {
		c.JSON(404, gin.H{"error": "Incident not found"})
		return
	}

	c.JSON(200, gin.H{"incident": incident})
}

func UpdateIncidentStatus(c *gin.Context) {
	var incident models.Incident
	id := c.Param("id")

	// Проверяем, существует ли инцидент
	if err := db.DB.Where("id = ?", id).First(&incident).Error; err != nil {
		c.JSON(404, gin.H{"error": "Incident not found"})
		return
	}

	// Получаем новый статус из запроса
	var requestBody struct {
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(400, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	// Обновляем статус
	incident.Status = requestBody.Status
	if err := db.DB.Save(&incident).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to update incident status", "details": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "Incident status updated", "incident": incident})
}
