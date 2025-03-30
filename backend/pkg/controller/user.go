package controller

import (
	"net/http"

	"github.com/YerzatCode/ReportApp_backend/pkg/db"
	"github.com/YerzatCode/ReportApp_backend/pkg/models"
	"github.com/gin-gonic/gin"
)

func getUsers(c *gin.Context) {
	var users []models.User
	db.DB.Find(&users) // ❌ Ошибка: users передаётся как значение
	c.JSON(http.StatusOK, users)
}
