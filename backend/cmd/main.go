package main

import (
	"github.com/YerzatCode/ReportApp_backend/pkg/controller"
	"github.com/YerzatCode/ReportApp_backend/pkg/db"
	"github.com/YerzatCode/ReportApp_backend/pkg/middleware"
	"github.com/YerzatCode/ReportApp_backend/pkg/models"
	"github.com/gin-gonic/gin"
)

func main() {
	db.ConnectDatabase()
	db.DB.AutoMigrate(&models.User{}, &models.Message{}, &models.Incident{})
	router := gin.Default()
	router.Use(middleware.CORSMiddleware())
	router.Use(middleware.LoggingMiddleware())
	controller.InitRoutes(router)

	router.Run(":8080")
}
