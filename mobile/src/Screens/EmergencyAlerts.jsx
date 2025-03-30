import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  PermissionsAndroid,
  Alert,
  Platform,
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import MapView, { Marker } from "react-native-maps";
import PushNotification from "react-native-push-notification";
import axios from "axios";

// Функция вычисления расстояния (формула Хаверсина)
const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Радиус Земли в км
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const EmergencyAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [nearestAlert, setNearestAlert] = useState(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getUserLocation();
        } else {
          Alert.alert("Ошибка", "Разрешение на геолокацию не получено.");
          setLoading(false);
        }
      } catch (err) {
        console.warn("Ошибка запроса разрешений:", err);
        setLoading(false);
      }
    } else {
      getUserLocation();
    }
  };

  const getUserLocation = async () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        fetchAlerts(latitude, longitude);
      },
      (error) => {
        console.error("Ошибка получения геолокации:", error);
        Alert.alert("Ошибка", "Не удалось определить местоположение.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const fetchAlerts = async (latitude, longitude) => {
    try {
      const earthquakeResponse = await axios.get(
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
      );

      const otherDisastersResponse = await axios.get(
        "https://api.weather.gov/alerts/active"
      );

      const earthquakes = earthquakeResponse.data.features.map((item) => ({
        id: item.id,
        title: item.properties.place,
        type: "Землетрясение",
        magnitude: item.properties.mag,
        time: new Date(item.properties.time).toLocaleString(),
        latitude: item.geometry.coordinates[1],
        longitude: item.geometry.coordinates[0],
        distance: haversine(
          latitude,
          longitude,
          item.geometry.coordinates[1],
          item.geometry.coordinates[0]
        ),
      }));

      const otherDisasters = otherDisastersResponse.data.features
        .map((item) => ({
          id: item.id,
          title: item.properties.headline,
          type: item.properties.event,
          time: new Date(item.properties.effective).toLocaleString(),
          latitude: item.geometry ? item.geometry.coordinates[1] : null,
          longitude: item.geometry ? item.geometry.coordinates[0] : null,
          distance: item.geometry
            ? haversine(
                latitude,
                longitude,
                item.geometry.coordinates[1],
                item.geometry.coordinates[0]
              )
            : null,
        }))
        .filter((alert) => alert.latitude && alert.longitude);

      const allAlerts = [...earthquakes, ...otherDisasters];
      setAlerts(allAlerts);
      findNearestAlert(allAlerts);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    } finally {
      setLoading(false);
    }
  };

  const findNearestAlert = (alerts) => {
    if (alerts.length === 0) return;

    let nearest = alerts.reduce((prev, curr) =>
      prev.distance < curr.distance ? prev : curr
    );

    setNearestAlert(nearest);

    if (nearest.distance < 50) {
      PushNotification.localNotification({
        title: "⚠️ Опасность рядом!",
        message: `${nearest.type} - ${
          nearest.title
        } (${nearest.distance.toFixed(2)} км от вас)`,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>⚠️ Чрезвычайные уведомления</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#e74c3c" />
      ) : userLocation ? (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: 5,
              longitudeDelta: 5,
            }}
          >
            <Marker
              coordinate={userLocation}
              title="Вы здесь"
              pinColor="blue"
            />
            {alerts.map((alert) => (
              <Marker
                key={alert.id}
                coordinate={{
                  latitude: alert.latitude,
                  longitude: alert.longitude,
                }}
                title={alert.title}
                description={alert.type}
                pinColor="red"
              />
            ))}
          </MapView>

          {nearestAlert && (
            <View style={styles.card}>
              <Text style={styles.title}>🔴 Ближайшее ЧС</Text>
              <Text style={styles.alertTitle}>{nearestAlert.title}</Text>
              <Text style={styles.alertDate}>{nearestAlert.time}</Text>
              <Text style={styles.alertDistance}>
                📏 {nearestAlert.distance.toFixed(2)} км от вас
              </Text>
            </View>
          )}

          <FlatList
            data={alerts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.alertTitle}>{item.title}</Text>
                <Text style={styles.alertDate}>{item.time}</Text>
                <Text style={styles.alertDistance}>
                  📏 {item.distance.toFixed(2)} км от вас
                </Text>
              </View>
            )}
          />
        </>
      ) : (
        <Text style={styles.errorText}>Не удалось получить координаты.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b2838",
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 15,
  },
  map: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#2c3e50",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e74c3c",
    marginBottom: 5,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  alertDate: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 5,
  },
  alertDistance: {
    fontSize: 14,
    color: "#ddd",
  },
  errorText: {
    color: "#e74c3c",
    textAlign: "center",
    marginTop: 20,
  },
});

export default EmergencyAlerts;
