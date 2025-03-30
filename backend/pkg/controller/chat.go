package controller

import (
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/YerzatCode/ReportApp_backend/pkg/db"
	"github.com/YerzatCode/ReportApp_backend/pkg/models"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

// Структура соединения WebSocket
type Connection struct {
	UserID string
	Conn   *websocket.Conn
}

var (
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}

	connections = make(map[string]*Connection) // userID -> WebSocket connection
	mutex       = sync.Mutex{}                 // Для потокобезопасного доступа к соединениям
)

// WebSocket-обработчик для чата
func ChatHandler(c *gin.Context) {
	userID := c.Query("user_id") // Получаем ID пользователя из параметра запроса
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id is required"})
		return
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("Ошибка WebSocket соединения:", err)
		return
	}
	defer conn.Close()

	// Добавляем пользователя в список соединений
	mutex.Lock()
	fmt.Print(connections[userID])
	connections[userID] = &Connection{UserID: userID, Conn: conn}
	mutex.Unlock()
	log.Printf("Пользователь %s подключился", userID)

	// Отправка непрочитанных сообщений
	sendUnreadMessages(userID, conn)

	for {
		var msg models.Message
		err := conn.ReadJSON(&msg)
		if err != nil {
			log.Println("Ошибка чтения сообщения:", err)
			break
		}

		log.Printf("Получено сообщение от %s для %s: %s", msg.SenderID, msg.ReceiverID, msg.Text)

		// Сохраняем сообщение в базу данных
		saveMessageToDB(msg)

		// Отправляем сообщение получателю
		sendMessage(msg)
	}

	// Удаляем пользователя при отключении
	mutex.Lock()
	delete(connections, userID)
	mutex.Unlock()
	log.Printf("Пользователь %s отключился", userID)
}

// Функция отправки сообщения получателю
func sendMessage(msg models.Message) {
	mutex.Lock()
	receiverConn, exists := connections[msg.ReceiverID]
	mutex.Unlock()

	if exists {
		if err := receiverConn.Conn.WriteJSON(msg); err != nil {
			log.Println("Ошибка отправки сообщения:", err)
		}
	} else {
		log.Printf("Пользователь %s не в сети. Сообщение сохранено.", msg.ReceiverID)
	}
}

// Функция сохранения сообщения в БД
func saveMessageToDB(msg models.Message) {
	msg.IsRead = false // Сообщение по умолчанию непрочитанное
	db.DB.Create(&msg)
}

// Отправка непрочитанных сообщений при подключении
func sendUnreadMessages(userID string, conn *websocket.Conn) {
	var messages []models.Message
	db.DB.Where("receiver_id = ? AND is_read = ?", userID, false).Find(&messages)

	for _, msg := range messages {
		conn.WriteJSON(msg)
		db.DB.Model(&msg).Update("is_read", true) // Отмечаем как прочитанное
	}
}

// Получение сообщений пользователя (REST API)
func GetMessages(c *gin.Context) {
	userID := c.Param("user_id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id is required"})
		return
	}

	var messages []models.Message
	if err := db.DB.Where("sender_id = ? OR receiver_id = ?", userID, userID).Find(&messages).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при получении сообщений"})
		return
	}

	c.JSON(http.StatusOK, messages)
}
