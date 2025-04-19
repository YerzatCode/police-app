import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Modal } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const Map = () => {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 43.222, // Центр Алматы
    longitude: 76.8512,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBooth, setSelectedBooth] = useState(null);

  // Координаты полицейских будок в Алматы с дополнительными данными
  const policeBooths = [
    {
      id: 1,
      latitude: 43.2223,
      longitude: 76.8515,
      title: "Police Booth 1",
      description: "Near the central market.",
      phone: "+7 727 123 45 67",
      address: "Almaty, Central Market, 12",
      hours: "24/7",
    },
    {
      id: 2,
      latitude: 43.223,
      longitude: 76.853,
      title: "Police Booth 2",
      description: "Near the city park.",
      phone: "+7 727 234 56 78",
      address: "Almaty, City Park, 3",
      hours: "24/7",
    },
    {
      id: 3,
      latitude: 43.2245,
      longitude: 76.854,
      title: "Police Booth 3",
      description: "Near the main square.",
      phone: "+7 727 345 67 89",
      address: "Almaty, Main Square, 5",
      hours: "24/7",
    },
    {
      id: 4,
      latitude: 43.225,
      longitude: 76.8555,
      title: "Police Booth 4",
      description: "Near the university.",
      phone: "+7 727 456 78 90",
      address: "Almaty, University, 8",
      hours: "8:00 AM - 6:00 PM",
    },
    {
      id: 5,
      latitude: 43.226,
      longitude: 76.8565,
      title: "Police Booth 5",
      description: "Near the subway station.",
      phone: "+7 727 567 89 01",
      address: "Almaty, Subway Station, 2",
      hours: "24/7",
    },
    {
      id: 6,
      latitude: 43.2275,
      longitude: 76.857,
      title: "Police Booth 6",
      description: "Near the main road.",
      phone: "+7 727 678 90 12",
      address: "Almaty, Main Road, 10",
      hours: "24/7",
    },
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied.");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    })();
  }, []);

  const centerMapOnLocation = async () => {
    if (location) {
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    } else {
      alert("Не удалось получить ваше местоположение.");
    }
  };

  const handleMarkerPress = (booth) => {
    setSelectedBooth(booth);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedBooth(null);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true} // Показываем текущее местоположение пользователя
        followUserLocation={true} // Следим за местоположением пользователя
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)} // Обновляем регион при изменении
      >
        {policeBooths.map((booth) => (
          <Marker
            key={booth.id}
            coordinate={{
              latitude: booth.latitude,
              longitude: booth.longitude,
            }}
            title={booth.title}
            description={booth.description}
            onPress={() => handleMarkerPress(booth)}
            pinColor="#e32f45" // Кастомный цвет маркера
          />
        ))}
      </MapView>

      <TouchableOpacity style={styles.button} onPress={centerMapOnLocation}>
        <Text style={styles.buttonText}>Мое местоположение</Text>
      </TouchableOpacity>

      {/* Модалка с информацией о будке */}
      {selectedBooth && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedBooth.title}</Text>
              <Text style={styles.modalDescription}>
                {selectedBooth.description}
              </Text>
              <Text style={styles.modalDetails}>
                Address: {selectedBooth.address}
              </Text>
              <Text style={styles.modalDetails}>
                Phone: {selectedBooth.phone}
              </Text>
              <Text style={styles.modalDetails}>
                Hours: {selectedBooth.hours}
              </Text>

              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Закрыть</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  button: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    padding: 12,
    backgroundColor: "#e32f45",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 300,
    maxHeight: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalDetails: {
    fontSize: 14,
    marginBottom: 5,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#e32f45",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Map;
