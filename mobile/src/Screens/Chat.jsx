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

const Chat = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
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

  const handleScroll = (event) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const isNearBottom =
      contentOffset.y + layoutMeasurement.height >= contentSize.height - 50;
    setShowScrollToBottom(!isNearBottom);
  };

  return (
    <View style={styles.container}>
      {/* Новый светлый Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Чат с поддержкой</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.messageList}
          onScroll={handleScroll}
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
            placeholderTextColor="#888"
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  flexContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    backgroundColor: "white",
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  headerText: {
    fontSize: 20,
    color: "#333",
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 20,
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
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sent: {
    alignSelf: "flex-end",
    backgroundColor: "#3478f6", // 🔵 более яркий синий
    borderTopRightRadius: 5,
  },
  received: {
    alignSelf: "flex-start",
    backgroundColor: "#4a5568", // 🔵 серо-синий посветлее
    borderTopLeftRadius: 5,
  },

  messageText: {
    color: "#f5f5f5", // 🔥 более яркий белый
    fontSize: 16,
    fontWeight: "500", // 🔥 сделаем чуть жирнее
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderTopColor: "#ddd",
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    height: 45,
    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: "#f0f2f5",
    color: "#333",
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#4f93e6",
    padding: 12,
    borderRadius: 25,
  },
  scrollToBottom: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#4f93e6",
    padding: 12,
    borderRadius: 25,
    elevation: 5,
  },
});

export default Chat;
