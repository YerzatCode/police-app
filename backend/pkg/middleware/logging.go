package middleware

import (
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

// LoggingMiddleware логирует каждый запрос
func LoggingMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Время начала обработки запроса
		start := time.Now()

		// Обработка запроса
		c.Next()

		// Время окончания обработки запроса
		duration := time.Since(start)

		// Логируем информацию о запросе
		log.Printf("Method: %s, Path: %s, Status: %d, Duration: %s",
			c.Request.Method, c.Request.URL.Path, c.Writer.Status(), duration)
	}
}
