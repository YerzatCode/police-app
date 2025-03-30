import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./src/Screens/Home";
import Chat from "./src/Screens/Chat";
import React, { useEffect } from "react";
import Login from "./src/Screens/Login";
import Register from "./src/Screens/Register";
import useUser from "./src/Store/user";
import { ActivityIndicator, View } from "react-native";
import IncidentScreen from "./src/Screens/Incident";
import EmergencyAlerts from "./src/Screens/EmergencyAlerts";
import ProfileScreen from "./src/Screens/ProfileScreen";
import { Ionicons } from "@expo/vector-icons"; // 🔹 Добавил импорт

const Stack = createStackNavigator();

export default function App() {
  const { isAuth, auth, isLoading } = useUser((state) => state);

  useEffect(() => {
    auth();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#1c1f2a" },
          headerTintColor: "white",
          headerTitleStyle: { fontSize: 20, fontWeight: "bold" },
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <View style={{ paddingLeft: 10 }}>
              <Ionicons name="chevron-back" size={28} color="white" />
            </View>
          ),
        }}
      >
        {isAuth ? (
          <>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ title: "Панель управления" }}
            />
            <Stack.Screen
              name="Chat"
              component={Chat}
              options={{ title: "Чат с оператором" }}
            />
            <Stack.Screen
              name="Report"
              component={IncidentScreen}
              options={{ title: "Сообщить о нарушении" }}
            />
            <Stack.Screen
              name="Alerts"
              component={EmergencyAlerts}
              options={{ title: "Уведомления о ЧС" }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: "Профиль" }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
