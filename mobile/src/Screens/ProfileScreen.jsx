import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import useUser from "../Store/user";

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useUser((state) => state);

  return (
    <LinearGradient colors={["#1c1f2a", "#2d3548"]} style={styles.container}>
      <View style={styles.profileContainer}>
        <Ionicons
          name="person-circle"
          size={100}
          color="#fff"
          style={styles.icon}
        />

        <Text style={styles.name}>
          {user?.fisrt_name} {user?.last_name}
        </Text>
        <Text style={styles.role}>
          Роль: {user?.role === "operator" ? "Оператор" : "Пользователь"}
        </Text>

        <View style={styles.infoContainer}>
          <InfoItem label="📧 Email" value={user?.email} />
          <InfoItem label="📞 Телефон" value={user?.phone} />
          <InfoItem label="🆔 Паспорт" value={user?.passport_id} />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={() => logout()}>
          <Ionicons name="log-out-outline" size={20} color="white" />
          <Text style={styles.logoutText}>Выйти</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="white" />
          <Text style={styles.backText}>Назад</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

// 🔹 Компонент информации
const InfoItem = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  profileContainer: {
    alignItems: "center",
  },
  icon: {
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  role: {
    fontSize: 16,
    color: "#bbb",
    marginBottom: 20,
  },
  infoContainer: {
    width: "100%",
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#444b5b",
  },
  label: {
    color: "#bbb",
    fontSize: 16,
  },
  value: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#b30000",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  backButton: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "#bbb",
    fontSize: 16,
    marginLeft: 10,
  },
});

export default ProfileScreen;
