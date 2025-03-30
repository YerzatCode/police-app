import React, { useState } from "react";
import { View, Button, Image, ActivityIndicator, Alert } from "react-native";
import uploadImage from "../http/uploadImage.js"; // Импорт функции загрузки
import { API_URL } from "../Const/const.js";

const ImageUploader = ({ userId, setImage, image }) => {
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    setLoading(true);
    const uploadedUrl = await uploadImage(userId);
    setLoading(false);

    if (uploadedUrl) {
      setImageUri(uploadedUrl);
      setImage([...image, uploadedUrl]); // Добавляем URL в массив изображений
      Alert.alert("Успех!", "Фото успешно загружено.");
    } else {
      Alert.alert("Ошибка", "Не удалось загрузить фото.");
    }
  };

  return (
    <View style={{ alignItems: "center", marginTop: 20 }}>
      {image ? (
        <>
          {image?.map((img, index) => (
            <Image
              key={index}
              source={{ uri: API_URL + img }}
              style={{
                width: 200,
                height: 200,
                borderRadius: 10,
                marginTop: 10,
              }}
            />
          ))}
        </>
      ) : (
        <View
          style={{
            width: 200,
            height: 200,
            backgroundColor: "#eee",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button title="Сделать фото" onPress={handleUpload} />
        </View>
      )}

      {loading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ marginTop: 10 }}
        />
      )}

      {image && <Button title="Сделать другое фото" onPress={handleUpload} />}
    </View>
  );
};

export default ImageUploader;
