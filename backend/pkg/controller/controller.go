package controller

import (
	"github.com/YerzatCode/ReportApp_backend/pkg/middleware"
	"github.com/gin-gonic/gin"
)

func InitRoutes(r *gin.Engine) {
	r.POST("/upload", UploadImage)
	r.Static("/uploads", "./uploads")
	auth := r.Group("/auth")
	{
		auth.POST("/register", Register)
		auth.POST("/login", Login)
	}

	api := r.Group("/api")
	{

		user := api.Group("/user")
		{

			user.GET("/", middleware.RequireAuth, Auth)
			incidents := user.Group("/incidents")
			{
				incidents.POST("/report", ReportIncident)
			}
			chat := user.Group("/chat")
			{
				chat.GET("/", ChatHandler)
				chat.GET("/messages/:user_id", GetMessages)

			}

		}
		operator := api.Group("/operator")
		{
			users := operator.Group("/users")
			{
				users.GET("/", getUsers)
			}
			incidents := operator.Group("/incidents")
			{
				incidents.GET("/", GetIncidents)
				incidents.PATCH("/:id", UpdateIncidentStatus)
				incidents.GET("/:id", GetIncidentByID)
			}
		}
	}
}
