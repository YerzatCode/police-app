import React from "react";
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import Home from "./Screens/Home";
import Chat from "./Screens/Chat";
import Profile from "./Screens/ProfileScreen";
import Incident from "./Screens/Incident";

import ChatList from "./Screens/ChatList";
import Map from "./Screens/Map";

const Tab = createBottomTabNavigator();

const CustomReportButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={styles.customButton}
    onPress={onPress}
    activeOpacity={0.8}
  >
    {children}
  </TouchableOpacity>
);

const TabNavigate = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderRadius: 20,
          height: 55,
          ...styles.shadow,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home-outline"
              size={24}
              color={focused ? "#e32f45" : "#748c94"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ChatList"
        component={ChatList}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="chatbubble-outline"
              size={24}
              color={focused ? "#e32f45" : "#748c94"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Report"
        component={Incident}
        options={{
          tabBarButton: (props) => <CustomReportButton {...props} />,
          tabBarIcon: ({ focused }) => (
            <Ionicons name="alert-circle" size={32} color="#fff" />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={Map}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="map-outline" // Заменил иконку на карту
              size={24}
              color={focused ? "#e32f45" : "#748c94"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="person-outline"
              size={24}
              color={focused ? "#e32f45" : "#748c94"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigate;

const styles = StyleSheet.create({
  customButton: {
    top: -25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e32f45",
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "#fff",
    shadowColor: "#e32f45",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  shadow: {
    shadowColor: "#7F5DF0",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
