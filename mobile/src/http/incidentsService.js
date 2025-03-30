import axios from "axios";
import { API_URL } from "../Const/const";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 📍 Функция отправки инцидента с изображениями (base64)
const createIncident = async (incidentData, imagesBase64) => {
  try {
    const token = await AsyncStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}api/user/incidents/report`,
      {
        ...incidentData,
        images: imagesBase64, // Отправляем массив base64-изображений
      },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || "Ошибка при создании инцидента";
  }
};

export default { createIncident };
