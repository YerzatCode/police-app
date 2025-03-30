import React, { useEffect, useState, useRef } from "react";
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useUser from "../Store/user";
import axios from "axios";
import { IP } from "../Const/const";
import { LinearGradient } from "expo-linear-gradient";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showScrollToBottom, setShowScrollToBottom] = useState(false); // 🔹 Отслеживание прокрутки
  const ws = useRef(null);
  const flatListRef = useRef(null);
  const { user } = useUser((state) => state);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://${IP}:8080/api/user/chat/messages/${user?.ID}`
        );
        setMessages(response.data);
        setTimeout(
          () => flatListRef.current?.scrollToEnd({ animated: false }),
          100
        );
      } catch (error) {
        console.error("Ошибка загрузки сообщений:", error);
      }
    };

    fetchMessages();

    ws.current = new WebSocket(
      `ws://${IP}:8080/api/user/chat/?user_id=${user?.ID}`
    );

    ws.current.onopen = () => console.log("WebSocket соединение установлено");

    ws.current.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      setMessages((prev) => [...prev, receivedMessage]);

      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        100
      );
    };

    ws.current.onerror = (error) => console.error("WebSocket error:", error);
    ws.current.onclose = () => console.log("WebSocket соединение закрыто");

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [user.ID]);

  const sendMessage = () => {
    if (message.trim() !== "" && ws.current?.readyState === WebSocket.OPEN) {
      const newMessage = {
        sender_id: String(user.ID),
        receiver_id: "operator",
        text: message,
      };
      ws.current.send(JSON.stringify(newMessage));
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");

      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        100
      );
    }
  };

  // 🔹 Отслеживание прокрутки
  const handleScroll = (event) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const isNearBottom =
      contentOffset.y + layoutMeasurement.height >= contentSize.height - 50;
    setShowScrollToBottom(!isNearBottom);
  };

  return (
    <LinearGradient colors={["#1c1f2a", "#2d3548"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flexContainer}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.messageList}
          onScroll={handleScroll} // 🔹 Добавлено
          scrollEventThrottle={100}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.sender_id === String(user.ID)
                  ? styles.sent
                  : styles.received,
              ]}
            >
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
        />

        {/* 🔹 Кнопка "Вниз" */}
        {showScrollToBottom && (
          <TouchableOpacity
            style={styles.scrollToBottom}
            onPress={() => flatListRef.current?.scrollToEnd({ animated: true })}
          >
            <Ionicons name="arrow-down" size={28} color="white" />
          </TouchableOpacity>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Введите сообщение..."
            placeholderTextColor="#bbb"
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

// 🎨 Улучшенные стили
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  messageList: {
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    marginBottom: 8,
    maxWidth: "75%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  sent: {
    alignSelf: "flex-end",
    backgroundColor: "#0056b3",
    borderTopRightRadius: 5,
  },
  received: {
    alignSelf: "flex-start",
    backgroundColor: "#37414f",
    borderTopLeftRadius: 5,
  },
  messageText: {
    color: "white",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#1c1f2a",
    borderTopWidth: 1,
    borderColor: "#444b5b",
  },
  input: {
    flex: 1,
    height: 45,
    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: "#2d3548",
    color: "white",
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#0056b3",
    padding: 12,
    borderRadius: 25,
  },
  // 🔹 Стиль для кнопки "Вниз"
  scrollToBottom: {
    position: "absolute",
    bottom: 70,
    right: 20,
    backgroundColor: "#0056b3",
    padding: 12,
    borderRadius: 25,
    elevation: 5,
  },
});

export default Chat;
