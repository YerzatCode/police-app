import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import userService from "../http/userService";

const Register = () => {
  const [isSecure, setIsSecure] = useState(true);
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    passport_id: "",
    login: "",
    password: "",
  });
  const navigate = useNavigation();

  const handleChange = (field, value) => {
    setData((prevData) => ({ ...prevData, [field]: value }));
  };

  const validateAndSubmit = () => {
    if (
      !data.first_name ||
      !data.last_name ||
      !data.email ||
      !data.login ||
      !data.password
    ) {
      Alert.alert("Ошибка", "Все поля обязательны!");
      return;
    }
    if (data.passport_id.length !== 12) {
      Alert.alert("Ошибка", "ИИН должен содержать 12 цифр!");
      return;
    }
    if (!/^\d+$/.test(data.phone)) {
      Alert.alert("Ошибка", "Номер телефона должен содержать только цифры!");
      return;
    }

    userService.Register(data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>
        Регистрация
      </Text>

      <View style={styles.form}>
        <TextInput
          label="Имя"
          value={data.first_name}
          onChangeText={(text) => handleChange("first_name", text)}
          mode="outlined"
        />
        <TextInput
          label="Фамилия"
          value={data.last_name}
          onChangeText={(text) => handleChange("last_name", text)}
          mode="outlined"
        />
        <TextInput
          label="Почта"
          value={data.email}
          keyboardType="email-address"
          onChangeText={(text) => handleChange("email", text)}
          mode="outlined"
        />
        <TextInput
          label="ИИН"
          value={data.passport_id}
          keyboardType="numeric"
          maxLength={12}
          onChangeText={(text) => handleChange("passport_id", text)}
          mode="outlined"
        />
        <TextInput
          label="Логин"
          value={data.login}
          onChangeText={(text) => handleChange("login", text)}
          mode="outlined"
        />
        <TextInput
          label="Телефон"
          value={data.phone}
          keyboardType="phone-pad"
          maxLength={11}
          onChangeText={(text) => handleChange("phone", text)}
          mode="outlined"
        />
        <TextInput
          label="Пароль"
          secureTextEntry={isSecure}
          value={data.password}
          onChangeText={(text) => handleChange("password", text)}
          right={
            <TextInput.Icon
              icon={!isSecure ? "eye-off" : "eye"}
              onPress={() => setIsSecure(!isSecure)}
            />
          }
          mode="outlined"
        />

        <Button
          mode="contained"
          style={styles.button}
          onPress={validateAndSubmit}
        >
          Регистрация
        </Button>

        <View style={styles.divider} />

        <Button
          mode="text"
          onPress={() => navigate.navigate("Login")}
          labelStyle={{ color: "#5c5c5c" }}
        >
          Есть аккаунт? Войти
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5", // Светлый фон
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 20,
  },
  form: {
    width: "100%",
    gap: 10,
  },
  button: {
    backgroundColor: "#4a90e2",
    paddingVertical: 10,
    borderRadius: 5,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#cccccc",
    marginVertical: 15,
  },
});

export default Register;
