import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons"; // Импорт иконок

const NewsScreen = ({ route, navigation }) => {
  const { city, language } = route.params;
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const newsApiKey = "0460fdb9e9504c0cbcde761f417e629d";

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("https://newsapi.org/v2/everything", {
          params: {
            q: city,
            apiKey: newsApiKey,
            language: language,
            pageSize: 10,
          },
        });
        setNews(response.data.articles);
      } catch (error) {
        console.error("Ошибка загрузки новостей:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [city, language]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Верхняя панель с кнопкой "Назад" и заголовком */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Последние новости о {city}</Text>
      </View>

      {/* Индикатор загрузки или новости */}
      {loading ? (
        <ActivityIndicator size="large" color="#4a90e2" />
      ) : (
        news.map((article, index) => (
          <View key={index} style={styles.newsCard}>
            <Image
              source={{
                uri: article.urlToImage || "https://via.placeholder.com/300",
              }}
              style={styles.newsImage}
            />
            <View style={styles.newsContent}>
              <Text style={styles.newsTitle}>{article.title}</Text>
              <Text style={styles.newsDescription}>{article.description}</Text>
              <TouchableOpacity
                style={styles.readMoreButton}
                onPress={() => {
                  navigation.navigate("NewsDetail", { article });
                }}
              >
                <Text style={styles.readMoreText}>Читать далее</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f0f2f5",
  },
  header: {
    flexDirection: "row", // Расположить элементы по горизонтали
    alignItems: "center", // Выравнивание элементов по вертикали
    marginBottom: 20, // Отступ от нижней части
  },
  backButton: {
    backgroundColor: "#4a90e2",
    borderRadius: 50,
    padding: 10,
    marginRight: 16, // Отступ справа от кнопки
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    flex: 1, // Заголовок займет оставшееся пространство
  },
  newsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    overflow: "hidden",
  },
  newsImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: "cover",
  },
  newsContent: {
    padding: 15,
  },
  newsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  newsDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  readMoreButton: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#4a90e2",
    borderRadius: 8,
  },
  readMoreText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default NewsScreen;
