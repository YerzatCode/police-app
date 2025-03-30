import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";

const callEmergency = () => {
  const emergencyNumber = "112"; // 📌 Можно заменить на 911 или другой номер

  Linking.openURL(`tel:${emergencyNumber}`).catch(() =>
    Alert.alert("Ошибка", "Не удалось открыть телефонное приложение")
  );
};

const FloatingButton = () => {
  return (
    <TouchableOpacity style={styles.fab} onPress={callEmergency}>
      <Text style={styles.fabText}>📞</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#D32F2F", // 🔴 Красный цвет для экстренности
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5, // Тень для Android
  },
  fabText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default FloatingButton;
