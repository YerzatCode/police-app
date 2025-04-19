import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import useUser from "../Store/user";

const Login = () => {
  const navigate = useNavigation();
  const [loginValue, setLoginValue] = React.useState("");
  const [passwordValue, setPasswordValue] = React.useState("");
  const [isSecure, setIsSecure] = React.useState(true);
  const { login } = useUser((state) => state);

  const inputTheme = {
    colors: {
      primary: "#007AFF", // синий цвет активной рамки
      text: "#333333",
      placeholder: "#888888",
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ЛОГОТИП */}
      <Image
        source={require("../assets/police-badge.png")}
        style={styles.logo}
      />

      <Text style={styles.header}>Вход в систему</Text>

      {/* ФОРМА ВХОДА */}
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder="Введите логин"
          label="Логин"
          mode="outlined"
          onChangeText={setLoginValue}
          value={loginValue}
          theme={inputTheme}
        />
        <TextInput
          style={styles.input}
          placeholder="Введите пароль"
          label="Пароль"
          mode="outlined"
          onChangeText={setPasswordValue}
          value={passwordValue}
          secureTextEntry={isSecure}
          theme={inputTheme}
          right={
            <TextInput.Icon
              icon={isSecure ? "eye-off" : "eye"}
              onPress={() => setIsSecure(!isSecure)}
            />
          }
        />

        <Button
          style={styles.loginButton}
          mode="contained"
          onPress={() => login(loginValue, passwordValue)}
        >
          Войти
        </Button>

        {/* Разделительная линия */}
        <View style={styles.divider} />

        <Button
          onPress={() => navigate.navigate("Register")}
          labelStyle={styles.registerText}
        >
          Создать аккаунт
        </Button>
      </View>
    </SafeAreaView>
  );
};

// 🎨 СТИЛИ
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9", // светлый фон
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 20,
  },
  inputBox: {
    width: "85%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    marginBottom: 15,
    backgroundColor: "white", // белый фон инпутов
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#007AFF", // синий цвет кнопки
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#cccccc",
    marginVertical: 20,
  },
  registerText: {
    color: "#007AFF",
    fontSize: 16,
  },
});

export default Login;
