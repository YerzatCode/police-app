import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import * as Location from "expo-location";
import useUser from "../Store/user";

const tipsList = [
  "Зарядите телефон",
  "Проверьте аптечку",
  "Скачайте офлайн-карту",
  "Сохраните номера экстренных служб",
  "Подготовьте запас воды и еды",
  "Оповестите близких о вашем местонахождении",
  "Проверьте тревожный чемоданчик",
  "Скачайте наше приложение на все устройства",
  "Изучите ближайшие укрытия",
];

const getRandomTips = (count = 3) => {
  const shuffled = [...tipsList].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const Home = ({ navigation }) => {
  const { first_name: userName } = useUser((state) => state.user);
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("en");
  const [tips, setTips] = useState(getRandomTips());
  const [isExpanded, setIsExpanded] = useState(false); // Для управления состоянием баннера
  const [showBanner, setShowBanner] = useState(false); // Для управления видимостью баннера

  const newsApiKey = "0460fdb9e9504c0cbcde761f417e629d";
  const geocodeApiKey = "dcf815a052bc4462957adf047abb72b5";

  // Анимация для свечения кнопки SOS
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Запуск анимации свечения
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();

    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Ошибка", "Разрешение на геолокацию отклонено.");
        setLoading(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      fetchCity(loc.coords.latitude, loc.coords.longitude);
    } catch (error) {
      console.error("Ошибка получения местоположения:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCity = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json`,
        {
          params: {
            key: geocodeApiKey,
            q: `${lat},${lng}`,
          },
        }
      );

      const city = response.data.results[0]?.components.city;
      const country = response.data.results[0]?.components.country;

      if (city) {
        setCity(city);
        setLanguage(getLanguageFromCountry(country));
      } else {
        setCity("Неизвестный город");
        setLanguage("en");
      }
    } catch (error) {
      console.error("Ошибка получения города:", error);
    }
  };

  const getLanguageFromCountry = (country) => {
    const map = {
      Kazakhstan: "kk",
      Russia: "ru",
      "United States": "en",
    };
    return map[country] || "en";
  };

  // Функция для переключения состояния баннера
  const toggleBanner = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.greeting}>Добро пожаловать, {userName} 👋</Text>

        {/* SOS */}
        <Animated.View
          style={[
            styles.sosBlock,
            {
              shadowOpacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.9],
              }),
              shadowRadius: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [10, 25],
              }),
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Report")}
            style={{ alignItems: "center" }}
          >
            <Ionicons name="warning" size={60} color="#fff" />
            <Text style={styles.sosText}>НАЖМИ ЕСЛИ ЧС</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Статус */}
        <View style={styles.statusBlock}>
          <Text style={styles.statusTitle}>Уровень угрозы: 🟢 Низкий</Text>
          <Text style={styles.statusDescription}>
            Обстановка в регионе спокойная. Следите за обновлениями.
          </Text>
        </View>

        {/* Новости и локация */}
        <View style={styles.newsLocation}>
          <View style={styles.newsCard}>
            <Text style={styles.cardTitle}>📰 Новости</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("News", { city, language })}
            >
              <Text style={styles.cardAction}>Читать актуальное →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.locationCard}>
            <Text style={styles.cardTitle}>📍 Местоположение</Text>
            <Text style={styles.cardContent}>
              {loading ? "Загрузка..." : city || "Неизвестно"}
            </Text>
          </View>
        </View>

        {/* Советы */}
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Советы на сегодня</Text>
          {tips.map((tip, index) => (
            <Text key={index} style={styles.tipText}>
              — {tip}
            </Text>
          ))}
        </View>

        {/* Интерактивный баннер внизу */}
        <View style={styles.bottomInteractive}>
          <TouchableOpacity style={styles.bannerToggle} onPress={toggleBanner}>
            <Text style={styles.bannerToggleText}>
              {isExpanded ? "Свернуть информацию" : "Развернуть информацию"}
            </Text>
          </TouchableOpacity>

          {isExpanded && (
            <View style={styles.expandedContent}>
              <Text style={styles.expandedText}>
                Это дополнительная информация, которая может быть полезна в
                случае ЧС или других ситуаций. Сюда можно добавить любой контент
                или действия, которые пользователю будут интересны.
              </Text>
              <TouchableOpacity
                onPress={() => alert("Действие 1")}
                style={styles.interactiveButton}
              >
                <Text style={styles.interactiveButtonText}>Действие 1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => alert("Действие 2")}
                style={styles.interactiveButton}
              >
                <Text style={styles.interactiveButtonText}>Действие 2</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  scroll: {
    padding: 24,
  },
  greeting: {
    fontSize: 24,
    color: "#222",
    fontWeight: "600",
    marginBottom: 20,
  },
  sosBlock: {
    backgroundColor: "#ff3b30",
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: "#ff3b30",
    shadowOffset: { width: 0, height: 0 },
    elevation: 20,
  },
  sosText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  statusBlock: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    borderColor: "#e0e0e0",
    borderWidth: 1,
  },
  statusTitle: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  statusDescription: {
    color: "#555",
    fontSize: 14,
  },
  newsLocation: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
  },
  newsCard: {
    backgroundColor: "#ffffff",
    flex: 1,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  locationCard: {
    backgroundColor: "#ffffff",
    flex: 1,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cardTitle: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  cardAction: {
    color: "#007aff",
    marginTop: 6,
  },
  cardContent: {
    color: "#333",
    fontSize: 14,
  },
  tipCard: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  tipTitle: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  tipText: {
    color: "#444",
    fontSize: 14,
    lineHeight: 22,
  },
  bottomInteractive: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  bannerToggle: {
    alignItems: "center",
    marginBottom: 10,
  },
  bannerToggleText: {
    color: "#007aff",
    fontSize: 16,
    fontWeight: "bold",
  },
  expandedContent: {
    marginTop: 10,
  },
  expandedText: {
    color: "#333",
    fontSize: 14,
    marginBottom: 12,
  },
  interactiveButton: {
    backgroundColor: "#007aff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  interactiveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default Home;
