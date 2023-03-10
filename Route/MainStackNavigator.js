import React from "react";
import { StyleSheet, Image, View, Text, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome,MaterialIcons } from "@expo/vector-icons";
import Login from "../Page/Auth/Login";
import HomeScreen from "../Page/Home/HomeScreen";
import ProfileScreen from "../Page/Profile/ProfileScreen";
import PreviousPage from "../Component/Navigation/PreviousPage";
import { BackButton, HomeButton, ChatButton, ProfileButton } from "../Component/Navigation/Icons";
import Selected from "../Page/Select/Selected";
import Tracker from "../Page/Tracker/Tracker";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "#fff",
          borderRadius: 15,
          bottom: 10,
          left: 8,
          right: 8,
          elevation: 1,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="Back"
        component={PreviousPage}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <BackButton />
          ),
        }}
      />
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <HomeButton />
          ),
        }}
      />

      <Tab.Screen
        name="chat"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <ChatButton/>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <ProfileButton/>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
export default function MainStackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={MyTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Selected"
          component={Selected}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Tracker"
          component={Tracker}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Styles = StyleSheet.create({});
