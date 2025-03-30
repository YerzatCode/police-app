import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./ChatOperator.css"; // Подключаем новый стиль

const ChatOperator = () => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/operator/users/")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Ошибка загрузки пользователей:", error));
  }, []);

  useEffect(() => {
    if (selectedUser) {
      axios
        .get(`http://localhost:8080/api/user/chat/messages/${selectedUser.ID}`)
        .then((response) => setMessages(response.data))
        .catch((error) => console.error("Ошибка загрузки сообщений:", error));

      if (ws.current) {
        ws.current.close();
      }

      const socket = new WebSocket(
        `ws://localhost:8080/api/user/chat/?user_id=operator`
      );
      ws.current = socket;

      socket.onopen = () => {
        console.log(`WebSocket соединение открыто для ${selectedUser.ID}`);
      };

      socket.onmessage = (event) => {
        try {
          const receivedMessage = JSON.parse(event.data);
          setMessages((prev) => [...prev, receivedMessage]);
        } catch (error) {
          console.error("Ошибка парсинга WebSocket-сообщения:", error);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket ошибка:", error);
      };

      socket.onclose = () => {
        console.log(`WebSocket соединение закрыто для ${selectedUser.ID}`);
      };
    }

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      console.error("WebSocket соединение не открыто");
      return;
    }

    if (message.trim() !== "" && selectedUser) {
      const newMessage = {
        sender_id: "operator",
        receiver_id: String(selectedUser.ID),
        text: message,
      };

      try {
        ws.current.send(JSON.stringify(newMessage));
        setMessages((prev) => [...prev, newMessage]);
        setMessage("");
      } catch (error) {
        console.error("Ошибка отправки сообщения:", error);
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="user-list">
        <h3>Пользователи</h3>
        <ul>
          {users.map((user) => (
            <li
              key={user.ID}
              className={selectedUser?.ID === user.ID ? "selected" : ""}
              onClick={() => setSelectedUser(user)}
            >
              {user.login}
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-box">
        {selectedUser ? (
          <>
            <h3>Чат с {selectedUser.login}</h3>
            <div className="messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${
                    msg.sender_id === "operator" ? "sent" : "received"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="message-input">
              <input
                type="text"
                placeholder="Введите сообщение..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button onClick={sendMessage}>▶</button>
            </div>
          </>
        ) : (
          <p>Выберите пользователя для начала чата</p>
        )}
      </div>
    </div>
  );
};

export default ChatOperator;
