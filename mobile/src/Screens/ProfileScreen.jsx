import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useUser from "../Store/user";

const Profile = ({ navigation }) => {
  const { user, logout } = useUser((state) => state);
  console.log(user);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={100} color="#333" />
        <Text style={styles.name}>
          {user?.fisrt_name} {user?.last_name}
        </Text>
        <Text style={styles.role}>
          {user?.role === "operator" ? "Оператор" : "Пользователь"}
        </Text>
      </View>

      <View style={styles.card}>
        <Info label="Фамилия" value={user?.last_name} />
        <Info label="Имя" value={user?.first_name} />
        <Info label="Логин" value={user?.login} />

        <Info label="Email" value={user?.email} />
        <Info label="Телефон" value={user?.phone} />
        <Info label="Паспорт" value={user?.passport_id} />
      </View>

      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Выйти</Text>
      </TouchableOpacity>
    </View>
  );
};

const Info = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || "—"}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7f9",
    padding: 20,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    marginTop: 8,
  },
  role: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  infoRow: {
    marginBottom: 16,
  },
  label: {
    color: "#888",
    fontSize: 13,
    marginBottom: 4,
  },
  value: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff5252",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  backLink: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
  },
  backText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 6,
  },
});

export default Profile;
