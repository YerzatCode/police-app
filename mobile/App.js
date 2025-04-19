import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import React, { useEffect } from "react";
import Login from "./src/Screens/Login";
import Register from "./src/Screens/Register";
import useUser from "./src/Store/user";
import {
  ActivityIndicator,
  SafeAreaViewBase,
  StatusBar,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons"; // 🔹 Добавил импорт
import TabNavigate from "./src/TabNavigate";
import Chat from "./src/Screens/Chat";
import NewsScreen from "./src/Screens/News";
import NewsDetail from "./src/Screens/NewsDetail";

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
      <StatusBar barStyle="light-content" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          headerBackImage: () => (
            <View style={{ paddingLeft: 10 }}>
              <Ionicons name="chevron-back" size={28} color="white" />
            </View>
          ),
        }}
      >
        {isAuth ? (
          <Stack.Group>
            <Stack.Screen name="Tab" component={TabNavigate} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="News" component={NewsScreen} />
            <Stack.Screen
              name="NewsDetail"
              component={NewsDetail}
              options={({ navigation }) => ({
                headerTitle: "Полная новость",
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text
                      style={{ marginLeft: 16, fontSize: 18, color: "#4a90e2" }}
                    >
                      Назад
                    </Text>
                  </TouchableOpacity>
                ),
              })}
            />
          </Stack.Group>
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
