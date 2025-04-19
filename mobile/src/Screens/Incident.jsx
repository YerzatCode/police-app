import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  View,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import ImageUploader from "./ImageUploader";
import useUser from "../Store/user";
import { API_URL } from "../Const/const";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

const Incident = () => {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  const user = useUser((state) => state.user);

  // Получение геолокации
  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Ошибка", "Разрешение на геолокацию отклонено.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    };
    getLocation();
  }, []);

  // Обработка отправки инцидента
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const res = {
        user_id: user.ID,
        title,
        description,
        images: JSON.stringify(imageUrls),
        latitude: location?.latitude,
        longitude: location?.longitude,
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Сообщить об инциденте</Text>
        <Text style={styles.subtitle}>{user.email}</Text>

        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Заголовок инцидента"
          placeholderTextColor="#B0B0B0"
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Описание инцидента"
          placeholderTextColor="#B0B0B0"
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

        <Animated.View style={{ opacity: fadeAnim }}>
          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>📩 Отправить</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        {location && (
          <View style={styles.mapContainer}>
            <Text style={styles.label}>Ваше местоположение:</Text>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              showsUserLocation={true}
              onRegionChangeComplete={(region) => {
                setLocation({
                  latitude: region.latitude,
                  longitude: region.longitude,
                });
              }}
            >
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title="Вы здесь"
                description="Местоположение инцидента"
              >
                <View style={styles.customMarker}>
                  <Text style={{ color: "#fff" }}>📍</Text>
                </View>
              </Marker>
            </MapView>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  scrollContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 14,
    color: "#7F8C8D",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#BDC3C7",
    color: "#34495E",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  label: {
    fontSize: 16,
    color: "#34495E",
    marginBottom: 10,
    fontWeight: "500",
  },
  imageCount: {
    marginTop: 8,
    fontSize: 14,
    color: "#34495E",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#3498db",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 30,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  buttonDisabled: {
    backgroundColor: "#BDC3C7",
  },
  mapContainer: {
    marginTop: 30,
    width: "100%",
    height: 300, // Увеличена высота карты
    overflow: "hidden",
    textAlign: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  customMarker: {
    backgroundColor: "#3498db", // Цвет маркера
    padding: 8,
    borderRadius: 50, // Круглый маркер
    borderWidth: 3,
    borderColor: "#fff", // Белая рамка вокруг маркера
  },
});

export default Incident;
