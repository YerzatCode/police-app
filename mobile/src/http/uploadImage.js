import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { API_URL } from "../Const/const";

const uploadImage = async (userId) => {
  let result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    quality: 1,
  });

  if (result.canceled) return null;

  let localUri = result.assets[0].uri;
  let filename = localUri.split("/").pop();
  let formData = new FormData();

  formData.append("image", {
    uri: localUri,
    name: filename,
    type: "image/jpeg",
  });

  formData.append("user_id", userId);

  try {
    const response = await axios.post(`${API_URL}upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.image_url; // Возвращаем URL
  } catch (error) {
    return null;
  }
};

export default uploadImage;
