import axios from "axios";
import { API_URL } from "../Const/const";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

const Login = async (login, password) => {
  try {
    const response = await axios.post(API_URL + "auth/login", {
      login,
      password,
    });
    const token = response.data.token;

    await AsyncStorage.setItem("token", token); // Сохраняем токен в AsyncStorage

    return token;
  } catch (error) {
    throw error.response?.data || "Ошибка авторизации";
  }
};
const Register = async (data) => {
  // const navigate = useNavigation();

  try {
    await axios.post(API_URL + "auth/register", data);
    // navigate.navigate("Login");
    Alert.alert("Успешна создань");
    return "Успешна создань";
  } catch (error) {
    throw error.response?.data || "Ошибка регистраций";
  }
};

const CheckAuth = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    console.log(token);

    const response = await axios.get(`${API_URL}api/user/`, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    // await AsyncStorage.removeItem("token");
    console.log(error);
    throw error?.response?.data || "Не исправен токен";
  }
};

const Logout = async () => {
  await AsyncStorage.removeItem("token");
};
export default { Login, CheckAuth, Logout, Register };
