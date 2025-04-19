import React, { useState } from "react";
import {
  View,
  Button,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker"; // Для выбора изображения
import uploadImage from "../http/uploadImage.js"; // Импорт функции загрузки
import { API_URL } from "../Const/const.js";
import { Ionicons } from "@expo/vector-icons"; // Для иконки камеры

const ImageUploader = ({ userId, setImage, image }) => {
  const [loading, setLoading] = useState(false);

  // Функция для открытия галереи
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Ошибка",
        "Необходимо предоставить доступ к библиотеке изображений."
      );
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.cancelled) {
      handleUpload(pickerResult.uri);
    }
  };

  // Функция для загрузки изображения
  const handleUpload = async (uri) => {
    setLoading(true);
    try {
      const uploadedUrl = await uploadImage(userId, uri);
      if (uploadedUrl) {
        setImage((prevImages) => [...prevImages, uploadedUrl]); // Добавляем новый URL изображения
        Alert.alert("Успех!", "Фото успешно загружено.");
      } else {
        Alert.alert("Ошибка", "Не удалось загрузить фото.");
      }
    } catch (error) {
      Alert.alert("Ошибка", "Произошла ошибка при загрузке фото.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Функция для удаления изображения
  const handleDelete = (imageUri) => {
    setImage((prevImages) => prevImages.filter((img) => img !== imageUri)); // Удаляем изображение по URL
    Alert.alert("Успех!", "Фото удалено.");
  };

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        {image && image.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {image.map((img, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: API_URL + img }} style={styles.image} />
                {/* Кнопка удаления изображения */}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(img)}
                >
                  <Ionicons name="trash" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyImageContainer}>
            <Text style={styles.emptyText}>Нет изображений</Text>
          </View>
        )}
      </View>

      {/* Кнопка "Сделать фото" */}
      {!loading && (
        <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
          <Ionicons name="camera" size={30} color="#fff" />
          <Text style={styles.buttonText}>Сделать фото</Text>
        </TouchableOpacity>
      )}

      {loading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loadingIndicator}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    width: "100%",
    paddingHorizontal: 15,
  },
  carouselContainer: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    width: "100%", // Чтобы карусель занимала весь экран по ширине
  },
  imageWrapper: {
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: "relative", // Для кнопки удаления
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#ff4d4d",
    padding: 5,
    borderRadius: 50,
  },
  emptyImageContainer: {
    width: 200,
    height: 200,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 20,
  },
  emptyText: {
    marginBottom: 10,
    fontSize: 16,
    color: "#555",
  },
  loadingIndicator: {
    marginTop: 10,
  },
  photoButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "50%", // Центрируем по вертикали
    left: "50%", // Центрируем по горизонтали
    transform: [{ translateX: -80 }, { translateY: -30 }], // Откорректируем для идеального центрирования
    zIndex: 1,
  },
  buttonText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
  },
});

export default ImageUploader;
