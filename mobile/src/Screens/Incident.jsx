import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  View,
  StyleSheet,
} from "react-native";
import axios from "axios";
import ImageUploader from "./ImageUploader";
import useUser from "../Store/user";
import { API_URL } from "../Const/const";
import * as Location from "expo-location";

const IncidentScreen = () => {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [imageUrls, setImageUrls] = useState([]);

  const user = useUser((state) => state.user);

  const handleSubmit = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Ошибка", "Разрешение на геолокацию отклонено.");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    try {
      const res = {
        user_id: user.ID,
        title,
        description,
        images: JSON.stringify(imageUrls),
        latitude,
        longitude,
      };

      await axios.post(API_URL + "api/user/incidents/report", res);

      Alert.alert("Успех", "Инцидент успешно отправлен!");
      setTitle("");
      setDescription("");
      setImageUrls([]);
    } catch (error) {
      console.error(
        "Ошибка отправки инцидента:",
        error.response?.data || error
      );
      Alert.alert("Ошибка", "Не удалось отправить инцидент.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Сообщить об инциденте</Text>
          <Text style={styles.subtitle}>{user.email}</Text>

          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Заголовок инцидента"
            placeholderTextColor="#aaa"
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Описание инцидента"
            placeholderTextColor="#aaa"
            multiline
          />

          <Text style={styles.label}>Фото инцидента:</Text>
          <ImageUploader
            userId={user.ID}
            image={imageUrls}
            setImage={setImageUrls}
          />

          {imageUrls.length > 0 && (
            <Text style={styles.imageCount}>
              Добавлено фото: {imageUrls.length}
            </Text>
          )}

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>📩 Отправить</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b2838", // Тёмно-синий фон
  },
  scrollContainer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#2c3e50", // Глубокий серый
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    backgroundColor: "#34495e",
    padding: 12,
    borderRadius: 5,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#576574",
    color: "#fff",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  label: {
    fontSize: 16,
    color: "#ddd",
    marginBottom: 5,
    fontWeight: "600",
  },
  imageCount: {
    marginTop: 10,
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#e74c3c", // Красный для важности
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default IncidentScreen;
