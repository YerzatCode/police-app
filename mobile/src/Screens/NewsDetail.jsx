import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  TouchableOpacity,
} from "react-native";

const NewsDetail = ({ route, navigation }) => {
  const { article } = route.params; // Получаем статью из маршрута

  const handleReadFullArticle = () => {
    Linking.openURL(article.url);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Верхняя панель с кнопкой "Назад" и заголовком */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()} // Возвращаемся на предыдущий экран
        >
          <Text style={styles.backText}>Назад</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Детали новости</Text>
      </View>

      {/* Основное содержимое новости */}
      <Text style={styles.title}>{article.title}</Text>
      <Image
        source={{
          uri: article.urlToImage || "https://via.placeholder.com/300",
        }}
        style={styles.newsImage}
      />
      <Text style={styles.newsContent}>{article.content}</Text>
      <TouchableOpacity
        style={styles.readFullButton}
        onPress={handleReadFullArticle}
      >
        <Text style={styles.readFullText}>Читать полный текст</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f4f6f8",
  },
  header: {
    flexDirection: "row", // Расположить элементы по горизонтали
    alignItems: "center", // Выравнивание по вертикали
    marginBottom: 20, // Отступ снизу
  },
  backButton: {
    padding: 10,
    marginRight: 16, // Отступ от кнопки к заголовку
  },
  backText: {
    color: "#4a90e2",
    fontSize: 18,
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    flex: 1, // Заголовок займет оставшееся пространство
  },
  newsImage: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: "cover",
  },
  newsContent: {
    fontSize: 16,
    color: "#444",
    marginBottom: 20,
  },
  readFullButton: {
    padding: 12,
    backgroundColor: "#4a90e2",
    borderRadius: 8,
    alignItems: "center",
  },
  readFullText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default NewsDetail;
