import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { INFO_CLIENTE } from "../api/api";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import PerfilScreen from "../screens/PerfilScreen";
import SignupScreen from "../screens/SignupScreen";

const Stack = createStackNavigator();

const LoginNavigation = () => {
  // Verificar si el usuario está logueado
  // const isUserLoggedIn = INFO_CLIENTE.length > 0;
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "transparent" },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTransparent: true,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="LoginForm" component={LoginScreen} />
      <Stack.Screen name="Perfil" component={PerfilScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
};

export default LoginNavigation;
