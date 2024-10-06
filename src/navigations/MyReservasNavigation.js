import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import MyReservasScreen from '../screens/MyReservasScreen';
import MyDetalleReserva from '../screens/MyDetalleReservaScreen';

import {INFO_CLIENTE} from '../api/api';

const Stack = createStackNavigator();

const LugaresNavigation = () => {
  const isUserLoggedIn = INFO_CLIENTE.length > 0;
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
      <Stack.Screen name="Mis reservas" component={MyReservasScreen} />
      <Stack.Screen name="MyDetalleReserva" component={MyDetalleReserva} />
    </Stack.Navigator>
  );
};

export default LugaresNavigation;
