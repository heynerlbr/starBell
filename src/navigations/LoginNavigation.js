import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {INFO_CLIENTE} from '../api/api';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import PerfilScreen from '../screens/PerfilScreen';
import RegisterFormScreen from '../screens/RegisterScreen';

const Stack = createStackNavigator();

const LoginNavigation = () => {
  // Verificar si el usuario está logueado
  // const isUserLoggedIn = INFO_CLIENTE.length > 0;
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: 'transparent'},
        headerTintColor: '#fff', // Color de los iconos y texto en el header
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTransparent: true,
        headerTitleAlign: 'center', // Opcional: Alínea el título al centro
      }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Register" component={RegisterFormScreen} />
      <Stack.Screen name="LoginForm" component={LoginScreen} />
      <Stack.Screen name="Perfil" component={PerfilScreen} />
    </Stack.Navigator>
  );
};

export default LoginNavigation;
