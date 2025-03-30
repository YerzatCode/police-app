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
      {/* Заголовок */}
      <Text variant="headlineMedium" style={styles.header}>
        Регистрация
      </Text>

      {/* Форма регистрации */}
      <View style={styles.form}>
        <TextInput
          label="Имя"
          value={data.first_name}
          onChangeText={(text) => handleChange("first_name", text)}
        />
        <TextInput
          label="Фамилия"
          value={data.last_name}
          onChangeText={(text) => handleChange("last_name", text)}
        />
        <TextInput
          label="Почта"
          value={data.email}
          keyboardType="email-address"
          onChangeText={(text) => handleChange("email", text)}
        />
        <TextInput
          label="ИИН"
          value={data.passport_id}
          keyboardType="numeric"
          maxLength={12}
          onChangeText={(text) => handleChange("passport_id", text)}
        />
        <TextInput
          label="Логин"
          value={data.login}
          onChangeText={(text) => handleChange("login", text)}
        />

        <TextInput
          label="Телефон"
          value={data.phone}
          keyboardType="phone-pad"
          maxLength={11}
          onChangeText={(text) => handleChange("phone", text)}
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
        />

        <Button
          mode="contained"
          style={styles.button}
          onPress={validateAndSubmit}
        >
          Регистрация
        </Button>

        <View style={styles.divider} />

        <Button onPress={() => navigate.navigate("Login")}>
          Есть аккаунт? Войти
        </Button>
      </View>
    </SafeAreaView>
  );
};

// 🎨 СТИЛИ
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1f2a",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#9279c8",
    marginBottom: 20,
  },
  form: {
    width: "100%",
    gap: 10,
  },
  button: {
    backgroundColor: "#0056b3",
    paddingVertical: 10,
    borderRadius: 5,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#d4bbff",
    marginVertical: 15,
  },
});

export default Register;
