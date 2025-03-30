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
          outlineColor="#0056b3"
          theme={{ colors: { primary: "#0056b3" } }}
        />
        <TextInput
          style={styles.input}
          placeholder="Введите пароль"
          label="Пароль"
          mode="outlined"
          onChangeText={setPasswordValue}
          value={passwordValue}
          secureTextEntry={isSecure}
          outlineColor="#0056b3"
          theme={{ colors: { primary: "#0056b3" } }}
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
    backgroundColor: "#1c1f2a",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  inputBox: {
    width: "85%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    marginBottom: 15,
  },
  loginButton: {
    width: "100%",
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
  registerText: {
    color: "#d4bbff",
    fontSize: 16,
  },
});

export default Login;
