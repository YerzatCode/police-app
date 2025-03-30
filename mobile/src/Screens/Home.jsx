import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import FloatingButton from "../Components/FloatingButton";
import useUser from "../Store/user";

const Home = ({ navigation }) => {
  const { logout } = useUser((state) => state);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Панель управления</Text>

        <View style={styles.buttonContainer}>
          <Button
            onPress={() => navigation.navigate("Chat")}
            mode="contained"
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            Чат с оператором
          </Button>

          <Button
            onPress={() => navigation.navigate("Report")}
            mode="contained"
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            Сообщить о нарушении
          </Button>

          <Button
            onPress={() => navigation.navigate("Alerts")} // ✅ Новая кнопка
            mode="contained"
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            Уведомления о ЧС
          </Button>
          <Button
            onPress={() => navigation.navigate("Profile")}
            mode="contained"
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            Профиль
          </Button>
          <Button
            onPress={() => logout()}
            mode="contained"
            style={styles.logoutButton}
            labelStyle={styles.logoutText}
          >
            Выйти
          </Button>
        </View>
      </SafeAreaView>
      <FloatingButton />
    </>
  );
};

// 🎨 Стили
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1f2a",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 30,
  },
  buttonContainer: {
    width: "80%",
  },
  button: {
    backgroundColor: "#0056b3",
    marginBottom: 15,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
  },
  logoutButton: {
    backgroundColor: "#B00020",
    marginTop: 10,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 16,
    color: "white",
  },
});

export default Home;
